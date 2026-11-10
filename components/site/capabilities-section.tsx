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
      <ul className="border-b border-stroke-soft-200">
        {capabilities.items.map((item) => (
          <li
            key={item.title}
            className="grid gap-x-12 gap-y-4 border-t border-stroke-soft-200 py-8 md:py-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
          >
            <h3 className="max-w-[14ch] font-heading text-title-h3 text-balance text-text-strong-950">
              {item.title}
            </h3>
            <div className="flex flex-col gap-5">
              <p className="max-w-[46ch] text-paragraph-lg text-text-sub-600">
                {item.body}
              </p>
              <ul className="flex flex-col gap-2.5">
                {item.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-paragraph-md text-text-strong-950"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.625rem] inline-block size-1.5 shrink-0 rounded-full bg-primary-base"
                    />
                    {point}
                  </li>
                ))}
              </ul>
              <ArrowLink
                href={localizedPath(locale, `/work/${item.caseSlug}`)}
                className="self-start"
              >
                {capabilities.caseLabel}: {item.caseName}
              </ArrowLink>
            </div>
          </li>
        ))}
      </ul>
    </SiteSection>
  )
}

export { CapabilitiesSection }
