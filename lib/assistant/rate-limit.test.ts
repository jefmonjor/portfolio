import { afterEach, describe, expect, it, vi } from "vitest"

import {
  createMemoryStore,
  createRateLimiter,
  createUpstashStore,
  defaultStore,
  requestIp,
  type RateLimitStore,
} from "@/lib/assistant/rate-limit"

describe("createRateLimiter", () => {
  it("enforces the per-minute limit", async () => {
    let timestamp = 0
    const check = createRateLimiter({
      rateMinute: 2,
      rateDaily: 10,
      globalDaily: 20,
      now: () => timestamp,
    })

    expect(await check("203.0.113.1")).toBe("ok")
    expect(await check("203.0.113.1")).toBe("ok")
    expect(await check("203.0.113.1")).toBe("limited")

    timestamp = 60_000
    expect(await check("203.0.113.1")).toBe("ok")
  })

  it("enforces the daily limit across IPs", async () => {
    const check = createRateLimiter({
      rateMinute: 10,
      rateDaily: 10,
      globalDaily: 2,
      now: () => 0,
    })

    expect(await check("203.0.113.1")).toBe("ok")
    expect(await check("203.0.113.2")).toBe("ok")
    expect(await check("203.0.113.3")).toBe("limited")
  })

  it("cleans counters when the daily window resets", async () => {
    let timestamp = 0
    const check = createRateLimiter({
      rateMinute: 1,
      rateDaily: 1,
      globalDaily: 1,
      now: () => timestamp,
    })

    expect(await check("203.0.113.1")).toBe("ok")
    expect(await check("203.0.113.1")).toBe("limited")

    timestamp = 86_400_000
    expect(await check("203.0.113.1")).toBe("ok")
  })

  it("a request turned away does not spend the global ceiling", async () => {
    const check = createRateLimiter({
      rateMinute: 1,
      rateDaily: 10,
      globalDaily: 2,
      now: () => 0,
    })

    expect(await check("203.0.113.1")).toBe("ok")
    for (let i = 0; i < 5; i += 1) {
      expect(await check("203.0.113.1")).toBe("limited")
    }
    expect(await check("203.0.113.2")).toBe("ok")
  })

  // Every serverless instance used to keep its own Map, so N instances meant
  // N times every limit. Instances that share a store share the ceiling.
  it("two limiters on the same store see each other's requests", async () => {
    const store = createMemoryStore({ now: () => 0 })
    const options = {
      rateMinute: 10,
      rateDaily: 10,
      globalDaily: 1,
      store,
      now: () => 0,
    }
    const instanceA = createRateLimiter(options)
    const instanceB = createRateLimiter(options)

    expect(await instanceA("203.0.113.1")).toBe("ok")
    expect(await instanceB("203.0.113.2")).toBe("limited")
  })

  it("keeps separate buckets apart on a shared store", async () => {
    const store = createMemoryStore({ now: () => 0 })
    const ai = createRateLimiter({
      rateMinute: 1,
      rateDaily: 1,
      globalDaily: 1,
      store,
      bucket: "ai",
      now: () => 0,
    })
    const pdf = createRateLimiter({
      rateMinute: 1,
      rateDaily: 1,
      globalDaily: 1,
      store,
      bucket: "pdf",
      now: () => 0,
    })

    expect(await ai("203.0.113.1")).toBe("ok")
    expect(await pdf("203.0.113.1")).toBe("ok")
  })

  it("fails closed when the store does not answer", async () => {
    const broken: RateLimitStore = {
      get: () => Promise.reject(new Error("ECONNREFUSED")),
      incr: () => Promise.reject(new Error("ECONNREFUSED")),
    }
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    const check = createRateLimiter({
      rateMinute: 10,
      rateDaily: 10,
      globalDaily: 10,
      store: broken,
    })

    expect(await check("203.0.113.1")).toBe("limited")
  })

  it("can be told to fail open for a non-AI bucket", async () => {
    const broken: RateLimitStore = {
      get: () => Promise.reject(new Error("timeout")),
      incr: () => Promise.reject(new Error("timeout")),
    }
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    const check = createRateLimiter({
      rateMinute: 10,
      rateDaily: 10,
      globalDaily: 10,
      store: broken,
      onStoreError: "ok",
    })

    expect(await check("203.0.113.1")).toBe("ok")
  })

  // A request is not the unit of spend: one chat turn may call the model twice
  // and a pasted offer costs far more than a greeting. The daily budget counts
  // the tokens OpenAI reports.
  it("turns requests away once the daily token budget is spent", async () => {
    const check = createRateLimiter({
      rateMinute: 10,
      rateDaily: 10,
      globalDaily: 100,
      globalDailyTokens: 1_000,
      now: () => 0,
    })

    expect(await check("203.0.113.1")).toBe("ok")
    await check.recordUsage(600)
    expect(await check("203.0.113.2")).toBe("ok")
    await check.recordUsage(400)
    expect(await check("203.0.113.3")).toBe("limited")
  })

  it("shares the token budget through the store", async () => {
    const store = createMemoryStore({ now: () => 0 })
    const options = {
      rateMinute: 10,
      rateDaily: 10,
      globalDaily: 100,
      globalDailyTokens: 500,
      store,
      now: () => 0,
    }
    const instanceA = createRateLimiter(options)
    const instanceB = createRateLimiter(options)

    await instanceA.recordUsage(500)
    expect(await instanceB("203.0.113.1")).toBe("limited")
  })
})

// Minimal Upstash REST stand-in: the commands the store sends, nothing else.
function fakeUpstash(options: { fail?: boolean } = {}) {
  const data = new Map<string, number>()
  const calls: Array<{ url: string; auth: string | null; body: unknown }> = []
  const run = (command: string[]): unknown => {
    const [name, key = "", ...args] = command
    switch (name) {
      case "MGET":
        return [key, ...args].map((k) =>
          data.has(k) ? String(data.get(k)) : null
        )
      case "SET":
        if (data.has(key)) return null
        data.set(key, Number(args[0]))
        return "OK"
      case "INCRBY": {
        const next = (data.get(key) ?? 0) + Number(args[0])
        data.set(key, next)
        return next
      }
      default:
        throw new Error(`unexpected command ${name}`)
    }
  }
  const fetchImpl = async (
    input: string | URL | Request,
    init?: RequestInit
  ): Promise<Response> => {
    const body: unknown = JSON.parse(String(init?.body))
    calls.push({
      url: String(input),
      auth: new Headers(init?.headers).get("authorization"),
      body,
    })
    if (options.fail) return new Response("upstream down", { status: 503 })
    const commands = body as string[][]
    return Response.json(commands.map((command) => ({ result: run(command) })))
  }
  return { fetchImpl: fetchImpl as typeof fetch, calls, data }
}

describe("createUpstashStore", () => {
  it("lets two instances share the ceiling through Redis", async () => {
    const redis = fakeUpstash()
    const store = createUpstashStore({
      url: "https://eu1-example.upstash.io/",
      token: "secret-token",
      fetch: redis.fetchImpl,
    })
    const options = {
      rateMinute: 10,
      rateDaily: 10,
      globalDaily: 1,
      store,
      now: () => 0,
    }

    expect(await createRateLimiter(options)("203.0.113.1")).toBe("ok")
    expect(await createRateLimiter(options)("203.0.113.2")).toBe("limited")
    expect(redis.calls[0]?.url).toBe("https://eu1-example.upstash.io/pipeline")
    expect(redis.calls[0]?.auth).toBe("Bearer secret-token")
    // Counters are created with an expiry before they are incremented.
    expect(redis.calls[1]?.url).toBe(
      "https://eu1-example.upstash.io/multi-exec"
    )
    expect(JSON.stringify(redis.calls[1]?.body)).toMatch(/"SET",.*"PX"/)
  })

  it("fails closed when Upstash errors", async () => {
    const redis = fakeUpstash({ fail: true })
    vi.spyOn(console, "error").mockImplementation(() => undefined)
    const check = createRateLimiter({
      rateMinute: 10,
      rateDaily: 10,
      globalDaily: 10,
      store: createUpstashStore({
        url: "https://eu1-example.upstash.io",
        token: "secret-token",
        fetch: redis.fetchImpl,
      }),
    })

    expect(await check("203.0.113.1")).toBe("limited")
  })

  it("is the default store only when both variables are set", () => {
    expect(defaultStore({}).kind).toBe("memory")
    expect(
      defaultStore({ UPSTASH_REDIS_REST_URL: "https://x.upstash.io" }).kind
    ).toBe("memory")
    expect(
      defaultStore({
        UPSTASH_REDIS_REST_URL: "https://x.upstash.io",
        UPSTASH_REDIS_REST_TOKEN: "t",
      }).kind
    ).toBe("upstash")
  })
})

describe("requestIp", () => {
  afterEach(() => vi.unstubAllEnvs())

  const request = (headers: Record<string, string>) =>
    new Request("http://localhost/api/assistant", { headers })

  // nginx's $proxy_add_x_forwarded_for appends the address it saw to whatever
  // the client sent, so only the last hop is the proxy's word.
  it("takes the address the proxy appended, not the one the client sent", () => {
    vi.stubEnv("VERCEL", "")
    expect(
      requestIp(request({ "x-forwarded-for": "6.6.6.6, 203.0.113.9" }))
    ).toBe("203.0.113.9")
  })

  it("falls back to x-real-ip behind a proxy that only sets that", () => {
    vi.stubEnv("VERCEL", "")
    expect(requestIp(request({ "x-real-ip": "203.0.113.7" }))).toBe(
      "203.0.113.7"
    )
  })

  it("trusts the platform header on Vercel", () => {
    vi.stubEnv("VERCEL", "1")
    expect(
      requestIp(
        request({
          "x-forwarded-for": "6.6.6.6, 203.0.113.9",
          "x-vercel-forwarded-for": "198.51.100.4",
        })
      )
    ).toBe("198.51.100.4")
  })
})
