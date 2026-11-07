import { CaseCard } from "@/components/site/case-card"
import { PointerTilt } from "@/components/site/pointer-tilt"
import type { CaseStudy, SiteContent } from "@/content/site/types"
import type { SiteLocale } from "@/i18n/routing"
import { twoDigits } from "@/lib/numbering"

type CaseDeckProps = {
  locale: SiteLocale
  cases: ReadonlyArray<CaseStudy>
  labels: SiteContent["work"]["labels"]
  readLabel: string
  stacked?: boolean
  headingLevel?: "h2" | "h3"
}

function CaseDeck({
  locale,
  cases,
  labels,
  readLabel,
  stacked = false,
  headingLevel,
}: CaseDeckProps) {
  return (
    <ol className={stacked ? "case-deck" : "grid gap-4"}>
      {cases.map((study, index) => (
        <li key={study.slug}>
          <PointerTilt className="tilt-card h-full" maxDegrees={4}>
            <CaseCard
              locale={locale}
              study={study}
              order={`${twoDigits(index + 1)} / ${twoDigits(cases.length)}`}
              labels={labels}
              readLabel={readLabel}
              headingLevel={headingLevel}
            />
          </PointerTilt>
        </li>
      ))}
    </ol>
  )
}

export { CaseDeck }
