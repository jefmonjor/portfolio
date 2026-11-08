import { NextResponse } from "next/server"
import OpenAI from "openai"
import { zodTextFormat } from "openai/helpers/zod"

import type { Locale } from "@/i18n/routing"
import {
  asksForCv,
  cvActions,
  cvReply,
  lastOffer,
  offerCvHint,
} from "@/lib/assistant/cv-intent"
import {
  buildDossier,
  buildOfferAnalysisPrompt,
  buildSystemPrompt,
} from "@/lib/assistant/dossier"
import { sanitizeMessages } from "@/lib/assistant/messages"
import {
  looksLikeJobOffer,
  neutralizeOfferDelimiters,
  renderOfferAnalysis,
  verifyOfferAnalysis,
  wrapJobOffer,
} from "@/lib/assistant/offer"
import { checkLimit, intEnv, requestIp } from "@/lib/assistant/rate-limit"
import { signatureFor } from "@/lib/assistant/signature"
import { contactEmail } from "@/lib/email"
import { readGuardedJson } from "@/server/http/guarded-json"
import {
  assistantRequestSchema,
  assistantSuccessSchema,
  offerAnalysisModelOutputSchema,
  type AssistantAction,
  type ModelMessage,
} from "@/types/assistant"
import {
  ASSISTANT_BODY_MAX_BYTES,
  ASSISTANT_MESSAGE_INPUT_CHARS,
} from "@/types/limits"

export const runtime = "nodejs"

const MODEL = process.env.ASSISTANT_MODEL ?? "gpt-5-mini"
const MAX_OUTPUT_TOKENS = intEnv("ASSISTANT_MAX_OUTPUT_TOKENS", 500)
const MAX_TURNS = intEnv("ASSISTANT_MAX_TURNS", 8)
const MAX_CHARS = intEnv("ASSISTANT_MAX_CHARS", 800)
const MAX_PASTED_OFFER_CHARS = Math.min(
  ASSISTANT_MESSAGE_INPUT_CHARS,
  intEnv("ASSISTANT_MAX_OFFER_CHARS", ASSISTANT_MESSAGE_INPUT_CHARS)
)
const OFFER_MAX_OUTPUT_TOKENS = intEnv(
  "ASSISTANT_OFFER_MAX_OUTPUT_TOKENS",
  1600
)
const REASONING = enumEnv(
  "ASSISTANT_REASONING",
  ["minimal", "low", "medium", "high"] as const,
  "minimal"
)
const VERBOSITY = enumEnv(
  "ASSISTANT_VERBOSITY",
  ["low", "medium", "high"] as const,
  "low"
)

const CHAT_ANSWER_DEADLINE_MS = 20_000
const MAX_PAID_RETRIES = 1

function tokensSpent(
  response: { usage?: { total_tokens?: number } | null },
  chargedWhenUnreported: number
): number {
  return response.usage?.total_tokens ?? chargedWhenUnreported
}

function reply(
  text: string,
  actions?: ReadonlyArray<AssistantAction>
): Response {
  return NextResponse.json(
    assistantSuccessSchema.parse({
      reply: text,
      ...signatureFor(text),
      ...(actions ? { actions } : {}),
    })
  )
}

function enumEnv<T extends string>(
  name: string,
  allowed: readonly T[],
  fallback: T
): T {
  const value = process.env[name]
  return allowed.includes(value as T) ? (value as T) : fallback
}

export async function POST(request: Request) {
  const body = await readGuardedJson(request, ASSISTANT_BODY_MAX_BYTES)
  if (!body.ok) return body.response

  const parsed = assistantRequestSchema.safeParse(body.value)
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }

  const messages = sanitizeMessages(
    parsed.data.messages,
    MAX_TURNS,
    MAX_CHARS,
    MAX_PASTED_OFFER_CHARS
  )
  if (!messages) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }

  const locale = parsed.data.locale
  const latest = messages.at(-1)?.content ?? ""

  if (!looksLikeJobOffer(latest) && asksForCv(latest)) {
    const offer = lastOffer(parsed.data.messages)
    return reply(cvReply(locale, offer !== null), cvActions(offer))
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503 })
  }

  if ((await checkLimit(requestIp(request))) !== "ok") {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 })
  }

  const client = new OpenAI({
    timeout: CHAT_ANSWER_DEADLINE_MS,
    maxRetries: MAX_PAID_RETRIES,
  })

  try {
    if (looksLikeJobOffer(latest)) {
      const comparison = await compareOffer(client, latest, locale).catch(
        answerAsChatInstead
      )
      if (comparison) {
        return reply(
          `${comparison}\n\n${offerCvHint(locale)}`,
          cvActions(latest)
        )
      }
    }

    const response = await client.responses.create({
      model: MODEL,
      instructions: buildSystemPrompt(locale),
      input: messages,
      max_output_tokens: MAX_OUTPUT_TOKENS,
      reasoning: { effort: REASONING },
      text: { verbosity: VERBOSITY },
      store: false,
    })
    await checkLimit.recordUsage(tokensSpent(response, MAX_OUTPUT_TOKENS))

    if (response.status !== "completed") {
      return NextResponse.json({ error: "upstream" }, { status: 502 })
    }
    const text = response.output_text?.trim()
    if (!text) {
      return NextResponse.json({ error: "upstream" }, { status: 502 })
    }
    return reply(text)
  } catch (error) {
    if (error instanceof OpenAI.RateLimitError) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 })
    }
    return NextResponse.json({ error: "upstream" }, { status: 502 })
  }
}

function answerAsChatInstead(error: unknown): null {
  if (error instanceof OpenAI.RateLimitError) throw error
  console.error("[assistant] offer comparison failed", {
    message: error instanceof Error ? error.message : String(error),
  })
  return null
}

async function compareOffer(
  client: OpenAI,
  offer: string,
  locale: Locale
): Promise<string | null> {
  const offerAsTheModelSeesIt = neutralizeOfferDelimiters(offer)
  const response = await client.responses.parse({
    model: MODEL,
    instructions: buildOfferAnalysisPrompt(locale),
    input: [
      { role: "user", content: wrapJobOffer(offerAsTheModelSeesIt) },
    ] satisfies ModelMessage[],
    max_output_tokens: OFFER_MAX_OUTPUT_TOKENS,
    reasoning: { effort: REASONING },
    text: {
      format: zodTextFormat(offerAnalysisModelOutputSchema, "offer_analysis"),
      verbosity: "low",
    },
    store: false,
  })
  await checkLimit.recordUsage(tokensSpent(response, OFFER_MAX_OUTPUT_TOKENS))
  if (response.status !== "completed" || !response.output_parsed) return null

  const verified = verifyOfferAnalysis(
    response.output_parsed,
    offerAsTheModelSeesIt,
    buildDossier(locale)
  )
  return verified ? renderOfferAnalysis(verified, locale, contactEmail()) : null
}
