import { describe, expect, it } from "vitest"

import { assistantRequestSchema } from "@/types/assistant"
import {
  CV_TAILOR_OFFER_MAX_CHARS,
  cvTailorRequestSchema,
  cvTailorResponseSchema,
} from "@/types/cv-tailor"

describe("API contracts", () => {
  it("normalizes an unsupported assistant locale to Spanish", () => {
    const result = assistantRequestSchema.parse({
      locale: "fr",
      messages: [{ role: "user", content: "Hola" }],
    })

    expect(result.locale).toBe("es")
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
  })

  it("rejects malformed tailored-CV responses", () => {
    expect(
      cvTailorResponseSchema.safeParse({ summary: "Valid", keywords: [42] })
        .success
    ).toBe(false)
  })
})
