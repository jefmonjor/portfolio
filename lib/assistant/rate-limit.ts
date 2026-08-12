// In-memory on purpose: one small serverless instance, no Redis to run.
// Counters reset on cold start and are per-instance — combined with the
// global daily ceiling this bounds worst-case spend.
//
// Shared by every AI-backed route (assistant chat, CV tailoring) so the
// daily ceilings cap TOTAL OpenAI spend, not per-feature spend.

function intEnv(name: string, fallback: number): number {
  const value = Number.parseInt(process.env[name] ?? "", 10)
  return Number.isFinite(value) && value > 0 ? value : fallback
}

const RATE_MINUTE = intEnv("ASSISTANT_RATE_MINUTE", 4)
const RATE_DAILY = intEnv("ASSISTANT_RATE_DAILY", 20)
// Hard ceiling across ALL visitors: even a botnet can't run up the bill.
const GLOBAL_DAILY = intEnv("ASSISTANT_GLOBAL_DAILY", 300)

const recent = new Map<string, number[]>()
const daily = new Map<string, { start: number; count: number }>()
let globalDay = { start: Date.now(), count: 0 }

export function checkLimit(ip: string): "ok" | "limited" {
  const now = Date.now()

  if (now - globalDay.start > 86_400_000) {
    globalDay = { start: now, count: 0 }
  }
  if (globalDay.count >= GLOBAL_DAILY) return "limited"

  const day = daily.get(ip)
  if (day && now - day.start < 86_400_000) {
    if (day.count >= RATE_DAILY) return "limited"
  } else {
    daily.set(ip, { start: now, count: 0 })
  }

  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 60_000)
  if (hits.length >= RATE_MINUTE) return "limited"

  hits.push(now)
  recent.set(ip, hits)
  daily.get(ip)!.count += 1
  globalDay.count += 1
  return "ok"
}

export function requestIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  )
}

export { intEnv }
