import { PageIntro } from "@/components/site/page-intro"
import { RichText } from "@/components/site/rich-text"
import {
  resolveSitePage,
  siteMetadataFor,
  siteStaticParams,
  type SitePageProps,
} from "@/lib/site-params"

export const generateStaticParams = siteStaticParams

export const generateMetadata = siteMetadataFor("/privacy", "privacy")

export default async function PrivacyPage({ params }: SitePageProps) {
  const { locale, content } = await resolveSitePage(params)
  const { privacy } = content

  return (
    <>
      <PageIntro
        locale={locale}
        content={content}
        title={privacy.title}
        intro={privacy.updated}
        crumbs={[
          {
            name: privacy.title,
            path: "/privacy",
          },
        ]}
      />
      <div className="site-container site-column flex flex-col gap-10 border-t border-stroke-soft-200 pt-10">
        {privacy.sections.map((section) => (
          <section key={section.title} className="flex flex-col gap-3">
            <h2 className="text-title-h6 text-text-strong-950">
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph, index) => (
              <p key={index} className="site-prose text-text-strong-950">
                <RichText locale={locale} content={paragraph} />
              </p>
            ))}
          </section>
        ))}
      </div>
    </>
  )
}
