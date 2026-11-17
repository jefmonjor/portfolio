import type { Metadata } from "next"

import { WallIntro } from "@/components/site/wall-intro"
import { WorkWall } from "@/components/site/work-wall"
import {
  resolveSitePage,
  siteStaticParams,
  type SitePageProps,
} from "@/lib/site-params"

export const generateStaticParams = siteStaticParams

/** A prototype of the home for the owner to compare; it stays out of search and the sitemap. */
export async function generateMetadata({
  params,
}: SitePageProps): Promise<Metadata> {
  const { content } = await resolveSitePage(params)
  return {
    title: content.meta.home.title,
    robots: { index: false, follow: false },
  }
}

export default async function LabHomePage({ params }: SitePageProps) {
  const { locale, content } = await resolveSitePage(params)

  return (
    <div className="wall-page">
      <WallIntro locale={locale} content={content} />
      <WorkWall locale={locale} content={content} />
    </div>
  )
}
