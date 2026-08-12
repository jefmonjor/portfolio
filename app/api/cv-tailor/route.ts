import { NextResponse } from "next/server"
import OpenAI from "openai"

import { buildSystemPrompt } from "@/lib/assistant/dossier"
import { checkLimit, intEnv, requestIp } from "@/lib/assistant/rate-limit"

export const runtime = "nodejs"

const MODEL = process.env.ASSISTANT_MODEL ?? "gpt-5-mini"
const MAX_OFFER_CHARS = intEnv("CV_TAILOR_MAX_OFFER_CHARS", 4000)

const TASK: Record<"es" | "en", string> = {
  es: `TAREA ESPECIAL — adaptar el CV a una oferta de trabajo.
Debajo va el texto de una oferta. Con SOLO la información del dossier:
1. Escribe un resumen profesional de 3-4 frases (máx. 700 caracteres) que conecte la experiencia REAL de Jefferson con lo que pide la oferta. Tercera persona, sin inventar nada: si la oferta pide algo que Jefferson no tiene, no lo menciones.
2. Elige hasta 12 palabras clave del dossier que coincidan con la oferta (tecnologías, prácticas, sectores).
Responde SOLO con JSON válido: {"summary": "...", "keywords": ["...", "..."]}

OFERTA:
`,
  en: `SPECIAL TASK — tailor the CV to a job offer.
Below is a job offer. Using ONLY dossier information:
1. Write a 3-4 sentence professional summary (max 700 characters) connecting Jefferson's REAL experience with what the offer asks for. Third person, invent nothing: if the offer asks for something Jefferson lacks, do not mention it.
2. Pick up to 12 keywords from the dossier that match the offer (technologies, practices, sectors).
Reply ONLY with valid JSON: {"summary": "...", "keywords": ["...", "..."]}

OFFER:
`,
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "unconfigured" }, { status: 503 })
  }

  if (checkLimit(requestIp(request)) !== "ok") {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 })
  }

  let body: { offer?: unknown; locale?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }

  const offer =
    typeof body.offer === "string" ? body.offer.trim().slice(0, MAX_OFFER_CHARS) : ""
  if (offer.length < 40) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }
  const locale = body.locale === "en" ? "en" : "es"

  const client = new OpenAI()

  try {
    const response = await client.responses.create({
      model: MODEL,
      instructions: buildSystemPrompt(locale),
      input: [{ role: "user", content: TASK[locale] + offer }],
      max_output_tokens: 600,
      reasoning: { effort: "low" },
      text: { verbosity: "low" },
    })

    const raw = response.output_text?.trim() ?? ""
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) {
      return NextResponse.json({ error: "upstream" }, { status: 502 })
    }
    const parsed = JSON.parse(match[0]) as {
      summary?: unknown
      keywords?: unknown
    }
    const summary =
      typeof parsed.summary === "string" ? parsed.summary.trim().slice(0, 900) : ""
    const keywords = Array.isArray(parsed.keywords)
      ? parsed.keywords
          .filter((k): k is string => typeof k === "string")
          .map((k) => k.trim())
          .filter(Boolean)
          .slice(0, 15)
      : []
    if (!summary) {
      return NextResponse.json({ error: "upstream" }, { status: 502 })
    }
    return NextResponse.json({ summary, keywords })
  } catch (error) {
    if (error instanceof OpenAI.RateLimitError) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 })
    }
    return NextResponse.json({ error: "upstream" }, { status: 502 })
  }
}
