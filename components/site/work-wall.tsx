import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"
import Link from "next/link"

import { ArchitectureDiagram } from "@/components/site/architecture-diagram"
import { CaseVisual } from "@/components/site/case-card"
import { ContactButton } from "@/components/site/contact-button"
import { TiltFrame } from "@/components/site/tilt-frame"
import {
  AboutPanel,
  ClosingPanel,
  HiringPanel,
  MethodPanel,
  ServicesPanel,
  ToolsPanel,
} from "@/components/site/wall-panels"
import {
  caseScreenshots,
  productScreenshots,
  wallScreenshots,
} from "@/content/site/images"
import type { CaseStudy, SiteContent } from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"
import { siteProducts, type SiteProduct } from "@/lib/site-products"
import { cn } from "@/lib/utils"

type WorkWallProps = {
  locale: SiteLocale
  content: SiteContent
}

const tileImageSizes = "(min-width: 75rem) 31rem, (min-width: 48rem) 46vw, 92vw"

function CaseTile({
  locale,
  study,
  architectureLabel,
  className,
}: {
  locale: SiteLocale
  study: CaseStudy
  architectureLabel: string
  className?: string
}) {
  const screenshot = wallScreenshots[study.slug] ?? caseScreenshots[study.slug]

  return (
    <article className={cn("tile relative", className)}>
      {screenshot ? (
        <CaseVisual
          study={study}
          screenshot={screenshot}
          sizes={tileImageSizes}
        />
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
      <div className="flex flex-col gap-2 px-6 pt-5 pb-6">
        <h2 className="font-heading text-title-h5 text-balance text-text-strong-950">
          <Link
            href={localizedPath(locale, `/work/${study.slug}`)}
            className="decoration-stroke-sub-300 underline-offset-4 after:absolute after:inset-0 after:rounded-16 hover:underline focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-primary-base"
          >
            {study.title}
          </Link>
        </h2>
        <p className="text-paragraph-sm text-text-sub-600">{study.outcome}</p>
        <p className="text-label-sm text-text-strong-950">{study.sector}</p>
      </div>
    </article>
  )
}

function MoreProducts({
  title,
  products,
  className,
}: {
  title: string
  products: ReadonlyArray<SiteProduct>
  className?: string
}) {
  return (
    <section
      aria-labelledby="more-products-title"
      className={cn("tile tile-pad", className)}
    >
      <h2 id="more-products-title" className="tile-title">
        {title}
      </h2>
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
    </section>
  )
}

/**
 * The headline's systems on the left and its products on the right, with the
 * AI working inside both. Phones show one column, with the proof (bank, then
 * products) and the contact button before the method, as `max-md:order-*` sets.
 */
function WorkWall({ locale, content }: WorkWallProps) {
  const systems = content.work.cases.filter(
    (study) => !caseScreenshots[study.slug]
  )
  const productCases = content.work.cases.filter(
    (study) => caseScreenshots[study.slug]
  )
  const products = siteProducts(locale)
  const moreProducts = Object.keys(productScreenshots).flatMap((id) =>
    products.filter((product) => product.id === id && product.href)
  )
  const architectureLabel = content.work.labels.architecture

  return (
    <div id="work" className="wall">
      <div className="wall-column">
        {systems.map((study) => (
          <CaseTile
            key={study.slug}
            locale={locale}
            study={study}
            architectureLabel={architectureLabel}
            className="max-md:order-1"
          />
        ))}
        <ToolsPanel hero={content.hero} className="max-md:order-4" />
        <MethodPanel content={content} className="max-md:order-5" />
        <ServicesPanel
          locale={locale}
          content={content}
          className="max-md:order-6"
        />
        <AboutPanel
          locale={locale}
          content={content}
          className="max-md:order-7"
        />
      </div>
      <div className="wall-column">
        {productCases.map((study) => (
          <CaseTile
            key={study.slug}
            locale={locale}
            study={study}
            architectureLabel={architectureLabel}
            className="max-md:order-2"
          />
        ))}
        <MoreProducts
          title={content.wall.moreProducts}
          products={moreProducts}
          className="max-md:order-3"
        />
        <ContactButton
          locale={locale}
          label={content.hero.cta}
          className="min-h-14 px-6 max-md:order-3 md:hidden"
        />
        <HiringPanel
          locale={locale}
          hiring={content.hiring}
          className="max-md:order-8"
        />
        <ClosingPanel
          locale={locale}
          content={content}
          className="max-md:order-9"
        />
      </div>
    </div>
  )
}

export { WorkWall }
