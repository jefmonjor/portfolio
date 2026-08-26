import { describe, expect, it } from "vitest"

import ca from "@/messages/ca.json"
import en from "@/messages/en.json"
import es from "@/messages/es.json"

import { profile } from "@/lib/profile"

describe("public profile content", () => {
  it("keeps project delivery stage separate from visibility", () => {
    expect(
      profile.projects.map(({ id, stage, visibility }) => ({
        id,
        stage,
        visibility,
      }))
    ).toEqual([
      { id: "othertales", stage: "development", visibility: "private" },
      { id: "transolido", stage: "live", visibility: "public" },
      { id: "porrix", stage: "live", visibility: "public" },
      { id: "corte1d", stage: "live", visibility: "public" },
      { id: "tavory", stage: "development", visibility: "private" },
      { id: "contactqr", stage: "live", visibility: "public" },
      { id: "portfolio", stage: "live", visibility: "public" },
    ])

    for (const project of profile.projects) {
      if (project.visibility === "public") expect(project.url).toBeTruthy()
      if (project.visibility === "private") expect(project.url).toBeUndefined()
    }
  })

  it("keeps localized message keys aligned", () => {
    expect(sortedLeafPaths(es)).toEqual(sortedLeafPaths(en))
    expect(sortedLeafPaths(ca)).toEqual(sortedLeafPaths(en))
  })

  it("does not publish the retired fixed product count or inflated phrases", () => {
    const publishedCopy = JSON.stringify({ en, es, ca })

    expect(publishedCopy).not.toMatch(/eight products|ocho productos|vuit productes/i)
    expect(publishedCopy).not.toMatch(/AI-built|construidos con IA|construïts amb IA/i)
    expect(publishedCopy).not.toMatch(/Playwright E2E|CLAUDE\.md en cada|CLAUDE\.md in every/i)
  })
})

function sortedLeafPaths(
  value: unknown,
  prefix = ""
): ReadonlyArray<string> {
  if (Array.isArray(value)) return [prefix]
  if (value === null || typeof value !== "object") return [prefix]

  return Object.entries(value)
    .flatMap(([key, child]) =>
      sortedLeafPaths(child, prefix ? `${prefix}.${key}` : key)
    )
    .sort()
}
