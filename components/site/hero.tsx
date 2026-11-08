import { ArrowDown02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ContactButton } from "@/components/site/contact-button"
import { ArchitectureStack } from "@/components/site/architecture-stack"
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
      className="site-container grid gap-10 pt-10 pb-14 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:items-center md:gap-10 md:pt-16 md:pb-20 lg:gap-16"
    >
      <div className="flex flex-col">
        {runBeforeFirstPaint(
          `(${playIntroOncePerSession.toString()})(document.documentElement)`
        )}
        <p className="hero-reveal text-subheading-xs text-text-sub-600 uppercase [--step:0] sm:tracking-[0.18em]">
          {hero.eyebrow}
        </p>

        <h1
          id="hero-title"
          className="mt-5 font-heading text-title-h1 text-text-strong-950 md:text-title-h1-split"
        >
          <span className="sr-only">
            {profile.shortName}, {hero.role}.{" "}
          </span>
          <HeadlineWords headline={hero.headline} />
        </h1>
        {runBeforeFirstPaint(
          `(${numberHeadlineLines.toString()})(document.getElementById("hero-title"))`
        )}

        <p className="hero-reveal mt-6 text-paragraph-lg text-text-sub-600 [--step:6]">
          {hero.subtitle}
        </p>

        <p className="hero-reveal mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-paragraph-sm text-text-sub-600 [--step:7]">
          <StatusBadge>{hero.availability.status}</StatusBadge>
          {hero.availability.detail}
        </p>

        <div className="hero-reveal mt-8 flex flex-col gap-2 [--step:8] sm:flex-row sm:items-center sm:gap-6">
          <ContactButton
            locale={locale}
            label={content.cta}
            className="min-h-14 px-6"
          />
          <a
            href="#work"
            className="site-link inline-flex min-h-11 items-center justify-center gap-1.5 self-center text-label-md sm:self-auto"
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

        <div className="hero-reveal mt-8 overflow-hidden [--step:9]">
          <ul className="proof-list text-paragraph-sm text-text-sub-600">
            {hero.proof.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <ArchitectureStack
        layers={hero.layers}
        className="hero-reveal mx-auto w-full max-w-[30rem] [--step:4]"
      />
    </section>
  )
}

export { Hero }
