import { AboutSection } from "@/components/site/about-section"
import { ArrowLink } from "@/components/site/arrow-link"
import { CaseDeck } from "@/components/site/case-deck"
import { ConnectSection } from "@/components/site/connect-section"
import { CredentialsBand } from "@/components/site/credentials-band"
import { ExperienceTimeline } from "@/components/site/experience-timeline"
import { FinalCta } from "@/components/site/final-cta"
import { Hero } from "@/components/site/hero"
import { ServicesSummary } from "@/components/site/services-summary"
import { SiteSection } from "@/components/site/site-section"
import { StatementBand } from "@/components/site/statement-band"
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

      <ConnectSection
        title={content.display.connect}
        connect={content.connect}
      />

      <SiteSection id="work" title={content.display.work}>
        <CaseDeck
          locale={locale}
          cases={content.work.cases}
          labels={content.work.labels}
          readLabel={content.selectedWork.readCase}
          stacked
        />
        <ArrowLink href={localizedPath(locale, "/work")} className="mt-8">
          {content.selectedWork.allCases}
        </ArrowLink>
      </SiteSection>

      <StatementBand display={content.display} />

      <SiteSection id="services" title={content.display.services}>
        <ServicesSummary
          locale={locale}
          services={content.services}
          cta={content.cta}
        />
      </SiteSection>

      <AboutSection locale={locale} content={content} />

      <SiteSection id="experience" title={content.display.experience}>
        <ExperienceTimeline groups={content.experience.groups} />
        <ArrowLink href={localizedPath(locale, "/experience")} className="mt-8">
          {content.experience.fullHistory}
        </ArrowLink>
      </SiteSection>

      <FinalCta
        title={content.display.contact}
        contact={content.contact}
        briefHref={`${localizedPath(locale, "/contact")}#brief`}
      />
    </>
  )
}
