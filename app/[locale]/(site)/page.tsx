import { AboutSection } from "@/components/site/about-section"
import { ApproachSection } from "@/components/site/approach-section"
import { ArrowLink } from "@/components/site/arrow-link"
import { CapabilitiesSection } from "@/components/site/capabilities-section"
import { CaseDeck } from "@/components/site/case-deck"
import { CredentialsBand } from "@/components/site/credentials-band"
import { FinalCta } from "@/components/site/final-cta"
import { Hero } from "@/components/site/hero"
import { HiringNote } from "@/components/site/hiring-note"
import { ServicesSummary } from "@/components/site/services-summary"
import { SiteSection } from "@/components/site/site-section"
import { localizedPath } from "@/i18n/routing"
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
    <>
      <Hero locale={locale} content={content} />

      <CredentialsBand credentials={content.credentials} />

      <CapabilitiesSection locale={locale} content={content} />

      <ApproachSection content={content} />

      <SiteSection id="work" title={content.display.work}>
        <CaseDeck
          locale={locale}
          cases={content.work.cases}
          labels={content.work.labels}
          readLabel={content.selectedWork.readCase}
        />
        <ArrowLink href={localizedPath(locale, "/work")} className="mt-8">
          {content.selectedWork.allCases}
        </ArrowLink>
      </SiteSection>

      <SiteSection id="services" title={content.display.services}>
        <ServicesSummary
          locale={locale}
          services={content.services}
          cta={content.cta}
        />
      </SiteSection>

      <AboutSection locale={locale} content={content} />

      <HiringNote locale={locale} hiring={content.hiring} />

      <FinalCta
        title={content.display.contact}
        contact={content.contact}
        briefHref={`${localizedPath(locale, "/contact")}#brief`}
      />
    </>
  )
}
