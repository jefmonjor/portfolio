// In-memory on purpose: no Redis to run. Counters reset on cold start and are
// per-instance. The "global" daily ceiling below is global only inside one
// running instance; platform-level spend caps remain the final hard boundary.
//
// Shared by every AI-backed route (assistant chat, CV tailoring) so the
// daily ceilings cap TOTAL OpenAI spend, not per-feature spend.

function intEnv(name: string, fallback: number): number {
  const value = Number.parseInt(process.env[name] ?? "", 10)
  return Number.isFinite(value) && value > 0 ? value : fallback
}

type RateLimiterOptions = {
  rateMinute: number
  rateDaily: number
  globalDaily: number
  now?: () => number
}

export function createRateLimiter({
  rateMinute,
  rateDaily,
  globalDaily,
  now = Date.now,
}: RateLimiterOptions): (ip: string) => "ok" | "limited" {
  const recent = new Map<string, number[]>()
  const daily = new Map<string, { start: number; count: number }>()
  let globalDay = { start: now(), count: 0 }

  return (ip: string) => {
    const timestamp = now()

    if (timestamp - globalDay.start >= 86_400_000) {
      recent.clear()
      daily.clear()
      globalDay = { start: timestamp, count: 0 }
    }
    if (globalDay.count >= globalDaily) return "limited"

    const day = daily.get(ip)
    if (day && timestamp - day.start < 86_400_000) {
      if (day.count >= rateDaily) return "limited"
    } else {
      daily.set(ip, { start: timestamp, count: 0 })
    }

    const hits = (recent.get(ip) ?? []).filter(
      (hit) => timestamp - hit < 60_000
    )
    if (hits.length >= rateMinute) return "limited"

    hits.push(timestamp)
    recent.set(ip, hits)
    daily.get(ip)!.count += 1
    globalDay.count += 1
    return "ok"
  }
}

export const checkLimit = createRateLimiter({
  rateMinute: intEnv("ASSISTANT_RATE_MINUTE", 4),
  rateDaily: intEnv("ASSISTANT_RATE_DAILY", 20),
  globalDaily: intEnv("ASSISTANT_GLOBAL_DAILY", 300),
})

export function requestIp(request: Request): string {
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim()
  return forwarded || "unknown"
}

export { intEnv }
