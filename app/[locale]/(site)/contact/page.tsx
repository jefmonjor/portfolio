import { ContactBlock } from "@/components/site/contact-block"
import { EngagementStart } from "@/components/site/engagement-start"
import { PageIntro } from "@/components/site/page-intro"
import { ProjectBrief } from "@/components/site/project-brief"
import { SiteSection } from "@/components/site/site-section"
import {
  resolveSitePage,
  siteMetadataFor,
  siteStaticParams,
  type SitePageProps,
} from "@/lib/site-params"

export const generateStaticParams = siteStaticParams

export const generateMetadata = siteMetadataFor("/contact", "contact")

export default async function ContactPage({ params }: SitePageProps) {
  const { locale, content } = await resolveSitePage(params)
  const { contact } = content

  return (
    <>
      <PageIntro
        locale={locale}
        content={content}
        title={content.cta}
        crumbs={[
          {
            name: contact.title,
            path: "/contact",
          },
        ]}
      />
      <section
        id="brief"
        aria-labelledby="brief-title"
        className="site-container grid gap-12 border-t border-stroke-soft-200 pt-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-16"
      >
        <div className="site-card p-6 md:p-8">
          <h2
            id="brief-title"
            className="font-heading text-title-h4 text-text-strong-950"
          >
            {contact.brief.title}
          </h2>
          <p className="mt-3 text-paragraph-md text-text-sub-600">
            {contact.brief.intro}
          </p>
          <div className="mt-8">
            <ProjectBrief
              brief={contact.brief}
              withoutJavaScript={contact.email.withoutJavaScript}
            />
          </div>
        </div>
        <ContactBlock contact={contact} />
      </section>
      <SiteSection
        id="start"
        title={content.services.startTitle}
        className="mt-16"
      >
        <EngagementStart services={content.services} />
      </SiteSection>
    </>
  )
}
