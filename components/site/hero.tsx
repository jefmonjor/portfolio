import {
  ArrowDown02Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ContactButton } from "@/components/site/contact-button"
import { HeroDiagram } from "@/components/site/hero-diagram"
import { StatusBadge } from "@/components/site/status-badge"
import type { Headline, SiteContent } from "@/content/site/types"
import type { SiteLocale } from "@/i18n/routing"
import { profile } from "@/lib/profile"

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
      className="site-container grid gap-12 pt-10 pb-16 md:pt-16 md:pb-24 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-center lg:gap-14"
    >
      <div className="flex flex-col">
        {runBeforeFirstPaint(
          `(${playIntroOncePerSession.toString()})(document.documentElement)`
        )}
        <p className="hero-reveal text-subheading-xs text-text-sub-600 uppercase [--step:0]">
          {hero.eyebrow}
        </p>

        <h1 id="hero-title" className="mt-4 text-title-h1 text-text-sub-600">
          <span className="sr-only">
            {profile.shortName}, {hero.role}.{" "}
          </span>
          <HeadlineWords headline={hero.headline} />
        </h1>
        {runBeforeFirstPaint(
          `(${numberHeadlineLines.toString()})(document.getElementById("hero-title"))`
        )}

        <p className="hero-reveal mt-6 max-w-[34rem] text-paragraph-lg text-text-sub-600 [--step:6]">
          {hero.subtitle}
        </p>

        <div className="hero-reveal mt-8 flex flex-col gap-3 [--step:7] sm:flex-row">
          <ContactButton locale={locale} label={content.cta} />
          <a href="#work" className="site-button site-button-stroke">
            {hero.seeWork}
            <HugeiconsIcon
              icon={ArrowDown02Icon}
              aria-hidden
              className="size-[18px] text-icon-sub-600"
              strokeWidth={1.75}
            />
          </a>
        </div>

        <p className="hero-reveal mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-paragraph-sm text-text-sub-600 [--step:8]">
          <StatusBadge>{hero.availability.status}</StatusBadge>
          {hero.availability.detail}
        </p>

        <ul className="hero-reveal mt-10 flex flex-col gap-2.5 border-t border-stroke-soft-200 pt-6 [--step:9] sm:flex-row sm:flex-wrap sm:gap-x-6">
          {hero.proof.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-label-sm text-text-sub-600"
            >
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                aria-hidden
                className="size-4 shrink-0 text-icon-sub-600"
                strokeWidth={1.75}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <HeroDiagram className="hero-reveal mx-auto w-full max-w-[28rem] [--step:4]" />
    </section>
  )
}

export { Hero }
