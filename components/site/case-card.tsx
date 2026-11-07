import Link from "next/link"

import { ArrowLabel } from "@/components/site/arrow-label"
import type { CaseStudy } from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"

type CaseCardProps = {
  locale: SiteLocale
  study: CaseStudy
  readLabel: string
  stackLabel: string
  headingLevel?: "h2" | "h3"
}

function CaseCard({
  locale,
  study,
  readLabel,
  stackLabel,
  headingLevel = "h3",
}: CaseCardProps) {
  const Heading = headingLevel

  return (
    <article className="enter-on-scroll group/arrow relative flex flex-col gap-3 border-t border-border py-7 transition-colors first:border-t-0 first:pt-0 md:hover:[&_.case-title]:text-brand">
      <p className="text-sm font-medium text-brand">{study.sector}</p>
      <Heading className="case-title font-heading text-[clamp(1.375rem,1vw+1.1rem,1.75rem)] leading-snug font-medium tracking-[-0.01em] text-foreground transition-colors">
        <Link
          href={localizedPath(locale, `/work/${study.slug}`)}
          className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-ring"
        >
          {study.title}
        </Link>
      </Heading>
      <p className="max-w-[40rem] text-[1.0625rem] leading-relaxed text-muted-foreground">
        {study.outcome}
      </p>
      <ul className="flex flex-wrap gap-2" aria-label={stackLabel}>
        {study.tags.map((tag) => (
          <li
            key={tag}
            className="border border-border px-2.5 py-1 text-[0.8125rem] text-foreground"
          >
            {tag}
          </li>
        ))}
      </ul>
      <p
        aria-hidden
        className="mt-1 text-[0.9375rem] font-medium text-foreground"
      >
        <ArrowLabel>{readLabel}</ArrowLabel>
      </p>
    </article>
  )
}

export { CaseCard }
