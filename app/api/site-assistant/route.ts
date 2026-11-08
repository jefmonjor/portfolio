import { NextResponse } from "next/server"
import OpenAI from "openai"

import { sanitizeMessages } from "@/lib/assistant/messages"
import { checkLimit, intEnv, requestIp } from "@/lib/assistant/rate-limit"
import { signatureFor } from "@/lib/assistant/signature"
import { buildSiteSystemPrompt } from "@/lib/site-assistant/dossier"
import { readGuardedJson } from "@/server/http/guarded-json"
import {
  siteAssistantReplySchema,
  siteAssistantRequestSchema,
} from "@/types/site-assistant"
import { ASSISTANT_BODY_MAX_BYTES } from "@/types/limits"

export const runtime = "nodejs"

// Same model, budget and per-visitor limits as the /cv assistant: both draw
// on the one daily cap in lib/assistant/rate-limit.
const MODEL = process.env.ASSISTANT_MODEL ?? "gpt-5-mini"
const MAX_OUTPUT_TOKENS = intEnv("ASSISTANT_MAX_OUTPUT_TOKENS", 500)
const MAX_TURNS = intEnv("ASSISTANT_MAX_TURNS", 8)
const MAX_CHARS = intEnv("ASSISTANT_MAX_CHARS", 800)
const ANSWER_DEADLINE_MS = 20_000

const failure = (error: string, status: number) =>
  NextResponse.json({ error }, { status })

export async function POST(request: Request) {
  const body = await readGuardedJson(request, ASSISTANT_BODY_MAX_BYTES)
  if (!body.ok) return body.response

  const parsed = siteAssistantRequestSchema.safeParse(body.value)
  if (!parsed.success) return failure("bad_request", 400)

  const messages = sanitizeMessages(parsed.data.messages, MAX_TURNS, MAX_CHARS)
  if (!messages) return failure("bad_request", 400)

  if (!process.env.OPENAI_API_KEY) return failure("unconfigured", 503)

  if ((await checkLimit(requestIp(request))) !== "ok") {
    return failure("rate_limited", 429)
  }

  const client = new OpenAI({ timeout: ANSWER_DEADLINE_MS, maxRetries: 1 })

  try {
    const response = await client.responses.create({
      model: MODEL,
      instructions: buildSiteSystemPrompt(parsed.data.locale),
      input: messages,
      max_output_tokens: MAX_OUTPUT_TOKENS,
      reasoning: { effort: "minimal" },
      text: { verbosity: "low" },
      store: false,
    })
    await checkLimit.recordUsage(
      response.usage?.total_tokens ?? MAX_OUTPUT_TOKENS
    )

    const text = response.output_text?.trim()
    if (response.status !== "completed" || !text) {
      return failure("upstream", 502)
    }
    return NextResponse.json(
      siteAssistantReplySchema.parse({ reply: text, ...signatureFor(text) })
    )
  } catch (error) {
    if (error instanceof OpenAI.RateLimitError) {
      return failure("rate_limited", 429)
    }
    return failure("upstream", 502)
  }
}
