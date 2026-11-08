import { ClosingCta } from "@/components/site/closing-cta"
import { EngagementStart } from "@/components/site/engagement-start"
import { PageIntro } from "@/components/site/page-intro"
import { ServiceDetails } from "@/components/site/service-details"
import { SiteSection } from "@/components/site/site-section"
import {
  resolveSitePage,
  siteMetadataFor,
  siteStaticParams,
  type SitePageProps,
} from "@/lib/site-params"

export const generateStaticParams = siteStaticParams

export const generateMetadata = siteMetadataFor("/services", "services")

export default async function ServicesPage({ params }: SitePageProps) {
  const { locale, content } = await resolveSitePage(params)
  const { services } = content

  return (
    <>
      <PageIntro
        locale={locale}
        content={content}
        title={services.title}
        intro={services.intro}
        crumbs={[
          {
            name: services.title,
            path: "/services",
          },
        ]}
      />

      {services.items.map((service) => (
        <SiteSection key={service.id} id={service.id} title={service.name}>
          <ServiceDetails service={service} labels={services} />
        </SiteSection>
      ))}

      <SiteSection id="start" title={services.startTitle}>
        <EngagementStart services={services} />
      </SiteSection>

      <ClosingCta locale={locale} content={content} />
    </>
  )
}
