import { describe, expect, it } from "vitest"

import { buildSiteSystemPrompt } from "@/lib/site-assistant/dossier"

describe("buildSiteSystemPrompt", () => {
  it.each([
    ["en", "You are the assistant of Jefferson Montesdeoca", "SERVICES", "/contact"],
    ["es", "Eres el asistente de Jefferson Montesdeoca", "SERVICIOS", "/es/contact"],
  ] as const)(
    "builds the %s prompt from the site content",
    (locale, rule, section, briefPath) => {
      const prompt = buildSiteSystemPrompt(locale)

      expect(prompt).toContain(rule)
      expect(prompt).toContain("=== DOSSIER ===")
      expect(prompt).toContain(section)
      expect(prompt).toContain(`https://www.jefmonjor.dev${briefPath}`)
      expect(prompt).toContain("SpecForge")
      expect(prompt).toContain("Transolido")
    }
  )

  it("sends visitors to the site address, never the personal one", () => {
    for (const locale of ["en", "es"] as const) {
      const prompt = buildSiteSystemPrompt(locale)
      expect(prompt).toContain("hola@jefmonjor.dev")
      expect(prompt).not.toContain("gmail")
    }
  })

  it("keeps prices and confidential bank details out", () => {
    const prompt = buildSiteSystemPrompt("en")
    expect(prompt).toContain("rates are sent in the written proposal")
    expect(prompt).not.toMatch(/12[.,]000|40\+ VMs/)
  })

  it("knows his own products and the technologies he works with", () => {
    const prompt = buildSiteSystemPrompt("es")
    for (const product of ["Corte1D", "PRONOQ", "SpecForge", "Ilnami"]) {
      expect(prompt).toContain(product)
    }
    expect(prompt).toContain("Spring Boot")
    expect(prompt).toContain("TECNOLOGÍAS CON LAS QUE TRABAJA")
  })

  it("asks it to help with the visitor's own sector instead of refusing", () => {
    expect(buildSiteSystemPrompt("es")).toContain("concesionario de coches")
    expect(buildSiteSystemPrompt("en")).toContain("car dealership")
  })
})
