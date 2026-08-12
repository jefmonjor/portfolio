import { NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

import { buildSystemPrompt } from "@/lib/assistant/dossier"

export const runtime = "nodejs"

const MODEL = process.env.ASSISTANT_MODEL ?? "claude-opus-5"
const MAX_TURNS = 12
const MAX_CHARS = 1500

// In-memory per-IP limits, on purpose: one small serverless instance, no Redis
// to run. Counters reset on cold start and are per-instance — good enough as a
// first line of defense for a portfolio assistant.
const RATE_MINUTE = 6
const RATE_DAILY = 40
const recent = new Map<string, number[]>()
const daily = new Map<string, { start: number; count: number }>()

function checkLimit(ip: string): "ok" | "minute" | "daily" {
  const now = Date.now()

  const day = daily.get(ip)
  if (day && now - day.start < 86_400_000) {
    if (day.count >= RATE_DAILY) return "daily"
    day.count += 1
  } else {
    daily.set(ip, { start: now, count: 1 })
  }

  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 60_000)
  if (hits.length >= RATE_MINUTE) return "minute"
  hits.push(now)
  recent.set(ip, hits)
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
    if (typeof content !== "string" || content.length === 0) return null
    out.push({ role, content: content.slice(0, MAX_CHARS) })
  }
  if (out[0]?.role !== "user" || out[out.length - 1]?.role !== "user")
    return null
  return out
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503 })
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  const limit = checkLimit(ip)
  if (limit !== "ok") {
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

  const client = new Anthropic()

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 600,
      // Server-side fallback: if safety classifiers decline, retry on the
      // recommended fallback model instead of failing the visitor's question.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: [
        {
          type: "text",
          text: buildSystemPrompt(locale),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages,
    })

    if (response.stop_reason === "refusal") {
      return NextResponse.json({ error: "refused" }, { status: 200 })
    }

    const reply = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim()

    if (!reply) {
      return NextResponse.json({ error: "empty" }, { status: 200 })
    }
    return NextResponse.json({ reply })
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 })
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: "upstream" }, { status: 502 })
    }
    return NextResponse.json({ error: "upstream" }, { status: 502 })
  }
}
