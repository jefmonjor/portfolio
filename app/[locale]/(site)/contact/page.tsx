import { BulletList } from "@/components/site/bullet-list"
import { ContactBlock } from "@/components/site/contact-block"
import { EngagementStart } from "@/components/site/engagement-start"
import { PageIntro } from "@/components/site/page-intro"
import { SiteSection } from "@/components/site/site-section"
import {
  resolveSitePage,
  siteMetadataFor,
  siteStaticParams,
  type SitePageProps,
} from "@/lib/site-params"

export const generateStaticParams = siteStaticParams

export const generateMetadata = siteMetadataFor("/contact", "contact")

export default async function ContactPage({ params }: SitePageProps) {
  const { locale, content } = await resolveSitePage(params)
  const { contact } = content

  return (
    <>
      <PageIntro
        locale={locale}
        content={content}
        title={content.cta}
        crumbs={[
          {
            name: contact.title,
            path: "/contact",
          },
        ]}
      />
      <div className="site-container border-t border-stroke-soft-200 pt-12">
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
