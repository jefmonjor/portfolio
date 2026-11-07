import {
  Clock01Icon,
  DocumentValidationIcon,
  Layers01Icon,
  SourceCodeIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { ArrowLink } from "@/components/site/arrow-link"
import { ContactButton } from "@/components/site/contact-button"
import type { ServiceId, SiteContent } from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"

const serviceIcons = {
  advisory: DocumentValidationIcon,
  delivery: SourceCodeIcon,
  fractional: Layers01Icon,
} satisfies Record<ServiceId, IconSvgElement>

type ServicesSummaryProps = {
  locale: SiteLocale
  services: SiteContent["services"]
  cta: string
}

function ServicesSummary({ locale, services, cta }: ServicesSummaryProps) {
  return (
    <div className="flex flex-col gap-10">
      <ul className="service-deal grid md:grid-cols-3">
        {services.items.map((service) => (
          <li key={service.id} className="site-card flex flex-col p-6">
            <span
              aria-hidden
              className="flex size-10 items-center justify-center rounded-10 bg-bg-weak-50 text-icon-sub-600 ring-1 ring-stroke-soft-200 ring-inset"
            >
              <HugeiconsIcon
                icon={serviceIcons[service.id]}
                className="size-5"
                strokeWidth={1.5}
              />
            </span>
            <h3 className="mt-5 text-title-h6 text-text-strong-950">
              {service.name}
            </h3>
            <p className="mt-2 text-paragraph-sm text-text-sub-600">
              {service.summary}
            </p>
            <div className="mt-auto pt-6">
              <p className="flex gap-2 border-t border-stroke-soft-200 pt-4 text-paragraph-sm text-text-sub-600">
                <HugeiconsIcon
                  icon={Clock01Icon}
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-icon-sub-600"
                  strokeWidth={1.75}
                />
                {service.format}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
        <ContactButton locale={locale} label={cta} />
        <ArrowLink
          href={localizedPath(locale, "/services")}
          className="self-start sm:self-auto"
        >
          {services.details}
        </ArrowLink>
      </div>
    </div>
  )
}

export { ServicesSummary }
