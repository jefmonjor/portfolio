import Image from "next/image"

import { RichText } from "@/components/site/rich-text"
import { SiteSection } from "@/components/site/site-section"
import type { SiteContent } from "@/content/site/types"
import type { SiteLocale } from "@/i18n/routing"
import { profile } from "@/lib/profile"
import portrait from "@/public/me.webp"

type AboutSectionProps = {
  locale: SiteLocale
  content: SiteContent
}

function AboutSection({ locale, content }: AboutSectionProps) {
  return (
    <SiteSection id="about" title={content.display.about}>
      <div className="grid gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
        <figure className="about-portrait">
          <Image
            src={portrait}
            alt={profile.name}
            placeholder="blur"
            sizes="(min-width: 48rem) 40vw, 100vw"
            className="h-full w-full object-cover"
          />
        </figure>
        <div className="flex flex-col">
          <p className="max-w-[22ch] font-heading text-title-h3 text-text-strong-950">
            {content.about.lead}
          </p>
          <div className="site-prose mt-8 flex flex-col gap-5 text-text-strong-950">
            {content.about.paragraphs.map((paragraph, index) => (
              <p key={index}>
                <RichText locale={locale} content={paragraph} />
              </p>
            ))}
          </div>
        </div>
      </div>
    </SiteSection>
  )
}

export { AboutSection }
