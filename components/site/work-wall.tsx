import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"

import { ArchitectureDiagram } from "@/components/site/architecture-diagram"
import { CaseVisual } from "@/components/site/case-card"
import { TiltFrame } from "@/components/site/tilt-frame"
import {
  AboutPanel,
  ClosingPanel,
  HiringPanel,
  MethodPanel,
  ServicesPanel,
  ToolsPanel,
} from "@/components/site/wall-panels"
import { caseScreenshots, productScreenshots } from "@/content/site/images"
import type { CaseStudy, SiteContent } from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"
import { siteProducts, type SiteProduct } from "@/lib/site-products"

type WorkWallProps = {
  locale: SiteLocale
  content: SiteContent
}

const tileImageSizes = "(min-width: 75rem) 31rem, (min-width: 48rem) 46vw, 92vw"

function CaseTile({
  locale,
  study,
  architectureLabel,
}: {
  locale: SiteLocale
  study: CaseStudy
  architectureLabel: string
}) {
  const hasScreenshot = Boolean(caseScreenshots[study.slug])

  return (
    <article className="tile relative">
      {hasScreenshot ? (
        <CaseVisual study={study} sizes={tileImageSizes} />
      ) : (
        <div className="border-b border-stroke-soft-200 px-6 py-7">
          <TiltFrame className="case-tilt mx-auto w-full max-w-[20rem]">
            <ArchitectureDiagram
              id={`wall-${study.slug}`}
              title={architectureLabel}
              nodes={study.diagram}
              bare
            />
          </TiltFrame>
        </div>
      )}
      <div className="flex flex-col gap-1.5 px-6 pt-5 pb-6">
        <p className="text-label-sm text-text-sub-600">{study.sector}</p>
        <h3 className="font-heading text-title-h5 text-balance text-text-strong-950">
          <Link
            href={localizedPath(locale, `/work/${study.slug}`)}
            className="decoration-stroke-sub-300 underline-offset-4 after:absolute after:inset-0 after:rounded-16 hover:underline focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-primary-base"
          >
            {study.title}
          </Link>
        </h3>
        {hasScreenshot ? null : (
          <p className="text-paragraph-sm text-text-sub-600">{study.outcome}</p>
        )}
      </div>
    </article>
  )
}

function MoreProducts({
  title,
  products,
}: {
  title: string
  products: ReadonlyArray<SiteProduct>
}) {
  return (
    <div className="tile tile-pad">
      <h3 className="tile-title">{title}</h3>
      <ul className="mt-2 flex flex-col">
        {products.map((product) => (
          <li
            key={product.id}
            className="border-t border-stroke-soft-200 first:border-t-0"
          >
            <a
              href={product.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/live flex min-h-20 items-center gap-4 py-3"
            >
              <Image
                src={productScreenshots[product.id]}
                alt=""
                sizes="7.5rem"
                className="wall-thumb"
              />
              <span className="flex min-w-0 flex-col">
                <span className="text-label-md text-text-strong-950">
                  {product.name}
                </span>
                <span className="text-paragraph-sm text-text-sub-600">
                  {product.kind}
                </span>
              </span>
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                aria-hidden
                className="ml-auto size-4 shrink-0 text-icon-soft-400 transition-transform group-hover/live:translate-x-0.5 group-hover/live:-translate-y-0.5"
                strokeWidth={1.75}
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Left: what he has built. Right: how he works and how to hire him. Phones read them in that order. */
function WorkWall({ locale, content }: WorkWallProps) {
  const moreProducts = siteProducts(locale).filter(
    (product) => productScreenshots[product.id] && product.href
  )

  return (
    <div className="wall">
      <div className="wall-column">
        <section id="work" aria-labelledby="work-title" className="wall-column">
          <h2 id="work-title" className="sr-only">
            {content.selectedWork.title}
          </h2>
          {content.work.cases.map((study) => (
            <CaseTile
              key={study.slug}
              locale={locale}
              study={study}
              architectureLabel={content.work.labels.architecture}
            />
          ))}
          <MoreProducts
            title={content.wall.moreProducts}
            products={moreProducts}
          />
        </section>
        <HiringPanel locale={locale} hiring={content.hiring} />
      </div>
      <div className="wall-column">
        <ToolsPanel hero={content.hero} />
        <MethodPanel content={content} />
        <ServicesPanel locale={locale} content={content} />
        <AboutPanel locale={locale} content={content} />
        <ClosingPanel locale={locale} content={content} />
      </div>
    </div>
  )
}

export { WorkWall }
