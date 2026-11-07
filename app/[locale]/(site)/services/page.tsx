import { ClosingCta } from "@/components/site/closing-cta"
import { EngagementStart } from "@/components/site/engagement-start"
import { PageIntro } from "@/components/site/page-intro"
import { ServiceDetails } from "@/components/site/service-details"
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
    path: "/services",
    meta: content.meta.services,
    siteName: content.siteName,
  })
}

export default async function ServicesPage({ params }: SitePageProps) {
  const { locale, content } = await resolveSitePage(params)
  const { services } = content

  return (
    <>
      <PageIntro
        locale={locale}
        title={services.title}
        intro={services.intro}
        trail={trailFromHome(content, {
          name: services.title,
          path: "/services",
        })}
        breadcrumbLabel={content.nav.breadcrumb}
      />

      {services.items.map((service) => (
        <SiteSection key={service.id} id={service.id} title={service.name}>
          <ServiceDetails service={service} labels={services} />
        </SiteSection>
      ))}

      <SiteSection id="start" title={services.startTitle}>
        <EngagementStart services={services} />
      </SiteSection>

      <ClosingCta
        locale={locale}
        statement={services.closing}
        cta={content.cta}
      />
    </>
  )
}
