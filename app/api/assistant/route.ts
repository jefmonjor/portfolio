import { NextResponse } from "next/server"
import OpenAI from "openai"

import { buildSystemPrompt } from "@/lib/assistant/dossier"

export const runtime = "nodejs"

// Cost controls — every knob is overridable per environment without a deploy.
const MODEL = process.env.ASSISTANT_MODEL ?? "gpt-5-mini"
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
const MAX_OUTPUT_TOKENS = intEnv("ASSISTANT_MAX_OUTPUT_TOKENS", 400)
const MAX_TURNS = intEnv("ASSISTANT_MAX_TURNS", 8)
const MAX_CHARS = intEnv("ASSISTANT_MAX_CHARS", 800)
const RATE_MINUTE = intEnv("ASSISTANT_RATE_MINUTE", 4)
const RATE_DAILY = intEnv("ASSISTANT_RATE_DAILY", 20)
// Hard ceiling across ALL visitors: even a botnet can't run up the bill.
const GLOBAL_DAILY = intEnv("ASSISTANT_GLOBAL_DAILY", 300)

function intEnv(name: string, fallback: number): number {
  const value = Number.parseInt(process.env[name] ?? "", 10)
  return Number.isFinite(value) && value > 0 ? value : fallback
}

function enumEnv<T extends string>(
  name: string,
  allowed: readonly T[],
  fallback: T
): T {
  const value = process.env[name]
  return allowed.includes(value as T) ? (value as T) : fallback
}

// In-memory on purpose: one small serverless instance, no Redis to run.
// Counters reset on cold start and are per-instance — combined with the
// global daily ceiling this bounds worst-case spend.
const recent = new Map<string, number[]>()
const daily = new Map<string, { start: number; count: number }>()
let globalDay = { start: Date.now(), count: 0 }

function checkLimit(ip: string): "ok" | "limited" {
  const now = Date.now()

  if (now - globalDay.start > 86_400_000) {
    globalDay = { start: now, count: 0 }
  }
  if (globalDay.count >= GLOBAL_DAILY) return "limited"

  const day = daily.get(ip)
  if (day && now - day.start < 86_400_000) {
    if (day.count >= RATE_DAILY) return "limited"
  } else {
    daily.set(ip, { start: now, count: 0 })
  }

  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 60_000)
  if (hits.length >= RATE_MINUTE) return "limited"

  hits.push(now)
  recent.set(ip, hits)
  daily.get(ip)!.count += 1
  globalDay.count += 1
  return "ok"
}

type ChatMessage = { role: "user" | "assistant"; content: string }

function sanitize(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) return null
  const out: ChatMessage[] = []
  for (const item of input.slice(-MAX_TURNS)) {
    if (
      typeof item !== "object" ||
      item === null ||
      !("role" in item) ||
      !("content" in item)
    )
      return null
    const role = (item as ChatMessage).role
    const content = (item as ChatMessage).content
    if (role !== "user" && role !== "assistant") return null
    if (typeof content !== "string" || content.trim().length === 0) return null
    out.push({ role, content: content.slice(0, MAX_CHARS) })
  }
  if (out[0]?.role !== "user" || out[out.length - 1]?.role !== "user")
    return null
  return out
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503 })
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  if (checkLimit(ip) !== "ok") {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 })
  }

  let body: { messages?: unknown; locale?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }

  const messages = sanitize(body.messages)
  if (!messages) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }
  const locale = body.locale === "en" ? "en" : "es"

  const client = new OpenAI()

  try {
    const response = await client.responses.create({
      model: MODEL,
      instructions: buildSystemPrompt(locale),
      input: messages,
      max_output_tokens: MAX_OUTPUT_TOKENS,
      reasoning: { effort: REASONING },
      text: { verbosity: VERBOSITY },
    })

    const reply = response.output_text?.trim()
    if (!reply) {
      return NextResponse.json({ error: "empty" }, { status: 200 })
    }
    return NextResponse.json({ reply })
  } catch (error) {
    if (error instanceof OpenAI.RateLimitError) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 })
    }
    return NextResponse.json({ error: "upstream" }, { status: 502 })
  }
}
