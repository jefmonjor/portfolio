import Link from "next/link"

import { ArrowLabel } from "@/components/site/arrow-label"
import { ClosingCta } from "@/components/site/closing-cta"
import { ExperienceDetail } from "@/components/site/experience-detail"
import { ExperienceTimeline } from "@/components/site/experience-timeline"
import { PageIntro } from "@/components/site/page-intro"
import { localizedPath } from "@/i18n/routing"
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
    path: "/experience",
    meta: content.meta.experience,
    siteName: content.siteName,
  })
}

export default async function ExperiencePage({ params }: SitePageProps) {
  const { locale, content } = await resolveSitePage(params)
  const { experience } = content

  return (
    <>
      <PageIntro
        locale={locale}
        title={experience.title}
        intro={experience.intro}
        trail={trailFromHome(content, {
          name: experience.title,
          path: "/experience",
        })}
        breadcrumbLabel={content.nav.breadcrumb}
      />
      <div className="site-container max-w-[52rem] border-t border-border pt-12 lg:ml-[max(0px,calc((100vw-72rem)/2))]">
        <ExperienceTimeline
          groups={experience.groups}
          renderDetail={(group) => (
            <ExperienceDetail
              locale={locale}
              group={group}
              presentLabel={experience.present}
            />
          )}
        />
        <p className="mt-14 flex flex-col gap-2 border-t border-border pt-8 text-[1.0625rem] text-muted-foreground">
          {experience.cvLead}
          <Link
            href={localizedPath(locale, "/cv")}
            className="site-link inline-flex min-h-11 items-center self-start font-medium"
          >
            <ArrowLabel>{experience.cvLink}</ArrowLabel>
          </Link>
        </p>
      </div>
      <ClosingCta
        locale={locale}
        statement={content.services.closing}
        cta={content.cta}
      />
    </>
  )
}
