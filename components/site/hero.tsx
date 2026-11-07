import { ArrowDown02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import { ArrowLabel } from "@/components/site/arrow-label"
import { HeroDiagram } from "@/components/site/hero-diagram"
import type { Headline, SiteContent } from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"

type HeroProps = {
  locale: SiteLocale
  content: SiteContent
}

function playIntroOncePerSession(root: HTMLElement) {
  const sessionKey = "jefmonjor:intro"
  const fullIntroMs = 2400
  try {
    if (sessionStorage.getItem(sessionKey) === "played") {
      root.dataset.intro = "played"
      return
    }
    sessionStorage.setItem(sessionKey, "played")
  } catch {
    return
  }
  setTimeout(() => {
    root.dataset.intro = "played"
  }, fullIntroMs)
}

function numberHeadlineLines(headline: HTMLElement | null) {
  let lineTop = Number.NaN
  let line = -1
  headline?.querySelectorAll<HTMLElement>("[data-word]").forEach((word) => {
    if (word.offsetTop !== lineTop) {
      lineTop = word.offsetTop
      line += 1
    }
    word.style.setProperty("--line", String(line))
  })
}

function runBeforeFirstPaint(script: string) {
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}

function HeadlineWords({ headline }: { headline: Headline }) {
  const words = headline.flatMap((part) =>
    typeof part === "string"
      ? part
          .split(" ")
          .filter(Boolean)
          .map((text) => ({ text, emphasis: false }))
      : [{ text: part.emphasis, emphasis: true }]
  )

  return words.map((word, index) => (
    <span key={index}>
      <span data-word className="hero-word">
        <span className={word.emphasis ? "hero-emphasis" : undefined}>
          {word.text}
        </span>
      </span>
      {index < words.length - 1 ? " " : null}
    </span>
  ))
}

function Hero({ locale, content }: HeroProps) {
  const { hero } = content

  return (
    <section
      aria-labelledby="hero-title"
      className="site-container grid gap-14 pt-10 pb-16 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:items-center md:gap-10 md:pt-16 md:pb-24 lg:gap-16"
    >
      <div className="flex flex-col">
        {runBeforeFirstPaint(
          `(${playIntroOncePerSession.toString()})(document.documentElement)`
        )}
        <p className="hero-reveal text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase [--step:0] sm:text-xs sm:tracking-[0.18em]">
          {hero.eyebrow}
        </p>

        <h1
          id="hero-title"
          className="mt-5 font-heading text-[clamp(2.4rem,8vw,5.5rem)] leading-[1.05] font-medium tracking-[-0.02em] text-foreground md:text-[clamp(2.4rem,4.6vw,5.5rem)]"
        >
          <span className="sr-only">
            {hero.name}, {hero.role}.{" "}
          </span>
          <HeadlineWords headline={hero.headline} />
        </h1>
        {runBeforeFirstPaint(
          `(${numberHeadlineLines.toString()})(document.getElementById("hero-title"))`
        )}

        <p className="hero-reveal mt-6 text-[1.1rem] leading-snug text-muted-foreground [--step:6]">
          {hero.subtitle}
        </p>

        <p className="hero-reveal mt-4 flex items-start gap-3 text-[0.9375rem] leading-snug text-foreground [--step:7]">
          <span aria-hidden className="availability-dot mt-[0.4em]" />
          {hero.availability}
        </p>

        <div className="hero-reveal mt-8 flex flex-col gap-2 [--step:8] sm:flex-row sm:items-center sm:gap-6">
          <Link
            href={localizedPath(locale, "/contact")}
            className="group/arrow site-button min-h-14 w-full px-6 text-[1.0625rem] sm:w-auto"
          >
            <ArrowLabel>{content.cta}</ArrowLabel>
          </Link>
          <a
            href="#work"
            className="site-link inline-flex min-h-11 items-center justify-center gap-1.5 self-center text-[0.9375rem] font-medium sm:self-auto"
          >
            {hero.seeWork}
            <HugeiconsIcon
              icon={ArrowDown02Icon}
              aria-hidden
              className="size-4"
              strokeWidth={1.75}
            />
          </a>
        </div>

        <ul className="hero-reveal mt-8 flex flex-wrap gap-x-3 gap-y-1.5 text-sm text-muted-foreground [--step:9]">
          {hero.proof.map((item, index) => (
            <li key={item} className="flex items-center gap-3">
              {item}
              {index < hero.proof.length - 1 ? (
                <span aria-hidden className="hidden text-border sm:inline">
                  ·
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <HeroDiagram className="hero-reveal mx-auto w-full max-w-[26rem] [--step:4]" />
    </section>
  )
}

export { Hero }
