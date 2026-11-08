import { CaseCard } from "@/components/site/case-card"
import type { CaseStudy, SiteContent } from "@/content/site/types"
import type { SiteLocale } from "@/i18n/routing"

type CaseDeckProps = {
  locale: SiteLocale
  cases: ReadonlyArray<CaseStudy>
  labels: SiteContent["work"]["labels"]
  readLabel: string
  headingLevel?: "h2" | "h3"
}

function CaseDeck({
  locale,
  cases,
  labels,
  readLabel,
  headingLevel,
}: CaseDeckProps) {
  return (
    <ol className="grid gap-5 md:grid-cols-2">
      {cases.map((study) => (
        <li key={study.slug} className="flex">
          <CaseCard
            locale={locale}
            study={study}
            labels={labels}
            readLabel={readLabel}
            headingLevel={headingLevel}
          />
        </li>
      ))}
    </ol>
  )
}

export { CaseDeck }
