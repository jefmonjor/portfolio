// Rate limiting and spend control for every AI-backed route (assistant chat,
// CV tailoring) plus a separate, more generous bucket for the PDF route.
//
// Where the counters live decides what "global" means:
// - With UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN set, every
//   instance reads and writes the same Redis counters, so the per-visitor
//   limits, the daily request ceiling and the daily token budget hold across
//   the whole deployment. If Redis cannot be reached the AI bucket fails
//   closed: no answer is better than unmetered spend.
// - Without them, counters live in this process's memory. On a single
//   long-lived server (the Docker image) that is the whole deployment; on a
//   serverless platform (Vercel) each instance counts on its own and resets on
//   cold start, so every limit is per instance. The provider's spend cap is
//   then the only hard boundary.
//
// Windows are fixed (per UTC minute and per UTC day) because that is what a
// shared INCR-with-expiry store can enforce atomically.

function intEnv(name: string, fallback: number): number {
  const value = Number.parseInt(process.env[name] ?? "", 10)
  return Number.isFinite(value) && value > 0 ? value : fallback
}

const MINUTE_MS = 60_000
const DAY_MS = 86_400_000

type Increment = { key: string; amount: number; ttlMs: number }

// Two calls, both batched: one round trip to read, one to count.
export interface RateLimitStore {
  // Current value of each key; a missing or expired key reads as 0.
  get(keys: readonly string[]): Promise<number[]>
  // Adds `amount` to each key, creating it with `ttlMs` to live when it does
  // not exist, and returns the new totals in order.
  incr(entries: readonly Increment[]): Promise<number[]>
}

export type NamedStore = RateLimitStore & { kind: "memory" | "upstash" }

export function createMemoryStore({
  now = Date.now,
}: { now?: () => number } = {}): NamedStore {
  const counters = new Map<string, { value: number; expiresAt: number }>()

  function live(key: string, timestamp: number) {
    const entry = counters.get(key)
    if (entry && entry.expiresAt <= timestamp) {
      counters.delete(key)
      return undefined
    }
    return entry
  }

  function sweep(timestamp: number): void {
    // Per-IP keys accumulate over a day; dropping the expired ones now and
    // then keeps the map bounded by the traffic of the current window.
    if (counters.size < 5_000) return
    for (const [key, entry] of counters) {
      if (entry.expiresAt <= timestamp) counters.delete(key)
    }
  }

  return {
    kind: "memory",
    async get(keys) {
      const timestamp = now()
      return keys.map((key) => live(key, timestamp)?.value ?? 0)
    },
    async incr(entries) {
      const timestamp = now()
      sweep(timestamp)
      return entries.map(({ key, amount, ttlMs }) => {
        const entry = live(key, timestamp) ?? {
          value: 0,
          expiresAt: timestamp + ttlMs,
        }
        entry.value += amount
        counters.set(key, entry)
        return entry.value
      })
    },
  }
}

type UpstashStoreOptions = {
  url: string
  token: string
  fetch?: typeof fetch
  timeoutMs?: number
}

// Upstash's REST API through plain fetch: no client library to install, and
// it works the same from a serverless function and from the Docker image.
export function createUpstashStore({
  url,
  token,
  fetch: fetchImpl = fetch,
  timeoutMs = 1_500,
}: UpstashStoreOptions): NamedStore {
  const base = url.replace(/\/+$/, "")

  async function send(
    path: "pipeline" | "multi-exec",
    commands: string[][]
  ): Promise<unknown[]> {
    const response = await fetchImpl(`${base}/${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commands),
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (!response.ok) {
      throw new Error(`Upstash answered ${response.status}`)
    }
    const body: unknown = await response.json()
    if (!Array.isArray(body) || body.length !== commands.length) {
      throw new Error("Upstash returned an unexpected body")
    }
    return body.map((item: unknown) => {
      if (typeof item !== "object" || item === null || "error" in item) {
        throw new Error("Upstash rejected a command")
      }
      return "result" in item ? item.result : null
    })
  }

  const toNumber = (value: unknown): number => {
    const parsed = Number(value ?? 0)
    if (!Number.isFinite(parsed)) throw new Error("Upstash returned NaN")
    return parsed
  }

  return {
    kind: "upstash",
    async get(keys) {
      const [values] = await send("pipeline", [["MGET", ...keys]])
      if (!Array.isArray(values) || values.length !== keys.length) {
        throw new Error("Upstash MGET returned an unexpected body")
      }
      return values.map(toNumber)
    },
    async incr(entries) {
      // SET NX PX gives a new key its expiry; INCRBY keeps it. Run as one
      // transaction so a counter is never left behind without one.
      const commands = entries.flatMap(({ key, amount, ttlMs }) => [
        ["SET", key, "0", "PX", String(ttlMs), "NX"],
        ["INCRBY", key, String(amount)],
      ])
      const results = await send("multi-exec", commands)
      return entries.map((_, index) => toNumber(results[index * 2 + 1]))
    },
  }
}

export function defaultStore(
  env: Record<string, string | undefined> = process.env
): NamedStore {
  const url = env.UPSTASH_REDIS_REST_URL?.trim()
  const token = env.UPSTASH_REDIS_REST_TOKEN?.trim()
  return url && token ? createUpstashStore({ url, token }) : createMemoryStore()
}

type RateLimiterOptions = {
  rateMinute: number
  rateDaily: number
  globalDaily: number
  // Total tokens (input + output, as reported by the API) all AI routes may
  // spend per UTC day. Unbounded when omitted.
  globalDailyTokens?: number
  store?: RateLimitStore
  // Keeps counters of different limiters apart on a shared store.
  bucket?: string
  // What to answer when the store cannot be read. "limited" (fail closed) is
  // the default; only a route whose cost is already bounded elsewhere may
  // choose to stay open.
  onStoreError?: "ok" | "limited"
  now?: () => number
}

export type RateLimiter = ((ip: string) => Promise<"ok" | "limited">) & {
  // Adds what a model call actually cost to today's token budget.
  recordUsage: (tokens: number) => Promise<void>
}

export function createRateLimiter({
  rateMinute,
  rateDaily,
  globalDaily,
  globalDailyTokens = Number.POSITIVE_INFINITY,
  now = Date.now,
  store = createMemoryStore({ now }),
  bucket = "ai",
  onStoreError = "limited",
}: RateLimiterOptions): RateLimiter {
  const prefix = `rl:${bucket}`
  const day = () => Math.floor(now() / DAY_MS)
  const tokensKey = () => `${prefix}:tokens:${day()}`

  async function check(ip: string): Promise<"ok" | "limited"> {
    const minuteWindow = Math.floor(now() / MINUTE_MS)
    const dayWindow = day()
    const minuteKey = `${prefix}:ip:${ip}:m:${minuteWindow}`
    const dayKey = `${prefix}:ip:${ip}:d:${dayWindow}`
    const globalKey = `${prefix}:global:${dayWindow}`

    try {
      // Look before counting, so a visitor who is already turned away does
      // not keep spending the ceiling everybody else shares.
      const [minute = 0, daily = 0, global = 0, tokens = 0] = await store.get([
        minuteKey,
        dayKey,
        globalKey,
        tokensKey(),
      ])
      if (
        minute >= rateMinute ||
        daily >= rateDaily ||
        global >= globalDaily ||
        tokens >= globalDailyTokens
      ) {
        return "limited"
      }

      // Concurrent requests can pass the look together; the totals returned
      // here settle the race.
      const [minuteAfter = 0, dailyAfter = 0, globalAfter = 0] =
        await store.incr([
          { key: minuteKey, amount: 1, ttlMs: MINUTE_MS },
          { key: dayKey, amount: 1, ttlMs: DAY_MS },
          { key: globalKey, amount: 1, ttlMs: DAY_MS },
        ])
      return minuteAfter > rateMinute ||
        dailyAfter > rateDaily ||
        globalAfter > globalDaily
        ? "limited"
        : "ok"
    } catch (error) {
      console.error(`[rate-limit] store unavailable (${bucket})`, {
        failing: onStoreError === "ok" ? "open" : "closed",
        message: error instanceof Error ? error.message : String(error),
      })
      return onStoreError
    }
  }

  async function recordUsage(tokens: number): Promise<void> {
    if (!Number.isFinite(tokens) || tokens <= 0) return
    try {
      await store.incr([
        { key: tokensKey(), amount: Math.ceil(tokens), ttlMs: DAY_MS },
      ])
    } catch (error) {
      // The spend already happened; the next check() fails closed if the
      // store is still down.
      console.error(`[rate-limit] could not record usage (${bucket})`, {
        tokens,
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return Object.assign(check, { recordUsage })
}

const sharedStore = defaultStore()

// Shared by every AI-backed route so the daily ceilings cap TOTAL OpenAI
// spend, not per-feature spend.
export const checkLimit = createRateLimiter({
  rateMinute: intEnv("ASSISTANT_RATE_MINUTE", 4),
  rateDaily: intEnv("ASSISTANT_RATE_DAILY", 20),
  globalDaily: intEnv("ASSISTANT_GLOBAL_DAILY", 300),
  globalDailyTokens: intEnv("ASSISTANT_GLOBAL_DAILY_TOKENS", 1_500_000),
  store: sharedStore,
  bucket: "ai",
})

// GET /cv.pdf renders on the server. Each instance keeps the few possible
// files in memory, so this bucket only stops one client from hammering cold
// instances. It stays open if the store is down: the CV download must not
// depend on Redis, and its cost is already bounded by that cache.
export const checkPdfLimit = createRateLimiter({
  rateMinute: intEnv("CV_PDF_RATE_MINUTE", 20),
  rateDaily: intEnv("CV_PDF_RATE_DAILY", 200),
  globalDaily: Number.POSITIVE_INFINITY,
  store: sharedStore,
  bucket: "pdf",
  onStoreError: "ok",
})

// Which address to count. A client can put anything in X-Forwarded-For; only
// the hop added by infrastructure we control is trustworthy.
export function requestIp(request: Request): string {
  const headers = request.headers
  const realIp = headers.get("x-real-ip")?.trim()

  // Vercel overwrites these headers at the edge; the client cannot set them.
  if (process.env.VERCEL) {
    const vercel = headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    return vercel || realIp || "unknown"
  }

  // Behind one reverse proxy (Caddy or the nginx block in docs/DEPLOY.md) the
  // last entry is the address the proxy saw; anything before it came from the
  // client.
  const forwarded = headers.get("x-forwarded-for")?.split(",").at(-1)?.trim()
  return forwarded || realIp || "unknown"
}

export { intEnv }
