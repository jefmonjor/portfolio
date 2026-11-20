import { CaseCard } from "@/components/site/case-card"
import { caseScreenshots } from "@/content/site/images"
import type { CaseStudy, SiteContent } from "@/content/site/types"
import type { SiteLocale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

type CaseDeckProps = {
  locale: SiteLocale
  cases: ReadonlyArray<CaseStudy>
  labels: SiteContent["work"]["labels"]
  readLabel: string
  headingLevel?: "h2" | "h3"
}

/** Cases without a capture are told in words across the full width; the products sit below in a row. */
function CaseDeck({
  locale,
  cases,
  labels,
  readLabel,
  headingLevel,
}: CaseDeckProps) {
  return (
    <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {cases.map((study) => (
        <li
          key={study.slug}
          className={cn(
            "flex",
            caseScreenshots[study.slug] ? undefined : "md:col-span-full"
          )}
        >
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
