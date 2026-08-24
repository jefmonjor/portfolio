import { describe, expect, it } from "vitest"

import { createRateLimiter } from "@/lib/assistant/rate-limit"

describe("createRateLimiter", () => {
  it("enforces the per-minute limit", () => {
    let timestamp = 0
    const check = createRateLimiter({
      rateMinute: 2,
      rateDaily: 10,
      globalDaily: 20,
      now: () => timestamp,
    })

    expect(check("203.0.113.1")).toBe("ok")
    expect(check("203.0.113.1")).toBe("ok")
    expect(check("203.0.113.1")).toBe("limited")

    timestamp = 60_000
    expect(check("203.0.113.1")).toBe("ok")
  })

  it("enforces the instance-wide daily limit across IPs", () => {
    const check = createRateLimiter({
      rateMinute: 10,
      rateDaily: 10,
      globalDaily: 2,
      now: () => 0,
    })

    expect(check("203.0.113.1")).toBe("ok")
    expect(check("203.0.113.2")).toBe("ok")
    expect(check("203.0.113.3")).toBe("limited")
  })

  it("cleans counters when the daily window resets", () => {
    let timestamp = 0
    const check = createRateLimiter({
      rateMinute: 1,
      rateDaily: 1,
      globalDaily: 1,
      now: () => timestamp,
    })

    expect(check("203.0.113.1")).toBe("ok")
    expect(check("203.0.113.1")).toBe("limited")

    timestamp = 86_400_000
    expect(check("203.0.113.1")).toBe("ok")
  })
})
