import Link from "next/link"

import { ArrowLabel } from "@/components/site/arrow-label"
import { CaseCard } from "@/components/site/case-card"
import { ContactBlock } from "@/components/site/contact-block"
import { ExperienceTimeline } from "@/components/site/experience-timeline"
import { Hero } from "@/components/site/hero"
import { RichText } from "@/components/site/rich-text"
import { ServicesSummary } from "@/components/site/services-summary"
import { SiteSection } from "@/components/site/site-section"
import { localizedPath } from "@/i18n/routing"
import { sitePageMetadata } from "@/lib/seo/site-metadata"
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
    path: "/",
    meta: content.meta.home,
    siteName: content.siteName,
  })
}

export default async function HomePage({ params }: SitePageProps) {
  const { locale, content } = await resolveSitePage(params)

  return (
    <>
      <Hero locale={locale} content={content} />

      <SiteSection id="about" title={content.about.title}>
        <div className="site-prose flex flex-col gap-5 text-foreground">
          {content.about.paragraphs.map((paragraph, index) => (
            <p key={index}>
              <RichText locale={locale} content={paragraph} />
            </p>
          ))}
        </div>
      </SiteSection>

      <SiteSection id="work" title={content.selectedWork.title}>
        <div className="flex flex-col">
          {content.work.cases.map((study) => (
            <CaseCard
              key={study.slug}
              locale={locale}
              study={study}
              readLabel={content.selectedWork.readCase}
              stackLabel={content.work.labels.stack}
            />
          ))}
        </div>
        <Link
          href={localizedPath(locale, "/work")}
          className="site-link mt-8 inline-block text-[1.0625rem] font-medium"
        >
          <ArrowLabel>{content.selectedWork.allCases}</ArrowLabel>
        </Link>
      </SiteSection>

      <SiteSection id="services" title={content.services.homeTitle}>
        <ServicesSummary locale={locale} services={content.services} />
      </SiteSection>

      <SiteSection id="experience" title={content.experience.title}>
        <ExperienceTimeline groups={content.experience.groups} />
        <Link
          href={localizedPath(locale, "/experience")}
          className="site-link mt-10 inline-block text-[1.0625rem] font-medium"
        >
          <ArrowLabel>{content.experience.fullHistory}</ArrowLabel>
        </Link>
      </SiteSection>

      <SiteSection id="contact" title={content.contact.homeTitle}>
        <ContactBlock contact={content.contact} />
      </SiteSection>
    </>
  )
}
