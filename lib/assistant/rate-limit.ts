function intEnv(name: string, fallback: number): number {
  const value = Number.parseInt(process.env[name] ?? "", 10)
  return Number.isFinite(value) && value > 0 ? value : fallback
}

const MINUTE_MS = 60_000
const DAY_MS = 86_400_000
const CROWDED_MEMORY_STORE_ENTRIES = 5_000

type Increment = { key: string; amount: number; ttlMs: number }

export interface RateLimitStore {
  get(keys: readonly string[]): Promise<number[]>
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

  function dropExpiredWhenCrowded(timestamp: number): void {
    if (counters.size < CROWDED_MEMORY_STORE_ENTRIES) return
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
      dropExpiredWhenCrowded(timestamp)
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

function createWithExpiryIfAbsent(key: string, ttlMs: number): string[] {
  return ["SET", key, "0", "PX", String(ttlMs), "NX"]
}

function incrementBy(key: string, amount: number): string[] {
  return ["INCRBY", key, String(amount)]
}

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
      const commands = entries.flatMap(({ key, amount, ttlMs }) => [
        createWithExpiryIfAbsent(key, ttlMs),
        incrementBy(key, amount),
      ])
      const results = await send("multi-exec", commands)
      return entries.map((_, index) => toNumber(results[index * 2 + 1]))
    },
  }
}

// In memory, each serverless instance keeps its own counters until cold start.
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
  globalDailyTokens?: number
  store?: RateLimitStore
  bucket?: string
  onStoreError?: "ok" | "limited"
  now?: () => number
}

export type RateLimiter = ((ip: string) => Promise<"ok" | "limited">) & {
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
  const fixedWindow = (windowMs: number) => Math.floor(now() / windowMs)
  const day = () => fixedWindow(DAY_MS)
  const tokensKey = () => `${prefix}:tokens:${day()}`

  async function check(ip: string): Promise<"ok" | "limited"> {
    const minuteWindow = fixedWindow(MINUTE_MS)
    const dayWindow = day()
    const minuteKey = `${prefix}:ip:${ip}:m:${minuteWindow}`
    const dayKey = `${prefix}:ip:${ip}:d:${dayWindow}`
    const globalKey = `${prefix}:global:${dayWindow}`

    try {
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
      console.error(`[rate-limit] could not record usage (${bucket})`, {
        tokens,
        message: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return Object.assign(check, { recordUsage })
}

const sharedStore = defaultStore()

export const checkLimit = createRateLimiter({
  rateMinute: intEnv("ASSISTANT_RATE_MINUTE", 4),
  rateDaily: intEnv("ASSISTANT_RATE_DAILY", 20),
  globalDaily: intEnv("ASSISTANT_GLOBAL_DAILY", 300),
  globalDailyTokens: intEnv("ASSISTANT_GLOBAL_DAILY_TOKENS", 1_500_000),
  store: sharedStore,
  bucket: "ai",
})

export const checkPdfLimit = createRateLimiter({
  rateMinute: intEnv("CV_PDF_RATE_MINUTE", 20),
  rateDaily: intEnv("CV_PDF_RATE_DAILY", 200),
  globalDaily: Number.POSITIVE_INFINITY,
  store: sharedStore,
  bucket: "pdf",
  onStoreError: "ok",
})

// Fails open: a lost lead costs more than an occasional extra email.
export const checkContactLimit = createRateLimiter({
  rateMinute: intEnv("CONTACT_RATE_MINUTE", 2),
  rateDaily: intEnv("CONTACT_RATE_DAILY", 5),
  globalDaily: intEnv("CONTACT_GLOBAL_DAILY", 100),
  store: sharedStore,
  bucket: "contact",
  onStoreError: "ok",
})

const IPV6_NETWORK_HEXTETS = 4

function expandIpv6(address: string): string[] {
  const [head = "", tail = ""] = address.split("::")
  const headParts = head ? head.split(":") : []
  const tailParts = tail ? tail.split(":") : []
  const missing = 8 - headParts.length - tailParts.length
  return [
    ...headParts,
    ...Array<string>(Math.max(missing, 0)).fill("0"),
    ...tailParts,
  ]
}

export function clientBucket(address: string): string {
  if (!address.includes(":")) return address
  const network = expandIpv6(address.toLowerCase())
    .slice(0, IPV6_NETWORK_HEXTETS)
    .map((hextet) => hextet.replace(/^0+(?=.)/, ""))
  return `${network.join(":")}::/64`
}

function forwardedAddress(headers: Headers): string {
  const realIp = headers.get("x-real-ip")?.trim()

  if (process.env.VERCEL) {
    const vercel = headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    return vercel || realIp || "unknown"
  }

  const ourProxyHop = headers.get("x-forwarded-for")?.split(",").at(-1)?.trim()
  return ourProxyHop || realIp || "unknown"
}

export function requestIp(request: Request): string {
  return clientBucket(forwardedAddress(request.headers))
}

export { intEnv }
