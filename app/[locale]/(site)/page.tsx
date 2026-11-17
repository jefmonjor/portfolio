import { WallIntro } from "@/components/site/wall-intro"
import { WorkWall } from "@/components/site/work-wall"
import {
  resolveSitePage,
  siteMetadataFor,
  siteStaticParams,
  type SitePageProps,
} from "@/lib/site-params"

export const generateStaticParams = siteStaticParams

export const generateMetadata = siteMetadataFor("/", "home")

export default async function HomePage({ params }: SitePageProps) {
  const { locale, content } = await resolveSitePage(params)

  return (
    <div className="wall-page">
      <WallIntro locale={locale} content={content} />
      <WorkWall locale={locale} content={content} />
    </div>
  )
}
