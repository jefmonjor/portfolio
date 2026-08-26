import { describe, expect, it } from "vitest"
import { zodTextFormat } from "openai/helpers/zod"

import {
  ASSISTANT_HISTORY_INPUT_MESSAGES,
  assistantRequestSchema,
} from "@/types/assistant"
import { cvPdfVariantSchema } from "@/types/cv"
import {
  CV_TAILOR_OFFER_MAX_CHARS,
  cvTailoredContentSchema,
  cvTailorModelOutputSchema,
  cvTailorRequestSchema,
} from "@/types/cv-tailor"

describe("API contracts", () => {
  it("normalizes an unsupported assistant locale to Spanish", () => {
    const result = assistantRequestSchema.parse({
      locale: "fr",
      messages: [{ role: "user", content: "Hola" }],
    })

    expect(result.locale).toBe("es")
  })

  it("normalizes public CV variants and legacy values", () => {
    expect(cvPdfVariantSchema.parse("general")).toBe("general")
    expect(cvPdfVariantSchema.parse("technical")).toBe("technical")
    expect(cvPdfVariantSchema.parse("full")).toBe("general")
    expect(cvPdfVariantSchema.parse("ats")).toBe("technical")
    expect(cvPdfVariantSchema.parse("unexpected")).toBe("general")
  })

  it("rejects extra request fields and oversized offers", () => {
    expect(
      assistantRequestSchema.safeParse({
        locale: "es",
        messages: [{ role: "user", content: "Hola" }],
        ignored: true,
      }).success
    ).toBe(false)

    expect(
      cvTailorRequestSchema.safeParse({
        locale: "es",
        offer: "x".repeat(CV_TAILOR_OFFER_MAX_CHARS + 1),
      }).success
    ).toBe(false)

    expect(
      assistantRequestSchema.safeParse({
        locale: "es",
        messages: Array.from(
          { length: ASSISTANT_HISTORY_INPUT_MESSAGES + 1 },
          () => ({ role: "user", content: "Hola" })
        ),
      }).success
    ).toBe(false)
  })

  it("rejects malformed tailored-CV responses", () => {
    expect(
      cvTailorModelOutputSchema.safeParse({
        keywords: [42],
        projectIds: [],
        unverifiedRequirements: [],
      }).success
    ).toBe(false)

    expect(
      cvTailoredContentSchema.safeParse({
        summary: "Valid",
        keywords: [],
        projectIds: [],
        unverifiedRequirements: [],
      }).success
    ).toBe(true)
  })

  it("converts the tailored model contract to a strict OpenAI text format", () => {
    const format = zodTextFormat(cvTailorModelOutputSchema, "cv_tailoring")

    expect(format.type).toBe("json_schema")
    expect(format.strict).toBe(true)
  })
})
