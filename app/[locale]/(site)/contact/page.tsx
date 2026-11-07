import { BulletList } from "@/components/site/bullet-list"
import { ContactBlock } from "@/components/site/contact-block"
import { EngagementStart } from "@/components/site/engagement-start"
import { PageIntro } from "@/components/site/page-intro"
import { SiteSection } from "@/components/site/site-section"
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
    path: "/contact",
    meta: content.meta.contact,
    siteName: content.siteName,
  })
}

export default async function ContactPage({ params }: SitePageProps) {
  const { locale, content } = await resolveSitePage(params)
  const { contact } = content

  return (
    <>
      <PageIntro
        locale={locale}
        title={content.cta}
        trail={trailFromHome(content, {
          name: contact.title,
          path: "/contact",
        })}
        breadcrumbLabel={content.nav.breadcrumb}
      />
      <div className="site-container border-t border-border pt-12">
        <ContactBlock contact={contact} />
      </div>
      <SiteSection id="include" title={contact.includeTitle} className="mt-14">
        <BulletList items={contact.include} />
      </SiteSection>
      <SiteSection id="start" title={content.services.startTitle}>
        <EngagementStart services={content.services} />
      </SiteSection>
    </>
  )
}
