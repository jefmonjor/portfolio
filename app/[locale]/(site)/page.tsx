import { ArrowLink } from "@/components/site/arrow-link"
import { CaseDeck } from "@/components/site/case-deck"
import { ConnectSection } from "@/components/site/connect-section"
import { CredentialsBand } from "@/components/site/credentials-band"
import { DeckCounter } from "@/components/site/deck-counter"
import { ExperienceTimeline } from "@/components/site/experience-timeline"
import { FinalCta } from "@/components/site/final-cta"
import { Hero } from "@/components/site/hero"
import { RichText } from "@/components/site/rich-text"
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

      <ConnectSection connect={content.connect} />

      <SiteSection
        id="work"
        title={content.selectedWork.title}
        aside={<DeckCounter total={content.work.cases.length} />}
        className="case-deck-scope"
      >
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

      <SiteSection id="services" title={content.services.homeTitle}>
        <ServicesSummary
          locale={locale}
          services={content.services}
          cta={content.cta}
        />
      </SiteSection>

      <SiteSection id="about" title={content.about.title}>
        <p className="scroll-fill-block max-w-[24ch] font-heading text-title-h3 text-text-strong-950">
          <span className="scroll-fill">{content.about.lead}</span>
        </p>
        <div className="site-prose mt-8 flex flex-col gap-5 text-text-strong-950">
          {content.about.paragraphs.map((paragraph, index) => (
            <p key={index}>
              <RichText locale={locale} content={paragraph} />
            </p>
          ))}
        </div>
      </SiteSection>

      <SiteSection id="experience" title={content.experience.title}>
        <ExperienceTimeline groups={content.experience.groups} />
        <ArrowLink href={localizedPath(locale, "/experience")} className="mt-8">
          {content.experience.fullHistory}
        </ArrowLink>
      </SiteSection>

      <FinalCta
        contact={content.contact}
        availability={content.hero.availability.status}
        briefHref={`${localizedPath(locale, "/contact")}#brief`}
      />
    </>
  )
}
