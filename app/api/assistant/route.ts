import { NextResponse } from "next/server"
import OpenAI from "openai"

import { buildSystemPrompt } from "@/lib/assistant/dossier"
import { sanitizeMessages } from "@/lib/assistant/messages"
import { checkLimit, intEnv, requestIp } from "@/lib/assistant/rate-limit"
import {
  assistantRequestSchema,
  assistantSuccessSchema,
} from "@/types/assistant"

export const runtime = "nodejs"

// Cost controls — every knob is overridable per environment without a deploy.
const MODEL = process.env.ASSISTANT_MODEL ?? "gpt-5-mini"
const MAX_OUTPUT_TOKENS = intEnv("ASSISTANT_MAX_OUTPUT_TOKENS", 500)
const MAX_TURNS = intEnv("ASSISTANT_MAX_TURNS", 8)
const MAX_CHARS = intEnv("ASSISTANT_MAX_CHARS", 800)
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

  let input: unknown
  try {
    input = await request.json()
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }

  const parsed = assistantRequestSchema.safeParse(input)
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }

  const messages = sanitizeMessages(parsed.data.messages, MAX_TURNS, MAX_CHARS)
  if (!messages) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }

  if (checkLimit(requestIp(request)) !== "ok") {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 })
  }

  const client = new OpenAI()

  try {
    const response = await client.responses.create({
      model: MODEL,
      instructions: buildSystemPrompt(parsed.data.locale),
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
