import { RichText } from "@/components/site/rich-text"
import { SiteSection } from "@/components/site/site-section"
import type { SiteContent } from "@/content/site/types"
import type { SiteLocale } from "@/i18n/routing"

type AboutSectionProps = {
  locale: SiteLocale
  content: SiteContent
}

function AboutSection({ locale, content }: AboutSectionProps) {
  const { about } = content

  return (
    <SiteSection id="about" title={content.display.about}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <p className="max-w-[24ch] font-heading text-title-h3 text-text-strong-950">
            {about.lead}
          </p>
          <div className="site-prose mt-8 flex flex-col gap-5 text-text-strong-950">
            {about.paragraphs.map((paragraph, index) => (
              <p key={index}>
                <RichText locale={locale} content={paragraph} />
              </p>
            ))}
            <p>{about.principle}</p>
          </div>
          <p className="about-signature mt-8 font-heading text-text-strong-950">
            {about.signature}
          </p>
        </div>
        <dl className="flex flex-col self-start lg:mt-2">
          {about.facts.map((fact) => (
            <div
              key={fact.label}
              className="flex flex-col gap-1 border-t border-stroke-soft-200 py-5"
            >
              <dt className="text-label-sm text-text-sub-600">{fact.label}</dt>
              <dd className="text-paragraph-lg text-text-strong-950">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </SiteSection>
  )
}

export { AboutSection }
