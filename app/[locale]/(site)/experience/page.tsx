import { ArrowLink } from "@/components/site/arrow-link"
import { ClosingCta } from "@/components/site/closing-cta"
import { ExperienceDetail } from "@/components/site/experience-detail"
import { ExperienceTimeline } from "@/components/site/experience-timeline"
import { PageIntro } from "@/components/site/page-intro"
import { localizedPath } from "@/i18n/routing"
import {
  resolveSitePage,
  siteMetadataFor,
  siteStaticParams,
  type SitePageProps,
} from "@/lib/site-params"

export const generateStaticParams = siteStaticParams

export const generateMetadata = siteMetadataFor("/experience", "experience")

export default async function ExperiencePage({ params }: SitePageProps) {
  const { locale, content } = await resolveSitePage(params)
  const { experience } = content

  return (
    <>
      <PageIntro
        locale={locale}
        content={content}
        title={experience.title}
        intro={experience.intro}
        crumbs={[
          {
            name: experience.title,
            path: "/experience",
          },
        ]}
      />
      <div className="site-container site-column border-t border-stroke-soft-200 pt-12">
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
        <p className="mt-14 flex flex-col gap-2 border-t border-stroke-soft-200 pt-8 text-paragraph-md text-text-sub-600">
          {experience.cvLead}
          <ArrowLink
            href={localizedPath(locale, "/cv")}
            prefetch={false}
            className="self-start"
          >
            {experience.cvLink}
          </ArrowLink>
        </p>
      </div>
      <ClosingCta locale={locale} content={content} />
    </>
  )
}
