import Link from "next/link"

import { ArchitectureDiagram } from "@/components/site/architecture-diagram"
import { ArrowLabel } from "@/components/site/arrow-label"
import { BulletList } from "@/components/site/bullet-list"
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
      className="flex flex-col gap-5 border-t border-border pt-10"
    >
      <h2 className="font-heading text-[clamp(1.5rem,1.1vw+1.15rem,2rem)] leading-tight font-medium tracking-[-0.01em] text-foreground">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Paragraphs({ items }: { items: ReadonlyArray<string> }) {
  return (
    <div className="site-prose flex flex-col gap-4 text-foreground">
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
    <dl className="grid border-y border-border md:grid-cols-3">
      {rows.map((row) => (
        <div
          key={row.term}
          className="flex flex-col gap-1 border-b border-border py-4 last:border-b-0 md:border-b-0 md:border-l md:px-5 md:first:border-l-0 md:first:pl-0"
        >
          <dt className="text-sm text-muted-foreground">{row.term}</dt>
          <dd className="text-[1rem] leading-relaxed text-foreground">
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
          className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-2"
        >
          <span className="font-heading text-[1.25rem] leading-snug text-muted-foreground tabular-nums">
            {index + 1}
          </span>
          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-[1.25rem] leading-snug font-medium tracking-[-0.01em] text-foreground">
              {decision.choice}
            </h3>
            <p className="text-[1.0625rem] leading-relaxed text-foreground">
              <span className="font-medium">{labels.reason}: </span>
              {decision.reason}
            </p>
            <p className="text-[1rem] leading-relaxed text-muted-foreground">
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
            <h3 className="text-[1rem] font-medium text-foreground">
              {labels.owned}
            </h3>
            <BulletList items={study.responsibility.owned} />
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-[1rem] font-medium text-foreground">
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
        <ul className="flex flex-wrap gap-2">
          {study.stack.map((item) => (
            <li
              key={item}
              className="border border-border px-2.5 py-1 text-[0.875rem] text-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
        {study.links.length > 0 ? (
          <ul className="flex flex-wrap gap-x-6">
            {study.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-link inline-flex min-h-11 items-center text-[1.0625rem]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </CaseSection>

      <nav aria-label={labels.next} className="border-t border-border pt-10">
        <p className="text-sm text-muted-foreground">{labels.next}</p>
        <Link
          href={localizedPath(locale, `/work/${next.slug}`)}
          className="mt-2 inline-block font-heading text-[clamp(1.25rem,1vw+1rem,1.625rem)] leading-snug font-medium tracking-[-0.01em] text-foreground hover:text-brand"
        >
          <ArrowLabel>{next.title}</ArrowLabel>
        </Link>
      </nav>
    </div>
  )
}

export { CaseStudy }
