"use client"

import { useEffect, useRef } from "react"
import { useTranslations } from "next-intl"

const METRIC_KEYS = ["years", "sectors", "companies", "products"] as const
const COUNT_DURATION_MS = 1300

function animateValue(node: HTMLElement, raw: string) {
  const match = raw.match(/\d+/)
  if (!match) {
    node.textContent = raw
    return
  }
  const target = parseInt(match[0], 10)
  const prefix = raw.slice(0, match.index)
  const suffix = raw.slice((match.index ?? 0) + match[0].length)
  const start = performance.now()

  const step = (now: number) => {
    const progress = Math.min((now - start) / COUNT_DURATION_MS, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    node.textContent = `${prefix}${Math.round(target * eased)}${suffix}`
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

function Metrics() {
  const t = useTranslations("metrics")
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const values = Array.from(
      grid.querySelectorAll<HTMLElement>("[data-count]")
    )
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    if (reduced) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          observer.disconnect()
          for (const node of values) {
            animateValue(node, node.dataset.count ?? "")
          }
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(grid)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      aria-label={t("ariaLabel")}
      className="mx-auto max-w-6xl px-4 pb-4 sm:px-8"
    >
      <div ref={gridRef} className="grid grid-cols-2 overflow-hidden rounded-xl border border-border lg:grid-cols-4">
        {METRIC_KEYS.map((key, index) => (
          <div
            key={key}
            className={
              "flex flex-col gap-2 border-border p-5 sm:p-6 " +
              (index % 2 === 1 ? "border-l " : "") +
              (index > 1 ? "border-t " : "") +
              "lg:border-t-0 " +
              (index > 0 ? "lg:border-l" : "")
            }
          >
            <span
              data-count={t(`entries.${key}.value`)}
              className="font-mono text-[clamp(1.75rem,1.8vw+1.1rem,2.25rem)] font-bold tracking-tight text-foreground tabular-nums"
            >
              {t(`entries.${key}.value`)}
            </span>
            <span className="font-mono text-[10px] leading-relaxed tracking-widest text-muted-foreground uppercase">
              {t(`entries.${key}.label`)}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        {t("caption")}
      </p>
    </section>
  )
}

export { Metrics }
