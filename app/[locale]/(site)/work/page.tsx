import { CaseCard } from "@/components/site/case-card"
import { PageIntro } from "@/components/site/page-intro"
import { sitePageMetadata } from "@/lib/seo/site-metadata"
import { trailFromHome } from "@/lib/site-breadcrumbs"
import {
  resolveSitePage,
  siteStaticParams,
  type SitePageProps,
} from "@/lib/site-params"

export const generateStaticParams = siteStaticParams

export async function generateMetadata({ params }: SitePageProps) {
  const { locale, content } = await resolveSitePage(params)
  return sitePageMetadata({
    locale,
    path: "/work",
    meta: content.meta.work,
    siteName: content.siteName,
  })
}

export default async function WorkPage({ params }: SitePageProps) {
  const { locale, content } = await resolveSitePage(params)
  const { work } = content

  return (
    <>
      <PageIntro
        locale={locale}
        title={work.title}
        intro={work.intro}
        trail={trailFromHome(content, { name: work.title, path: "/work" })}
        breadcrumbLabel={content.nav.breadcrumb}
      />
      <div className="site-container flex flex-col border-t border-border pt-10">
        {work.cases.map((study) => (
          <CaseCard
            key={study.slug}
            locale={locale}
            study={study}
            readLabel={content.selectedWork.readCase}
            stackLabel={work.labels.stack}
            headingLevel="h2"
          />
        ))}
      </div>
    </>
  )
}
