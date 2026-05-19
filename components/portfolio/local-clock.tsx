"use client"

import * as React from "react"

type LocalClockProps = {
  readonly timeZone: string
  readonly locale: string
  readonly className?: string
}

const TIMEZONE_FORMATTER_CACHE = new Map<string, Intl.DateTimeFormat>()

function getFormatter(locale: string, timeZone: string): Intl.DateTimeFormat {
  const key = `${locale}|${timeZone}`
  const cached = TIMEZONE_FORMATTER_CACHE.get(key)
  if (cached) return cached
  const next = new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
  TIMEZONE_FORMATTER_CACHE.set(key, next)
  return next
}

function LocalClock({ timeZone, locale, className }: LocalClockProps) {
  const [time, setTime] = React.useState<string | null>(null)

  React.useEffect(() => {
    const formatter = getFormatter(locale, timeZone)
    function update() {
      setTime(formatter.format(new Date()))
    }
    update()
    const interval = window.setInterval(update, 1000)
    return () => window.clearInterval(interval)
  }, [locale, timeZone])

  return (
    <span suppressHydrationWarning className={className}>
      {time ?? "--:--:--"}
    </span>
  )
}

export { LocalClock }
