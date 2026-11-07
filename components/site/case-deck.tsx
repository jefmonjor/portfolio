import { CaseCard } from "@/components/site/case-card"
import type { CaseStudy } from "@/content/site/types"
import type { SiteLocale } from "@/i18n/routing"

type CaseDeckProps = {
  locale: SiteLocale
  cases: ReadonlyArray<CaseStudy>
  readLabel: string
  stackLabel: string
  stacked?: boolean
  headingLevel?: "h2" | "h3"
}

function caseOrder(index: number, total: number): string {
  const pad = (value: number) => String(value).padStart(2, "0")
  return `${pad(index + 1)} / ${pad(total)}`
}

function CaseDeck({
  locale,
  cases,
  readLabel,
  stackLabel,
  stacked = false,
  headingLevel,
}: CaseDeckProps) {
  return (
    <ol className={stacked ? "case-deck" : "grid gap-4"}>
      {cases.map((study, index) => (
        <li key={study.slug}>
          <CaseCard
            locale={locale}
            study={study}
            order={caseOrder(index, cases.length)}
            readLabel={readLabel}
            stackLabel={stackLabel}
            headingLevel={headingLevel}
          />
        </li>
      ))}
    </ol>
  )
}

export { CaseDeck }
