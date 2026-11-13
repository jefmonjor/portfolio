import { AboutSection } from "@/components/site/about-section"
import { ApproachSection } from "@/components/site/approach-section"
import { ArrowLink } from "@/components/site/arrow-link"
import { CapabilitiesSection } from "@/components/site/capabilities-section"
import { CaseShowcase } from "@/components/site/case-showcase"
import { ContactButton } from "@/components/site/contact-button"
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

      <SiteSection id="work" title={content.display.work}>
        <CaseShowcase
          locale={locale}
          cases={content.work.cases}
          featured="private-bank-modernization"
          labels={content.work.labels}
          readLabel={content.selectedWork.readCase}
        />
        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
          <ContactButton
            locale={locale}
            label={content.hero.cta}
            className="min-h-14 px-6"
          />
          <ArrowLink
            href={localizedPath(locale, "/work")}
            className="self-start sm:self-auto"
          >
            {content.selectedWork.allCases}
          </ArrowLink>
        </div>
      </SiteSection>

      <SiteSection id="services" title={content.display.services}>
        <ServicesSummary
          locale={locale}
          services={content.services}
          cta={content.hero.cta}
        />
      </SiteSection>

      <ApproachSection content={content} />

      <HiringNote locale={locale} hiring={content.hiring} />

      <AboutSection locale={locale} content={content} />

      <FinalCta
        title={content.display.contact}
        contact={content.contact}
        briefHref={`${localizedPath(locale, "/contact")}#brief`}
      />
    </>
  )
}
