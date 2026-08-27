import { describe, expect, it } from "vitest"

import {
  buildTailoredSummary,
  normalizeTailorModelOutput,
  prioritizeItems,
  tailoringEvidence,
} from "@/server/cv/tailoring"
import {
  CV_TAILOR_SUMMARY_MAX_CHARS,
  cvTailoredContentSchema,
} from "@/types/cv-tailor"

describe("CV tailoring evidence", () => {
  it("keeps only canonical skills and project IDs", () => {
    const result = normalizeTailorModelOutput(
      {
        keywords: ["java 21", "ImaginaryDB", "Java 21"],
        projectIds: ["transolido", "made-up", "transolido"],
      },
      "en"
    )

    expect(result.keywords).toEqual(["Java 21"])
    expect(result.projectIds).toEqual(["transolido"])
  })

  // The model contract can no longer bound string lengths, so anything the
  // renderer contract would reject has to die here — where it costs a worse
  // selection instead of a 502.
  it("drops selections the renderer contract would reject", () => {
    const result = normalizeTailorModelOutput(
      { keywords: ["K".repeat(500), "Java 21"], projectIds: ["transolido"] },
      "en"
    )

    expect(result.keywords).toEqual(["Java 21"])
    expect(
      cvTailoredContentSchema.safeParse({ ...result, summary: "Summary." })
        .success
    ).toBe(true)
  })

  // A CV written for one offer must never carry less than the technical one.
  it("orders the selection first without dropping anything", () => {
    const projects = ["transolido", "othertales", "corte1d", "contactqr"]
    const ordered = prioritizeItems(projects, ["corte1d", "contactqr"])

    expect(ordered).toEqual([
      "corte1d",
      "contactqr",
      "transolido",
      "othertales",
    ])
    expect([...ordered].sort()).toEqual([...projects].sort())
  })

  it("leaves the order untouched when nothing was selected", () => {
    const projects = ["transolido", "othertales", "corte1d"]

    expect(prioritizeItems(projects, [])).toEqual(projects)
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
