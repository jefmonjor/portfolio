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
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-20">
        <p className="max-w-[24ch] font-heading text-title-h3 text-text-strong-950">
          {about.lead}
        </p>
        <div>
          <div className="site-prose flex flex-col gap-5 text-text-strong-950">
            {about.paragraphs.map((paragraph, index) => (
              <p key={index}>
                <RichText locale={locale} content={paragraph} />
              </p>
            ))}
            <p>{about.principle}</p>
          </div>
          <p className="mt-6 border-t border-stroke-soft-200 pt-4 text-paragraph-md text-text-sub-600">
            {about.facts.map((fact) => fact.value).join(" · ")}
          </p>
          <p className="about-signature mt-6 font-heading text-text-strong-950">
            {about.signature}
          </p>
        </div>
      </div>
    </SiteSection>
  )
}

export { AboutSection }
