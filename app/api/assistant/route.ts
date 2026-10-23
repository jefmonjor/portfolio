import { NextResponse } from "next/server"
import OpenAI from "openai"
import { zodTextFormat } from "openai/helpers/zod"

import type { Locale } from "@/i18n/routing"
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
import { contactEmail } from "@/lib/email"
import { readJsonBody } from "@/server/http/read-json-body"
import {
  assistantRequestSchema,
  assistantSuccessSchema,
  offerAnalysisModelOutputSchema,
  type ChatMessage,
} from "@/types/assistant"
import {
  ASSISTANT_BODY_MAX_BYTES,
  ASSISTANT_MESSAGE_INPUT_CHARS,
} from "@/types/limits"

export const runtime = "nodejs"

// Cost controls — every knob is overridable per environment without a deploy.
const MODEL = process.env.ASSISTANT_MODEL ?? "gpt-5-mini"
const MAX_OUTPUT_TOKENS = intEnv("ASSISTANT_MAX_OUTPUT_TOKENS", 500)
const MAX_TURNS = intEnv("ASSISTANT_MAX_TURNS", 8)
const MAX_CHARS = intEnv("ASSISTANT_MAX_CHARS", 800)
// The latest message may be a full job offer; cutting it at MAX_CHARS used to
// compare the profile against half a posting.
const MAX_LAST_CHARS = Math.min(
  ASSISTANT_MESSAGE_INPUT_CHARS,
  intEnv("ASSISTANT_MAX_OFFER_CHARS", ASSISTANT_MESSAGE_INPUT_CHARS)
)
// The structured comparison spends part of its budget reasoning about which
// quote backs which requirement.
const OFFER_MAX_OUTPUT_TOKENS = intEnv(
  "ASSISTANT_OFFER_MAX_OUTPUT_TOKENS",
  1600
)
// gpt-5 models reason before answering by default, which adds several seconds
// of latency. A closed-dossier Q&A bot doesn't need it.
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

function enumEnv<T extends string>(
  name: string,
  allowed: readonly T[],
  fallback: T
): T {
  const value = process.env[name]
  return allowed.includes(value as T) ? (value as T) : fallback
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503 })
  }

  const body = await readJsonBody(request, ASSISTANT_BODY_MAX_BYTES)
  if (!body.ok) {
    return NextResponse.json(
      { error: body.status === 413 ? "too_large" : "bad_request" },
      { status: body.status }
    )
  }

  const parsed = assistantRequestSchema.safeParse(body.value)
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }

  const messages = sanitizeMessages(
    parsed.data.messages,
    MAX_TURNS,
    MAX_CHARS,
    MAX_LAST_CHARS
  )
  if (!messages) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }

  if (checkLimit(requestIp(request)) !== "ok") {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 })
  }

  const client = new OpenAI()
  const locale = parsed.data.locale
  const latest = messages.at(-1)?.content ?? ""

  try {
    if (looksLikeJobOffer(latest)) {
      const reply = await compareOffer(client, latest, locale).catch(
        (error: unknown) => {
          if (error instanceof OpenAI.RateLimitError) throw error
          // The structured pass is a safeguard, not a dependency: if it
          // fails, the question still gets the normal, rule-bound answer.
          console.error("[assistant] offer comparison failed", {
            message: error instanceof Error ? error.message : String(error),
          })
          return null
        }
      )
      if (reply) {
        return NextResponse.json(assistantSuccessSchema.parse({ reply }))
      }
      // Not an offer after all, or nothing survived verification: answer it
      // as a normal question, under the same rules.
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

    if (response.status !== "completed") {
      return NextResponse.json({ error: "upstream" }, { status: 502 })
    }
    const reply = response.output_text?.trim()
    if (!reply) {
      return NextResponse.json({ error: "upstream" }, { status: 502 })
    }
    return NextResponse.json(assistantSuccessSchema.parse({ reply }))
  } catch (error) {
    if (error instanceof OpenAI.RateLimitError) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 })
    }
    return NextResponse.json({ error: "upstream" }, { status: 502 })
  }
}

async function compareOffer(
  client: OpenAI,
  offer: string,
  locale: Locale
): Promise<string | null> {
  // What the model sees and what its requirements are checked against must
  // be the same text.
  const text = neutralizeOfferDelimiters(offer)
  const response = await client.responses.parse({
    model: MODEL,
    instructions: buildOfferAnalysisPrompt(locale),
    input: [
      { role: "user", content: wrapJobOffer(text) },
    ] satisfies ChatMessage[],
    max_output_tokens: OFFER_MAX_OUTPUT_TOKENS,
    reasoning: { effort: REASONING },
    text: {
      format: zodTextFormat(offerAnalysisModelOutputSchema, "offer_analysis"),
      verbosity: "low",
    },
    store: false,
  })
  if (response.status !== "completed" || !response.output_parsed) return null

  const verified = verifyOfferAnalysis(
    response.output_parsed,
    text,
    buildDossier(locale)
  )
  return verified ? renderOfferAnalysis(verified, locale, contactEmail()) : null
}
