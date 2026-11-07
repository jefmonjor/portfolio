import { CaseDeck } from "@/components/site/case-deck"
import { ClosingCta } from "@/components/site/closing-cta"
import { PageIntro } from "@/components/site/page-intro"
import {
  resolveSitePage,
  siteMetadataFor,
  siteStaticParams,
  type SitePageProps,
} from "@/lib/site-params"

export const generateStaticParams = siteStaticParams

export const generateMetadata = siteMetadataFor("/work", "work")

export default async function WorkPage({ params }: SitePageProps) {
  const { locale, content } = await resolveSitePage(params)
  const { work } = content

  return (
    <>
      <PageIntro
        locale={locale}
        content={content}
        title={work.title}
        intro={work.intro}
        crumbs={[{ name: work.title, path: "/work" }]}
      />
      <div className="site-container">
        <CaseDeck
          locale={locale}
          cases={work.cases}
          readLabel={content.selectedWork.readCase}
          stackLabel={work.labels.stack}
          headingLevel="h2"
        />
      </div>
      <ClosingCta locale={locale} content={content} />
    </>
  )
}
