import Link from "next/link"

import { ArchitectureDiagram } from "@/components/site/architecture-diagram"
import { ArrowLabel } from "@/components/site/arrow-label"
import { BulletList } from "@/components/site/bullet-list"
import { TagList } from "@/components/site/tag-list"
import type {
  CaseStudy as CaseStudyContent,
  SiteContent,
} from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"

type CaseStudyProps = {
  locale: SiteLocale
  study: CaseStudyContent
  next: CaseStudyContent
  labels: SiteContent["work"]["labels"]
}

function CaseSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      data-reveal
      className="flex flex-col gap-5 border-t border-stroke-soft-200 pt-10"
    >
      <h2 className="text-title-h5 text-text-strong-950">{title}</h2>
      {children}
    </section>
  )
}

function Paragraphs({ items }: { items: ReadonlyArray<string> }) {
  return (
    <div className="site-prose flex flex-col gap-4 text-text-strong-950">
      {items.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  )
}

function CaseSummary({
  study,
  labels,
}: Pick<CaseStudyProps, "study" | "labels">) {
  const rows = [
    { term: labels.sector, value: study.summary.sector },
    { term: labels.role, value: study.summary.role },
    { term: labels.outcome, value: study.summary.result },
  ]

  return (
    <dl className="site-card grid divide-y divide-stroke-soft-200 md:grid-cols-3 md:divide-x md:divide-y-0">
      {rows.map((row) => (
        <div key={row.term} className="flex flex-col gap-1 p-5">
          <dt className="text-label-sm text-text-sub-600">{row.term}</dt>
          <dd className="text-paragraph-md text-text-strong-950">
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function Decisions({
  study,
  labels,
}: Pick<CaseStudyProps, "study" | "labels">) {
  return (
    <ol className="flex flex-col gap-8">
      {study.decisions.map((decision, index) => (
        <li
          key={decision.choice}
          className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-2"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-bg-weak-50 text-label-xs text-text-sub-600 tabular-nums ring-1 ring-stroke-soft-200 ring-inset">
            {index + 1}
          </span>
          <div className="flex flex-col gap-3">
            <h3 className="text-title-h6 text-text-strong-950">
              {decision.choice}
            </h3>
            <p className="text-paragraph-md text-text-strong-950">
              <span className="font-medium">{labels.reason}: </span>
              {decision.reason}
            </p>
            <p className="text-paragraph-sm text-text-sub-600">
              <span className="font-medium">{labels.rejected}: </span>
              {decision.rejected}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function CaseStudy({ locale, study, next, labels }: CaseStudyProps) {
  return (
    <div className="site-container site-column flex flex-col gap-12">
      <CaseSummary study={study} labels={labels} />

      <CaseSection title={labels.context}>
        <Paragraphs items={study.context} />
      </CaseSection>

      <CaseSection title={labels.responsibility}>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h3 className="text-label-md text-text-strong-950">
              {labels.owned}
            </h3>
            <BulletList items={study.responsibility.owned} />
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-label-md text-text-strong-950">
              {labels.notOwned}
            </h3>
            <BulletList items={study.responsibility.notOwned} />
          </div>
        </div>
      </CaseSection>

      <CaseSection title={labels.decisions}>
        <Decisions study={study} labels={labels} />
      </CaseSection>

      <CaseSection title={labels.architecture}>
        <ArchitectureDiagram
          id={study.slug}
          title={labels.architecture}
          nodes={study.diagram}
        />
      </CaseSection>

      <CaseSection title={labels.implementation}>
        <Paragraphs items={study.implementation} />
      </CaseSection>

      <CaseSection title={labels.results}>
        <BulletList items={study.result} />
      </CaseSection>

      <CaseSection title={labels.stack}>
        <TagList items={study.stack} />
        {study.links.length > 0 ? (
          <ul className="flex flex-wrap gap-x-6">
            {study.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-link inline-flex min-h-11 items-center text-label-md"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </CaseSection>

      <nav
        aria-label={labels.next}
        className="border-t border-stroke-soft-200 pt-10"
      >
        <p className="text-label-sm text-text-sub-600">{labels.next}</p>
        <Link
          href={localizedPath(locale, `/work/${next.slug}`)}
          className="group/arrow mt-2 inline-block text-title-h5 text-text-strong-950 decoration-stroke-sub-300 underline-offset-4 hover:underline"
        >
          <ArrowLabel>{next.title}</ArrowLabel>
        </Link>
      </nav>
    </div>
  )
}

export { CaseStudy }
