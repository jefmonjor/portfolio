"use client"

import * as React from "react"
import { useReducedMotion } from "motion/react"

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_<>$#&*"

type ScrambleTextProps = {
  value: string
  className?: string
  delay?: number
  duration?: number
}

function pickGlyph(): string {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
}

function ScrambleText({
  value,
  className,
  delay = 0,
  duration = 900,
}: ScrambleTextProps) {
  const reduce = useReducedMotion()
  const [display, setDisplay] = React.useState(value)

  React.useEffect(() => {
    if (reduce) return

    let raf = 0
    const start = performance.now() + delay
    const chars = Array.from(value)
    const settleAt = chars.map(
      (_, i) => duration * (0.35 + (i / Math.max(chars.length - 1, 1)) * 0.5)
    )

    function tick(now: number) {
      const elapsed = now - start
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick)
        return
      }
      let allDone = true
      const next = chars
        .map((char, i) => {
          if (char === " ") return " "
          if (elapsed >= settleAt[i]) return char
          allDone = false
          return pickGlyph()
        })
        .join("")
      setDisplay(next)
      if (!allDone) raf = requestAnimationFrame(tick)
    }

    const timeoutId = window.setTimeout(() => {
      raf = requestAnimationFrame(tick)
    }, 0)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timeoutId)
    }
  }, [value, delay, duration, reduce])

  return (
    <span className={className} aria-label={value}>
      <span aria-hidden>{display}</span>
    </span>
  )
}

export { ScrambleText }
