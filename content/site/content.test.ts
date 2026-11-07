import { describe, expect, it } from "vitest"

import { diagramLimits } from "@/components/site/architecture-diagram"
import { en } from "@/content/site/en"
import { es } from "@/content/site/es"
import { caseStudySlugs, type SiteContent } from "@/content/site/types"

const languages: ReadonlyArray<[string, SiteContent]> = [
  ["en", en],
  ["es", es],
]

function shapeOf(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shapeOf)
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, shapeOf(child)])
    )
  }
  return typeof value
}

describe("site content", () => {
  it("has the same structure in English and Spanish", () => {
    expect(shapeOf(es)).toEqual(shapeOf(en))
  })

  it.each(languages)("publishes every case study once (%s)", (_, content) => {
    expect(content.work.cases.map((study) => study.slug)).toEqual([
      ...caseStudySlugs,
    ])
  })

  it.each(languages)(
    "keeps every diagram legible at 390px (%s)",
    (_, content) => {
      for (const study of content.work.cases) {
        expect(study.diagram.length).toBeLessThanOrEqual(diagramLimits.nodes)
        for (const node of study.diagram) {
          expect(node.label.length).toBeLessThanOrEqual(
            diagramLimits.labelCharacters
          )
          expect(node.detail.length).toBeLessThanOrEqual(
            diagramLimits.detailCharacters
          )
        }
      }
    }
  )

  it.each(languages)("fits search result snippets (%s)", (_, content) => {
    const metas = [
      ...Object.values(content.meta),
      ...content.work.cases.map((study) => study.meta),
    ]
    for (const meta of metas) {
      expect(meta.description.length).toBeLessThanOrEqual(200)
      expect(meta.title.length).toBeLessThanOrEqual(80)
    }
  })

  it.each(languages)("publishes no rates (%s)", (_, content) => {
    expect(JSON.stringify(content)).not.toMatch(/[€$£]\s?\d|\d\s?(€|EUR|USD)/)
  })
})
