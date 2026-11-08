import Image from "next/image"
import Link from "next/link"

import { ArrowLabel } from "@/components/site/arrow-label"
import { CaseFlow } from "@/components/site/case-flow"
import { TagList } from "@/components/site/tag-list"
import { caseScreenshots } from "@/content/site/images"
import type { CaseStudy, SiteContent } from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"

type CaseCardProps = {
  locale: SiteLocale
  study: CaseStudy
  labels: Pick<SiteContent["work"]["labels"], "role" | "stack">
  readLabel: string
  headingLevel?: "h2" | "h3"
}

function CaseVisual({ study }: { study: CaseStudy }) {
  const screenshot = caseScreenshots[study.slug]

  if (screenshot && study.screenshotAlt) {
    return (
      <figure className="case-shot">
        <figcaption aria-hidden className="case-shot-bar">
          <span className="case-shot-dots" />
          <span className="case-shot-host">{screenshot.host}</span>
        </figcaption>
        <Image
          src={screenshot.image}
          alt={study.screenshotAlt}
          placeholder="blur"
          sizes="(min-width: 64rem) 34rem, (min-width: 48rem) 45vw, 92vw"
          className="case-shot-image"
        />
      </figure>
    )
  }

  return (
    <div aria-hidden className="case-shot case-shot-diagram">
      <CaseFlow nodes={study.diagram} className="flex w-full max-w-[15rem]" />
    </div>
  )
}

function CaseCard({
  locale,
  study,
  labels,
  readLabel,
  headingLevel = "h3",
}: CaseCardProps) {
  const Heading = headingLevel

  return (
    <article className="group/arrow site-card relative flex w-full flex-col overflow-hidden">
      <CaseVisual study={study} />
      <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
        <p className="text-label-sm text-text-sub-600">{study.sector}</p>
        <Heading className="font-heading text-title-h5 text-text-strong-950">
          <Link
            href={localizedPath(locale, `/work/${study.slug}`)}
            className="decoration-stroke-sub-300 underline-offset-4 group-hover/arrow:underline after:absolute after:inset-0 after:rounded-20 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-primary-base"
          >
            {study.title}
          </Link>
        </Heading>
        <p className="text-paragraph-md text-text-sub-600">{study.outcome}</p>
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
    </article>
  )
}

export { CaseCard }
