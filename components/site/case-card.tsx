import Link from "next/link"

import { ArrowLabel } from "@/components/site/arrow-label"
import { CaseFlow } from "@/components/site/case-flow"
import { TagList } from "@/components/site/tag-list"
import type { CaseStudy, SiteContent } from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"

type CaseCardProps = {
  locale: SiteLocale
  study: CaseStudy
  order: string
  labels: Pick<SiteContent["work"]["labels"], "role" | "stack">
  readLabel: string
  headingLevel?: "h2" | "h3"
}

function CaseCard({
  locale,
  study,
  order,
  labels,
  readLabel,
  headingLevel = "h3",
}: CaseCardProps) {
  const Heading = headingLevel

  return (
    <article className="group/arrow site-card site-card-spotlight relative grid h-full gap-8 p-6 md:grid-cols-[minmax(0,1fr)_13rem] md:p-8">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-subheading-xs text-text-sub-600 uppercase">
            {study.sector}
          </p>
          <span
            aria-hidden
            className="text-label-xs text-text-soft-400 tabular-nums md:hidden"
          >
            {order}
          </span>
        </div>
        <Heading className="font-heading text-title-h5 text-text-strong-950">
          <Link
            href={localizedPath(locale, `/work/${study.slug}`)}
            className="decoration-stroke-sub-300 underline-offset-4 group-hover/arrow:underline after:absolute after:inset-0 after:rounded-20 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-primary-base"
          >
            {study.title}
          </Link>
        </Heading>
        <p className="max-w-[40rem] text-paragraph-md text-text-sub-600">
          {study.outcome}
        </p>
        <p className="text-paragraph-sm text-text-sub-600">
          <span className="text-text-strong-950">{labels.role}: </span>
          {study.summary.role}
        </p>
        <TagList items={study.tags} label={labels.stack} />
        <p
          aria-hidden
          className="mt-auto pt-2 text-label-sm text-text-strong-950"
        >
          <ArrowLabel>{readLabel}</ArrowLabel>
        </p>
      </div>
      <div className="hidden flex-col gap-3 md:flex">
        <span
          aria-hidden
          className="self-end text-label-xs text-text-soft-400 tabular-nums"
        >
          {order}
        </span>
        <CaseFlow nodes={study.diagram} className="flex" />
      </div>
    </article>
  )
}

export { CaseCard }
