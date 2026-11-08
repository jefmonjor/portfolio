import { Clock01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"

import { ArrowLink } from "@/components/site/arrow-link"
import { ContactButton } from "@/components/site/contact-button"
import { PointerTilt } from "@/components/site/pointer-tilt"
import { ProcessSteps } from "@/components/site/process-steps"
import { sitePhotos } from "@/content/site/photos"
import type { SiteContent } from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"

type ServicesSummaryProps = {
  locale: SiteLocale
  services: SiteContent["services"]
  cta: string
}

function ServicesSummary({ locale, services, cta }: ServicesSummaryProps) {
  return (
    <div className="flex flex-col gap-14">
      <ul className="service-deal grid md:grid-cols-3">
        {services.items.map((service) => (
          <li key={service.id}>
            <PointerTilt className="service-flip tilt-card" maxDegrees={5}>
              <div className="service-face site-card site-card-spotlight relative flex h-full flex-col overflow-hidden">
                <div className="service-photo">
                  <Image
                    src={sitePhotos[service.id].image}
                    alt=""
                    placeholder="blur"
                    sizes="(min-width: 48rem) 33vw, 100vw"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-heading text-title-h4 text-text-strong-950">
                    {service.name}
                  </h3>
                  <p className="mt-3 text-paragraph-md text-text-sub-600">
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
                </div>
              </div>
              <div aria-hidden className="service-back">
                <span className="size-3 bg-primary-base" />
                <span className="font-heading text-title-h3 italic">
                  {service.name}
                </span>
              </div>
            </PointerTilt>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-6">
        <h3 className="font-heading text-title-h4 text-text-strong-950">
          {services.startTitle}
        </h3>
        <ProcessSteps steps={services.startSteps} />
      </div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
        <ContactButton locale={locale} label={cta} className="min-h-14 px-6" />
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
