import { describe, expect, it } from "vitest"

import { buildSystemPrompt } from "@/lib/assistant/dossier"

describe("buildSystemPrompt", () => {
  it.each([
    ["ca", "Ets l'assistent", "DISPONIBILITAT"],
    ["es", "Eres el asistente", "DISPONIBILIDAD"],
    ["en", "You are the assistant", "AVAILABILITY"],
  ] as const)(
    "builds the %s dossier in its requested language",
    (locale, rule, section) => {
      const prompt = buildSystemPrompt(locale)

      expect(prompt).toContain(rule)
      expect(prompt).toContain(section)
      expect(prompt).toContain("=== DOSSIER ===")
    }
  )
})
