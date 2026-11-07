import Link from "next/link"

import { ArrowLabel } from "@/components/site/arrow-label"
import type { SiteContent } from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"

type ServicesSummaryProps = {
  locale: SiteLocale
  services: SiteContent["services"]
  cta: string
}

function ServicesSummary({ locale, services, cta }: ServicesSummaryProps) {
  return (
    <div className="flex flex-col gap-8">
      <ul className="grid gap-px border border-border bg-border md:grid-cols-3">
        {services.items.map((service) => (
          <li
            key={service.id}
            className="flex flex-col gap-2 bg-background p-5 md:p-6"
          >
            <h3 className="font-heading text-[1.25rem] leading-snug font-medium tracking-[-0.01em] text-foreground">
              {service.name}
            </h3>
            <p className="text-[1rem] leading-relaxed text-muted-foreground">
              {service.summary}
            </p>
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
        <Link
          href={localizedPath(locale, "/contact")}
          className="site-button w-full sm:w-auto"
        >
          <ArrowLabel>{cta}</ArrowLabel>
        </Link>
        <Link
          href={localizedPath(locale, "/services")}
          className="site-link inline-flex min-h-11 items-center self-start text-[1.0625rem] font-medium sm:self-auto"
        >
          <ArrowLabel>{services.details}</ArrowLabel>
        </Link>
      </div>
    </div>
  )
}

export { ServicesSummary }
