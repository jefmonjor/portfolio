import { NextResponse } from "next/server"
import OpenAI from "openai"
import { z } from "zod"

import type { Locale } from "@/i18n/routing"
import { buildSystemPrompt } from "@/lib/assistant/dossier"
import { checkLimit, intEnv, requestIp } from "@/lib/assistant/rate-limit"
import {
  CV_TAILOR_KEYWORDS_MAX,
  CV_TAILOR_OFFER_MAX_CHARS,
  CV_TAILOR_SUMMARY_MAX_CHARS,
  cvTailorRequestSchema,
  cvTailorResponseSchema,
} from "@/types/cv-tailor"

export const runtime = "nodejs"

const MODEL = process.env.ASSISTANT_MODEL ?? "gpt-5-mini"
const MAX_OFFER_CHARS = Math.max(
  40,
  intEnv("CV_TAILOR_MAX_OFFER_CHARS", CV_TAILOR_OFFER_MAX_CHARS)
)

const TASK: Record<Locale, string> = {
  ca: `TASCA ESPECIAL — adaptar el CV a una oferta de feina.
A sota hi ha el text d'una oferta. Amb NOMÉS la informació del dossier:
1. Escriu un resum professional de 3-4 frases (màx. 700 caràcters) que connecti l'experiència REAL de Jefferson amb el que demana l'oferta. Tercera persona, sense inventar res: si l'oferta demana alguna cosa que Jefferson no té, no l'esmentis.
2. Tria fins a 12 paraules clau del dossier que coincideixin amb l'oferta (tecnologies, pràctiques, sectors).
Respon NOMÉS amb JSON vàlid: {"summary": "...", "keywords": ["...", "..."]}

OFERTA:
`,
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

const upstreamTailoredSchema = z
  .object({
    summary: z.string(),
    keywords: z.array(z.string()).optional().default([]),
  })
  .strict()

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

  const parsed = cvTailorRequestSchema.safeParse(input)
  if (!parsed.success) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 })
  }
  const offer = parsed.data.offer.slice(0, MAX_OFFER_CHARS)

  if (checkLimit(requestIp(request)) !== "ok") {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 })
  }

  const client = new OpenAI()

  try {
    const response = await client.responses.create({
      model: MODEL,
      instructions: buildSystemPrompt(parsed.data.locale),
      input: [{ role: "user", content: TASK[parsed.data.locale] + offer }],
      max_output_tokens: 600,
      reasoning: { effort: "low" },
      text: { verbosity: "low" },
    })

    const raw = response.output_text?.trim() ?? ""
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) {
      return NextResponse.json({ error: "upstream" }, { status: 502 })
    }
    const upstream = upstreamTailoredSchema.safeParse(JSON.parse(match[0]))
    if (!upstream.success) {
      return NextResponse.json({ error: "upstream" }, { status: 502 })
    }

    const result = cvTailorResponseSchema.safeParse({
      summary: upstream.data.summary
        .trim()
        .slice(0, CV_TAILOR_SUMMARY_MAX_CHARS),
      keywords: upstream.data.keywords
        .map((keyword) => keyword.trim())
        .filter(Boolean)
        .slice(0, CV_TAILOR_KEYWORDS_MAX),
    })
    if (!result.success) {
      return NextResponse.json({ error: "upstream" }, { status: 502 })
    }
    return NextResponse.json(result.data)
  } catch (error) {
    if (error instanceof OpenAI.RateLimitError) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 })
    }
    return NextResponse.json({ error: "upstream" }, { status: 502 })
  }
}
