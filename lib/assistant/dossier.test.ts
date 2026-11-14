import { describe, expect, it } from "vitest"

import { buildSystemPrompt } from "@/lib/assistant/dossier"

describe("buildSystemPrompt", () => {
  it.each([
    ["ca", "Ets l'assistent", "DISPONIBILITAT", "Solutions Architect"],
    ["es", "Eres el asistente", "DISPONIBILIDAD", "Solutions Architect"],
    ["en", "You are the assistant", "AVAILABILITY", "Solutions Architect"],
  ] as const)(
    "builds the %s dossier in its requested language",
    (locale, rule, section, positioning) => {
      const prompt = buildSystemPrompt(locale)

      expect(prompt).toContain(rule)
      expect(prompt).toContain(section)
      expect(prompt).toContain("=== DOSSIER ===")
      expect(prompt).toContain(positioning)
      expect(prompt).toContain("POSICIONAMIENTO OBJETIVO")
      expect(prompt).toContain("CARGO ACTUAL")
      expect(prompt).not.toContain("has always lived and worked in Spain")
      expect(prompt).not.toContain("ha vivido y trabajado siempre en España")
      expect(prompt).not.toContain("sempre ha viscut i treballat a Espanya")
    }
  )

  it.each([
    ["ca", "dades no fiables", 'candidat "perfecte"'],
    ["es", "datos no fiables", 'candidato "perfecto"'],
    ["en", "untrusted comparison data", 'a "perfect"'],
  ] as const)(
    "treats pasted offers as untrusted data in %s",
    (locale, rule, noOverselling) => {
      expect(buildSystemPrompt(locale)).toContain(rule)
      expect(buildSystemPrompt(locale)).toContain(noOverselling)
    }
  )

  it("keeps recruiter-critical facts and limits explicit", () => {
    const prompt = buildSystemPrompt("es")

    expect(prompt).toContain(
      "CARGO ACTUAL: Arquitecto de Soluciones / Technical PM — Andbank"
    )
    expect(prompt).toContain("Other Twist [En funcionamiento · Público]")
    expect(prompt).toContain("Inglés (B1 profesional)")
    expect(prompt).toContain("expectativas salariales")
    expect(prompt).toContain("fechas de incorporación")
  })

  it("labels every dossier line in the visitor's language", () => {
    expect(buildSystemPrompt("ca")).toContain("Serveis: ")
    expect(buildSystemPrompt("ca")).not.toContain("Services: ")
    expect(buildSystemPrompt("es")).toContain("Servicios: ")
  })
})
