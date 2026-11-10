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

const comparisonColumns =
  "lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))] lg:gap-x-10"

/** The three services side by side, compared on the same three questions. */
function ServicesSummary({ locale, services, cta }: ServicesSummaryProps) {
  const questions = [
    services.audienceLabel,
    services.deliverableLabel,
    services.formatLabel,
  ] as const

  return (
    <div className="flex flex-col gap-14">
      <p className="max-w-[24ch] font-heading text-title-h3 text-balance text-text-strong-950">
        {services.statement}
      </p>
      <div>
        <div
          aria-hidden
          className={`hidden pb-4 text-label-sm text-text-sub-600 lg:grid ${comparisonColumns}`}
        >
          <span />
          {questions.map((question) => (
            <span key={question}>{question}</span>
          ))}
        </div>
        <ul className="border-b border-stroke-soft-200">
          {services.items.map((service) => (
            <li
              key={service.id}
              className={`grid gap-6 border-t border-stroke-soft-200 py-7 md:py-8 ${comparisonColumns}`}
            >
              <div className="flex flex-col gap-2">
                <h3 className="font-heading text-title-h4 text-text-strong-950">
                  {service.name}
                </h3>
                <p className="text-paragraph-md text-text-sub-600">
                  {service.summary}
                </p>
              </div>
              <dl className="grid gap-5 sm:grid-cols-3 sm:gap-6 lg:col-span-3 lg:grid-cols-subgrid">
                {[service.audience, service.deliverable, service.format].map(
                  (answer, index) => (
                    <div key={questions[index]} className="flex flex-col gap-1">
                      <dt className="text-label-sm text-text-strong-950 lg:sr-only">
                        {questions[index]}
                      </dt>
                      <dd className="text-paragraph-sm text-text-sub-600 lg:text-paragraph-md lg:text-text-strong-950">
                        {answer}
                      </dd>
                    </div>
                  )
                )}
              </dl>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-6">
        <h3 className="font-heading text-title-h4 text-text-strong-950">
          {services.startTitle}
        </h3>
        <ProcessSteps
          steps={services.startSteps}
          deliverableLabel={services.deliverableLabel}
        />
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
