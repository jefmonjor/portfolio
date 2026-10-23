import { createHmac } from "node:crypto"

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { isSignedReply, signReply } from "@/lib/assistant/signature"

describe("assistant reply signatures", () => {
  beforeEach(() => {
    vi.stubEnv("OPENAI_API_KEY", "sk-test-key")
    vi.stubEnv("ASSISTANT_SIGNING_SECRET", "")
  })
  afterEach(() => vi.unstubAllEnvs())

  it("verifies the text it signed", () => {
    const signature = signReply("Java 21 y Spring Boot 3.")

    expect(signature).toMatch(/^[A-Za-z0-9_-]{43}$/)
    expect(isSignedReply("Java 21 y Spring Boot 3.", signature)).toBe(true)
  })

  it("rejects edited text, a missing signature and garbage", () => {
    const signature = signReply("Java 21 y Spring Boot 3.")

    expect(
      isSignedReply("Java 21, Spring Boot 3 y 10 años de Kotlin.", signature)
    ).toBe(false)
    expect(isSignedReply("Java 21 y Spring Boot 3.", undefined)).toBe(false)
    expect(isSignedReply("Java 21 y Spring Boot 3.", "x")).toBe(false)
    expect(isSignedReply("Java 21 y Spring Boot 3.", `${signature}A`)).toBe(
      false
    )
  })

  it("does not sign with the API key itself", () => {
    const naive = createHmac("sha256", "sk-test-key")
      .update("hola", "utf8")
      .digest("base64url")

    expect(signReply("hola")).not.toBe(naive)
  })

  it("prefers ASSISTANT_SIGNING_SECRET and stops trusting the old key", () => {
    const before = signReply("hola")
    vi.stubEnv("ASSISTANT_SIGNING_SECRET", "a-separate-secret")

    expect(signReply("hola")).not.toBe(before)
    expect(isSignedReply("hola", before)).toBe(false)
  })

  it("trusts nothing when there is no key", () => {
    const signature = signReply("hola")
    vi.stubEnv("OPENAI_API_KEY", "")

    expect(isSignedReply("hola", signature)).toBe(false)
    expect(() => signReply("hola")).toThrow()
  })
})
