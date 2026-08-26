import { describe, expect, it } from "vitest"

import {
  buildProfileStructuredData,
  serializeStructuredData,
} from "@/lib/seo/structured-data"

describe("profile structured data", () => {
  it("links the localized profile page to one stable person identity", () => {
    const data = buildProfileStructuredData({
      locale: "es",
      title: "Jefferson Montesdeoca — Product Engineer · IA y Backend",
      description: "Perfil profesional de Jefferson.",
      currentJobTitle: "Arquitecto de Soluciones / Technical PM",
      publicProjects: [
        {
          id: "corte1d",
          name: "Corte1D",
          description: "Optimización determinista de corte 1D.",
          url: "https://corte1d.jefmonjor.dev",
          keywords: ["Next.js", "PWA"],
        },
      ],
    })

    expect(data["@context"]).toBe("https://schema.org")
    expect(data["@graph"]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          "@type": "ProfilePage",
          url: "https://www.jefmonjor.dev/es",
          inLanguage: "es",
          mainEntity: { "@id": "https://www.jefmonjor.dev/#person" },
          hasPart: [
            { "@id": "https://www.jefmonjor.dev/#project-corte1d" },
          ],
        }),
        expect.objectContaining({
          "@type": "Person",
          "@id": "https://www.jefmonjor.dev/#person",
          name: "Jefferson Montesdeoca Jordán",
          jobTitle: "Arquitecto de Soluciones / Technical PM",
          knowsLanguage: expect.arrayContaining([
            expect.objectContaining({ alternateName: "es" }),
            expect.objectContaining({ alternateName: "en" }),
          ]),
        }),
        expect.objectContaining({
          "@type": "CreativeWork",
          "@id": "https://www.jefmonjor.dev/#project-corte1d",
          name: "Corte1D",
          creator: { "@id": "https://www.jefmonjor.dev/#person" },
        }),
      ])
    )
  })

  it("publishes the certification body as a credential, never as an alma mater", () => {
    const data = buildProfileStructuredData({
      locale: "en",
      title: "Jefferson Montesdeoca — Product Engineer · AI & Backend",
      description: "Professional profile.",
      currentJobTitle: "Solutions Architect / Technical PM",
      publicProjects: [],
    })
    const person = data["@graph"].find(
      (node) => "@type" in node && node["@type"] === "Person"
    ) as { alumniOf: ReadonlyArray<{ name: string }> }

    expect(person.alumniOf.map(({ name }) => name)).toEqual([
      "Universidad de Sevilla",
    ])
  })

  it("states the occupation for agents that read the graph, not the prose", () => {
    const data = buildProfileStructuredData({
      locale: "en",
      title: "Jefferson Montesdeoca — Product Engineer · AI & Backend",
      description: "Professional profile.",
      currentJobTitle: "Solutions Architect / Technical PM",
      publicProjects: [],
    })
    const person = data["@graph"].find(
      (node) => "@type" in node && node["@type"] === "Person"
    ) as { hasOccupation: { name: string; occupationalCategory: string } }

    expect(person.hasOccupation.name).toBe("Solutions Architect / Technical PM")
    expect(person.hasOccupation.occupationalCategory).toContain("15-1252.00")
  })

  it("escapes markup-significant characters before embedding JSON", () => {
    expect(serializeStructuredData({ value: "</script>" })).toBe(
      '{"value":"\\u003c/script>"}'
    )
  })
})
