import { describe, expect, it } from "vitest"

import { readJsonBody } from "@/server/http/read-json-body"
import {
  ASSISTANT_BODY_MAX_BYTES,
  ASSISTANT_HISTORY_INPUT_MESSAGES,
  ASSISTANT_MESSAGE_INPUT_CHARS,
  CV_TAILOR_BODY_MAX_BYTES,
  CV_TAILOR_OFFER_MAX_CHARS,
} from "@/types/limits"

function request(body: BodyInit, headers: Record<string, string> = {}) {
  return new Request("http://localhost/api", {
    method: "POST",
    headers,
    body,
    duplex: "half",
  } as RequestInit)
}

function streamOf(chunks: number, size: number) {
  let pulled = 0
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      pulled += 1
      if (pulled > chunks) controller.close()
      else controller.enqueue(new Uint8Array(size).fill(0x20))
    },
  })
  return { stream, pulled: () => pulled }
}

describe("readJsonBody", () => {
  it("parses a body under the cap", async () => {
    expect(await readJsonBody(request('{"a":1}'), 100)).toEqual({
      ok: true,
      value: { a: 1 },
    })
  })

  it("refuses a declared length over the cap", async () => {
    expect(
      await readJsonBody(request("{}", { "content-length": "101" }), 100)
    ).toEqual({ ok: false, status: 413 })
  })

  it("stops reading an undeclared body as soon as it passes the cap", async () => {
    const { stream, pulled } = streamOf(100, 1024)

    expect(await readJsonBody(request(stream), 4096)).toEqual({
      ok: false,
      status: 413,
    })
    expect(pulled()).toBeLessThan(10)
  })

  it("answers 400 to invalid JSON or a nonsense length", async () => {
    expect(await readJsonBody(request("{"), 100)).toEqual({
      ok: false,
      status: 400,
    })
    expect(
      await readJsonBody(request("{}", { "content-length": "abc" }), 100)
    ).toEqual({ ok: false, status: 400 })
  })

  // The caps must never refuse a request the contract accepts.
  it("fits the largest valid request of each route", () => {
    const worstChar = "€" // 3 bytes in UTF-8
    const assistant = JSON.stringify({
      locale: "es",
      messages: Array.from(
        { length: ASSISTANT_HISTORY_INPUT_MESSAGES },
        () => ({
          role: "assistant",
          content: worstChar.repeat(ASSISTANT_MESSAGE_INPUT_CHARS),
          signature: "s".repeat(128),
        })
      ),
    })
    const tailor = JSON.stringify({
      locale: "es",
      offer: worstChar.repeat(CV_TAILOR_OFFER_MAX_CHARS),
    })

    expect(new TextEncoder().encode(assistant).byteLength).toBeLessThanOrEqual(
      ASSISTANT_BODY_MAX_BYTES
    )
    expect(new TextEncoder().encode(tailor).byteLength).toBeLessThanOrEqual(
      CV_TAILOR_BODY_MAX_BYTES
    )
  })
})
