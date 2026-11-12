import Link from "next/link"

import { ArrowLabel } from "@/components/site/arrow-label"
import { ArrowLink } from "@/components/site/arrow-link"
import { CaseVisual } from "@/components/site/case-card"
import { TagList } from "@/components/site/tag-list"
import { TiltFrame } from "@/components/site/tilt-frame"
import type {
  CaseStudy,
  CaseStudySlug,
  SiteContent,
} from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"

type CaseShowcaseProps = {
  locale: SiteLocale
  cases: ReadonlyArray<CaseStudy>
  featured: CaseStudySlug
  labels: Pick<SiteContent["work"]["labels"], "role" | "stack">
  readLabel: string
}

/** One case shown large, like a product shot, and the rest as an index. */
function CaseShowcase({
  locale,
  cases,
  featured,
  labels,
  readLabel,
}: CaseShowcaseProps) {
  const lead = cases.find((study) => study.slug === featured) ?? cases[0]
  if (!lead) return null
  const others = cases.filter((study) => study !== lead)
  const caseHref = (study: CaseStudy) =>
    localizedPath(locale, `/work/${study.slug}`)

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      <article className="grid items-center gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
        <TiltFrame className="case-feature">
          <CaseVisual
            study={lead}
            sizes="(min-width: 80rem) 44rem, (min-width: 64rem) 55vw, 92vw"
          />
        </TiltFrame>
        <div className="flex flex-col gap-4">
          <p className="text-label-sm text-text-sub-600">{lead.sector}</p>
          <h3 className="font-heading text-title-h3 text-balance text-text-strong-950">
            <Link
              href={caseHref(lead)}
              className="decoration-stroke-sub-300 underline-offset-4 hover:underline"
            >
              {lead.title}
            </Link>
          </h3>
          <p className="text-paragraph-lg text-text-sub-600">{lead.outcome}</p>
          <p className="text-paragraph-sm text-text-sub-600">
            <span className="text-text-strong-950">{labels.role}: </span>
            {lead.summary.role}
          </p>
          <TagList items={lead.tags} label={labels.stack} />
          <ArrowLink href={caseHref(lead)} className="mt-2 self-start">
            {readLabel}
          </ArrowLink>
        </div>
      </article>

      <ul className="border-b border-stroke-soft-200">
        {others.map((study) => (
          <li
            key={study.slug}
            className="group/arrow relative grid gap-x-10 gap-y-2 border-t border-stroke-soft-200 py-6 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_auto] md:items-baseline"
          >
            <p className="text-label-sm text-text-sub-600">{study.sector}</p>
            <div className="flex flex-col gap-1.5">
              <h3 className="font-heading text-title-h5 text-text-strong-950">
                <Link
                  href={caseHref(study)}
                  className="decoration-stroke-sub-300 underline-offset-4 group-hover/arrow:underline after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-primary-base"
                >
                  {study.title}
                </Link>
              </h3>
              <p className="max-w-[62ch] text-paragraph-sm text-text-sub-600">
                {study.outcome}
              </p>
            </div>
            <p
              aria-hidden
              className="text-label-sm whitespace-nowrap text-text-strong-950"
            >
              <ArrowLabel>{readLabel}</ArrowLabel>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { CaseShowcase }
