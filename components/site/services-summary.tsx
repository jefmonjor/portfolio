import { ArrowLink } from "@/components/site/arrow-link"
import { ContactButton } from "@/components/site/contact-button"
import { ProcessSteps } from "@/components/site/process-steps"
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
      <ul className="grid gap-5 md:grid-cols-3">
        {services.items.map((service) => (
          <li
            key={service.id}
            className="site-card flex flex-col p-6 md:row-span-3 md:grid md:grid-rows-subgrid md:gap-0 md:p-7"
          >
            <h3 className="font-heading text-title-h4 text-text-strong-950">
              {service.name}
            </h3>
            <p className="mt-3 text-paragraph-md text-text-sub-600">
              {service.summary}
            </p>
            <dl className="flex flex-col gap-4 pt-7">
              {[
                [services.audienceLabel, service.audience],
                [services.deliverableLabel, service.deliverable],
                [services.formatLabel, service.format],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-1 border-t border-stroke-soft-200 pt-4"
                >
                  <dt className="text-label-sm text-text-strong-950">
                    {label}
                  </dt>
                  <dd className="text-paragraph-sm text-text-sub-600">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
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
