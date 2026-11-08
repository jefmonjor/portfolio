"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

const revealWhenTopCrossesViewport = "0px 0px -20% 0px"

function isBelowTheFold(element: Element): boolean {
  return element.getBoundingClientRect().top > window.innerHeight * 0.8
}

function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const waiting = Array.from(
      document.querySelectorAll("[data-reveal]")
    ).filter(isBelowTheFold)
    if (waiting.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute("data-reveal", "shown")
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: revealWhenTopCrossesViewport }
    )
    for (const element of waiting) {
      element.setAttribute("data-reveal", "waiting")
      observer.observe(element)
    }
    return () => observer.disconnect()
  }, [pathname])

  return null
}

export { ScrollReveal }
