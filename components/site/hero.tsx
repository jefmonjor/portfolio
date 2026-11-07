import Link from "next/link"

import { ArrowLabel } from "@/components/site/arrow-label"
import type { SiteContent } from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"

type HeroProps = {
  locale: SiteLocale
  content: SiteContent
}

function Hero({ locale, content }: HeroProps) {
  const { hero } = content

  return (
    <section
      aria-labelledby="hero-title"
      className="site-container pt-6 pb-16 sm:pt-12 md:pt-24 md:pb-24"
    >
      <h1
        id="hero-title"
        className="flex flex-col gap-1 text-[1.0625rem] leading-snug"
      >
        <span className="hero-line font-medium text-foreground [--line:0]">
          {hero.name}
        </span>
        <span className="hero-line text-muted-foreground [--line:1]">
          {hero.role}
        </span>
      </h1>

      <p className="hero-line mt-5 max-w-[22ch] font-heading text-[clamp(1.625rem,3.6vw+1.25rem,4rem)] leading-[1.08] font-medium tracking-[-0.02em] text-foreground [--line:2] sm:mt-6 sm:max-w-[24ch]">
        {hero.value}
      </p>

      <ul className="hero-line mt-5 flex flex-wrap gap-x-3 gap-y-1 text-[0.9375rem] font-medium text-foreground [--line:3] sm:mt-8">
        {hero.tags.map((tag, index) => (
          <li key={tag} className="flex items-center gap-3">
            {tag}
            {index < hero.tags.length - 1 ? (
              <span aria-hidden className="text-border">
                ·
              </span>
            ) : null}
          </li>
        ))}
      </ul>

      <p className="mt-3 flex items-start gap-2.5 text-[0.9375rem] leading-snug text-muted-foreground sm:mt-4">
        <span
          aria-hidden
          className="mt-[0.45em] inline-block size-2 shrink-0 rounded-full bg-brand"
        />
        {hero.availability}
      </p>

      <Link
        href={localizedPath(locale, "/contact")}
        className="site-button mt-4 w-full sm:mt-8 sm:w-auto"
      >
        <ArrowLabel>{content.cta}</ArrowLabel>
      </Link>
    </section>
  )
}

export { Hero }
