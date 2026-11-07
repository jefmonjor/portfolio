import { notFound } from "next/navigation"

import { CaseStudy } from "@/components/site/case-study"
import { ClosingCta } from "@/components/site/closing-cta"
import { PageIntro } from "@/components/site/page-intro"
import { caseStudyAfter, findCaseStudy, isCaseStudySlug } from "@/content/site"
import { caseStudySlugs } from "@/content/site/types"
import { siteLocales } from "@/i18n/routing"
import { sitePageMetadata } from "@/lib/seo/site-metadata"
import { trailFromHome } from "@/lib/site-breadcrumbs"
import { resolveSitePage } from "@/lib/site-params"

type CasePageProps = {
  params: Promise<{ locale: string; slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return siteLocales.flatMap((locale) =>
    caseStudySlugs.map((slug) => ({ locale, slug }))
  )
}

async function resolveCasePage(params: CasePageProps["params"]) {
  const { slug } = await params
  if (!isCaseStudySlug(slug)) notFound()
  const page = await resolveSitePage(params)
  return { ...page, study: findCaseStudy(page.content, slug) }
}

export async function generateMetadata({ params }: CasePageProps) {
  const { locale, content, study } = await resolveCasePage(params)
  return sitePageMetadata({
    locale,
    path: `/work/${study.slug}`,
    meta: study.meta,
    siteName: content.siteName,
    type: "article",
  })
}

export default async function CasePage({ params }: CasePageProps) {
  const { locale, content, study } = await resolveCasePage(params)

  return (
    <article>
      <PageIntro
        locale={locale}
        title={study.title}
        eyebrow={study.sector}
        trail={trailFromHome(
          content,
          { name: content.work.title, path: "/work" },
          { name: study.title, path: `/work/${study.slug}` }
        )}
        breadcrumbLabel={content.nav.breadcrumb}
      />
      <CaseStudy
        locale={locale}
        study={study}
        next={caseStudyAfter(content, study.slug)}
        labels={content.work.labels}
      />
      <ClosingCta
        locale={locale}
        statement={content.services.closing}
        cta={content.cta}
      />
    </article>
  )
}
