import { ArrowLink } from "@/components/site/arrow-link"
import { SiteSection } from "@/components/site/site-section"
import type { SiteContent } from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"

type CapabilitiesSectionProps = {
  locale: SiteLocale
  content: SiteContent
}

/** Three kinds of work, each backed by the case study that proves it. */
function CapabilitiesSection({ locale, content }: CapabilitiesSectionProps) {
  const { capabilities } = content

  return (
    <SiteSection
      id="capabilities"
      title={content.display.capabilities}
      intro={capabilities.intro}
    >
      <ul className="grid gap-5 md:grid-cols-3">
        {capabilities.items.map((item) => (
          <li key={item.title} className="site-card flex flex-col p-6 md:p-7">
            <h3 className="font-heading text-title-h4 text-text-strong-950">
              {item.title}
            </h3>
            <p className="mt-3 text-paragraph-md text-text-sub-600">
              {item.body}
            </p>
            <ul className="mt-5 flex flex-col">
              {item.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 border-t border-stroke-soft-200 py-3 text-paragraph-sm text-text-strong-950"
                >
                  <span
                    aria-hidden
                    className="mt-[0.5625rem] inline-block size-1.5 shrink-0 rounded-full bg-primary-base"
                  />
                  {point}
                </li>
              ))}
            </ul>
            <ArrowLink
              href={localizedPath(locale, `/work/${item.caseSlug}`)}
              className="mt-auto self-start pt-3"
            >
              {capabilities.caseLabel}: {item.caseName}
            </ArrowLink>
          </li>
        ))}
      </ul>
    </SiteSection>
  )
}

export { CapabilitiesSection }
