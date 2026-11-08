import { ArrowDown02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"

import { ContactButton } from "@/components/site/contact-button"
import { HeroAnnotations } from "@/components/site/hero-annotations"
import { StatusBadge } from "@/components/site/status-badge"
import { sitePhotos, unsplashReferral } from "@/content/site/photos"
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

type HeadlineWord = {
  text: string
  emphasis: boolean
  joinsPrevious: boolean
}

function splitHeadline(headline: Headline): HeadlineWord[] {
  return headline.flatMap((part): HeadlineWord[] => {
    if (typeof part !== "string") {
      return [{ text: part.emphasis, emphasis: true, joinsPrevious: false }]
    }
    const joinsPrevious = !/^\s/.test(part)
    return part
      .split(/\s+/)
      .filter(Boolean)
      .map((text, index) => ({
        text,
        emphasis: false,
        joinsPrevious: index === 0 && joinsPrevious,
      }))
  })
}

function HeadlineWords({ headline }: { headline: Headline }) {
  const words = splitHeadline(headline)

  return words.map((word, index) => (
    <span key={index}>
      {index > 0 && !word.joinsPrevious ? " " : null}
      <span data-word className="hero-word">
        <span className={word.emphasis ? "hero-emphasis" : undefined}>
          {word.text}
        </span>
      </span>
    </span>
  ))
}

function Hero({ locale, content }: HeroProps) {
  const { hero } = content
  const photo = sitePhotos.hero

  return (
    <section aria-labelledby="hero-title" className="hero">
      {runBeforeFirstPaint(
        `(${playIntroOncePerSession.toString()})(document.documentElement)`
      )}
      <div className="hero-frame surface-dark">
        <div aria-hidden className="hero-media">
          <Image
            src={photo.image}
            alt=""
            priority
            placeholder="blur"
            sizes="100vw"
            className="hero-photo"
          />
          <HeroAnnotations labels={hero.annotations} />
        </div>
        <div aria-hidden className="hero-shade" />

        <div className="hero-copy">
          <div className="hero-reveal [--step:0]">
            <StatusBadge>{hero.availability.status}</StatusBadge>
          </div>
          <h1
            id="hero-title"
            className="hero-title mt-6 font-heading text-text-strong-950"
          >
            <span className="sr-only">
              {profile.shortName}, {hero.role}.{" "}
            </span>
            <HeadlineWords headline={hero.headline} />
          </h1>
          <p className="hero-reveal mt-6 max-w-[38rem] text-paragraph-lg text-text-strong-950 [--step:6]">
            {hero.subtitle}
          </p>
          <div className="hero-reveal mt-8 flex flex-col gap-2 [--step:7] sm:flex-row sm:items-center sm:gap-6">
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
        </div>

        {/* After the whole copy: Chrome may paint when the parser yields after
            a script, and a paint mid-copy would shift the copy as it grows. */}
        {runBeforeFirstPaint(
          `(${numberHeadlineLines.toString()})(document.getElementById("hero-title"))`
        )}

        <p className="hero-credit">
          {content.footer.photography}:{" "}
          <a
            href={`${photo.profile}?${unsplashReferral}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            {photo.photographer}
          </a>
        </p>
      </div>

      <div className="site-container pt-6">
        <div className="overflow-hidden">
          <ul className="proof-list text-paragraph-sm text-text-sub-600">
            {hero.proof.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export { Hero }
