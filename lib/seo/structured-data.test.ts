import { describe, expect, it } from "vitest"

import {
  buildProfileStructuredData,
  serializeStructuredData,
} from "@/lib/seo/structured-data"

describe("profile structured data", () => {
  it("links the localized profile page to one stable person identity", () => {
    const data = buildProfileStructuredData({
      locale: "es",
      title: "Jefferson Montesdeoca — Arquitecto de Soluciones",
      description: "Perfil profesional de Jefferson.",
      role: "Arquitecto de Soluciones",
    })

    expect(data["@context"]).toBe("https://schema.org")
    expect(data["@graph"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "@type": "ProfilePage",
          url: "https://www.jefmonjor.dev/es",
          inLanguage: "es",
          mainEntity: { "@id": "https://www.jefmonjor.dev/#person" },
        }),
        expect.objectContaining({
          "@type": "Person",
          "@id": "https://www.jefmonjor.dev/#person",
          name: "Jefferson Montesdeoca Jordán",
          jobTitle: "Arquitecto de Soluciones",
        }),
      ])
    )
  })

  it("escapes markup-significant characters before embedding JSON", () => {
    expect(serializeStructuredData({ value: "</script>" })).toBe(
      '{"value":"\\u003c/script>"}'
    )
  })
})
