import { ArrowDown02Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ContactButton } from "@/components/site/contact-button"
import { StatusBadge } from "@/components/site/status-badge"
import { ToolOrbit } from "@/components/site/tool-orbit"
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

/** Each part of the headline is one sentence and starts its own line. */
function HeadlineLines({ headline }: { headline: Headline }) {
  const lines = headline.map((part) =>
    (typeof part === "string" ? part : part.emphasis)
      .split(/\s+/)
      .filter(Boolean)
  )

  return lines.map((words, line) => (
    <span key={line}>
      {line > 0 ? " " : null}
      <span className="block">
        {words.map((word, index) => (
          <span key={index}>
            {index > 0 ? " " : null}
            <span data-word className="hero-word">
              <span>{word}</span>
            </span>
          </span>
        ))}
      </span>
    </span>
  ))
}

function Hero({ locale, content }: HeroProps) {
  const { hero } = content

  return (
    <section aria-labelledby="hero-title" className="profile site-container">
      {runBeforeFirstPaint(
        `(${playIntroOncePerSession.toString()})(document.documentElement)`
      )}
      <div className="profile-copy">
        <div className="hero-reveal [--step:0]">
          <StatusBadge>{hero.availability.status}</StatusBadge>
        </div>
        <h1
          id="hero-title"
          className="hero-title mt-7 font-heading text-text-strong-950"
        >
          <span className="sr-only">
            {profile.shortName}, {hero.role}.{" "}
          </span>
          <HeadlineLines headline={hero.headline} />
        </h1>
        <p className="hero-reveal site-prose mt-7 text-text-sub-600 [--step:6]">
          {hero.subtitle}
        </p>
        <div className="hero-reveal mt-9 flex flex-col gap-3 [--step:7] sm:flex-row sm:items-center sm:gap-7">
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
        <p className="hero-reveal mt-5 text-paragraph-sm text-text-sub-600 [--step:8]">
          {hero.direct}
        </p>
      </div>
      {/* After the whole copy: Chrome may paint when the parser yields after
          a script, and a paint mid-copy would shift the copy as it grows. */}
      {runBeforeFirstPaint(
        `(${numberHeadlineLines.toString()})(document.getElementById("hero-title"))`
      )}

      <div className="profile-visual">
        <ToolOrbit label={hero.tools.label} center={hero.tools.center} />
        <div className="profile-live">
          <p className="text-label-sm text-text-strong-950">
            {hero.live.title}
          </p>
          <ul className="mt-2 flex flex-col">
            {hero.live.items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/live flex min-h-11 items-center gap-3 text-paragraph-sm"
                >
                  <span aria-hidden className="status-dot status-dot-still" />
                  <span className="text-text-strong-950">{item.name}</span>
                  <span className="truncate text-text-sub-600">
                    {item.what}
                  </span>
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    aria-hidden
                    className="ml-auto size-4 text-icon-soft-400 transition-transform group-hover/live:translate-x-0.5 group-hover/live:-translate-y-0.5"
                    strokeWidth={1.75}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export { Hero }
