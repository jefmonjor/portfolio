import { ArrowDown02Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"

import { ContactButton } from "@/components/site/contact-button"
import {
  HeadlineLineNumbers,
  HeadlineLines,
  IntroOncePerSession,
} from "@/components/site/hero-headline"
import { TerminalHint } from "@/components/site/terminal-hint"
import { ToolOrbit } from "@/components/site/tool-orbit"
import { caseScreenshots } from "@/content/site/images"
import type { SiteContent } from "@/content/site/types"
import type { SiteLocale } from "@/i18n/routing"
import { profile } from "@/lib/profile"

type HeroProps = {
  locale: SiteLocale
  content: SiteContent
}

function Hero({ locale, content }: HeroProps) {
  const { hero } = content

  return (
    <section aria-labelledby="hero-title" className="profile site-container">
      <IntroOncePerSession />
      <div className="profile-copy">
        <h1
          id="hero-title"
          className="hero-title font-heading text-text-strong-950"
        >
          <span className="sr-only">{profile.shortName}, </span>
          <span className="hero-reveal mb-5 block font-ui text-subheading-xs text-text-sub-600 uppercase [--step:0]">
            {hero.role}
            <span className="sr-only">. </span>
          </span>
          <HeadlineLines headline={hero.headline} />
        </h1>
        <p className="hero-reveal site-prose mt-7 text-text-sub-600 [--step:6]">
          {hero.subtitle}
        </p>
        <div className="hero-reveal mt-9 flex flex-col gap-3 [--step:7] sm:flex-row sm:items-center sm:gap-7">
          <ContactButton
            locale={locale}
            label={hero.cta}
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
        <div className="hero-reveal mt-6 flex flex-col gap-1.5 [--step:8]">
          <p className="text-label-md text-text-strong-950">{hero.stack}</p>
          <p className="text-paragraph-sm text-text-sub-600">
            {hero.engagement}
          </p>
        </div>
        <TerminalHint label={hero.terminalHint} />
      </div>
      <HeadlineLineNumbers headlineId="hero-title" />

      <div className="profile-visual">
        <ToolOrbit label={hero.tools.label} center={hero.tools.center} />
        <p className="mt-3 text-center text-paragraph-sm text-balance text-text-sub-600">
          {hero.tools.caption}
        </p>
        <div className="profile-live">
          <p className="text-label-sm text-text-strong-950">
            {hero.live.title}
          </p>
          <ul className="mt-2 flex flex-col">
            {hero.live.items.map((item) => {
              const shot = caseScreenshots[item.slug]
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/live flex min-h-14 items-center gap-3 py-2 text-paragraph-sm"
                  >
                    {shot ? (
                      <Image
                        src={shot.image}
                        alt=""
                        sizes="4.5rem"
                        className="profile-live-thumb"
                      />
                    ) : null}
                    <span className="flex min-w-0 flex-col">
                      <span className="text-label-sm text-text-strong-950">
                        {item.name}
                      </span>
                      <span className="truncate text-text-sub-600">
                        {item.what}
                      </span>
                    </span>
                    <HugeiconsIcon
                      icon={ArrowUpRight01Icon}
                      aria-hidden
                      className="ml-auto size-4 shrink-0 text-icon-soft-400 transition-transform group-hover/live:translate-x-0.5 group-hover/live:-translate-y-0.5"
                      strokeWidth={1.75}
                    />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

export { Hero }
