import { describe, expect, it } from "vitest"

import {
  buildTailoredSummary,
  normalizeTailorModelOutput,
  tailoringEvidence,
} from "@/server/cv/tailoring"
import { CV_TAILOR_SUMMARY_MAX_CHARS } from "@/types/cv-tailor"

describe("CV tailoring evidence", () => {
  it("keeps only canonical skills and project IDs", () => {
    const result = normalizeTailorModelOutput(
      {
        keywords: ["java 21", "ImaginaryDB", "Java 21"],
        projectIds: ["transolido", "made-up", "transolido"],
        unverifiedRequirements: ["Kotlin", "a requirement not in the offer"],
      },
      "Backend role. Kotlin is mandatory.",
      "en"
    )

    expect(result.keywords).toEqual(["Java 21"])
    expect(result.projectIds).toEqual(["transolido"])
    expect(result.unverifiedRequirements).toEqual(["Kotlin"])
  })

  it("uses localized practice labels as selectable evidence", () => {
    expect(tailoringEvidence("es").keywords).toContain(
      "Contratos tipados y validación en fronteras de confianza"
    )
    expect(tailoringEvidence("ca").projectIds).toContain("portfolio")
  })

  it("builds a bounded summary from canonical copy", () => {
    const summary = buildTailoredSummary(
      "Ingeniero de producto con foco en backend.",
      ["Java 21", "Spring Boot 3"],
      ["Transolido"],
      "es"
    )

    expect(summary).toContain("Ingeniero de producto")
    expect(summary).toContain("Java 21")
    expect(summary).toContain("Transolido")
    expect(summary.length).toBeLessThanOrEqual(CV_TAILOR_SUMMARY_MAX_CHARS)
  })
})
