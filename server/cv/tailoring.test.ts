import { describe, expect, it } from "vitest"

import {
  buildTailoredSummary,
  normalizeTailorModelOutput,
  tailoringEvidence,
} from "@/server/cv/tailoring"
import {
  CV_TAILOR_REQUIREMENT_MAX_CHARS,
  CV_TAILOR_SUMMARY_MAX_CHARS,
  cvTailoredContentSchema,
} from "@/types/cv-tailor"

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

  // The model contract can no longer bound string lengths, so an oversized
  // excerpt has to die here rather than at the renderer contract, where it
  // would surface as a 502.
  it("drops selections that exceed the renderer bounds", () => {
    const requirement = "K".repeat(CV_TAILOR_REQUIREMENT_MAX_CHARS + 1)
    const result = normalizeTailorModelOutput(
      {
        keywords: ["Java 21"],
        projectIds: ["transolido"],
        unverifiedRequirements: [requirement, "Kotlin"],
      },
      `Backend role. ${requirement} Kotlin is mandatory.`,
      "en"
    )

    expect(result.unverifiedRequirements).toEqual(["Kotlin"])
    expect(
      cvTailoredContentSchema.safeParse({ ...result, summary: "Summary." })
        .success
    ).toBe(true)
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
