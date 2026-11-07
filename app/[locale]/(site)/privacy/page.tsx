import { PageIntro } from "@/components/site/page-intro"
import { RichText } from "@/components/site/rich-text"
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
    path: "/privacy",
    meta: content.meta.privacy,
    siteName: content.siteName,
  })
}

export default async function PrivacyPage({ params }: SitePageProps) {
  const { locale, content } = await resolveSitePage(params)
  const { privacy } = content

  return (
    <>
      <PageIntro
        locale={locale}
        title={privacy.title}
        intro={privacy.updated}
        trail={trailFromHome(content, {
          name: privacy.title,
          path: "/privacy",
        })}
        breadcrumbLabel={content.nav.breadcrumb}
      />
      <div className="site-container flex max-w-[52rem] flex-col gap-10 border-t border-border pt-10 lg:ml-[max(0px,calc((100vw-72rem)/2))]">
        {privacy.sections.map((section) => (
          <section key={section.title} className="flex flex-col gap-3">
            <h2 className="font-heading text-[1.375rem] leading-snug font-medium tracking-[-0.01em] text-foreground">
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph, index) => (
              <p key={index} className="site-prose text-foreground">
                <RichText locale={locale} content={paragraph} />
              </p>
            ))}
          </section>
        ))}
      </div>
    </>
  )
}
