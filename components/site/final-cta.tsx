import Link from "next/link"

import { ArrowLabel } from "@/components/site/arrow-label"
import { DisplayTitle } from "@/components/site/display-title"
import { EmailActions } from "@/components/site/email-actions"
import type { Headline, SiteContent } from "@/content/site/types"
import { publicProfiles } from "@/lib/profile"

type FinalCtaProps = {
  title: Headline
  contact: SiteContent["contact"]
  briefHref: string
}

function FinalCta({ title, contact, briefHref }: FinalCtaProps) {
  return (
    <section
      id="contact"
      data-reveal
      aria-labelledby="contact-title"
      className="px-2 py-12 md:px-4 md:py-16"
    >
      <div className="surface-brand brand-panel">
        <div className="site-container relative grid gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="flex flex-col items-start gap-6">
            <h2
              id="contact-title"
              className="max-w-[14ch] font-heading text-title-h2 text-text-strong-950"
            >
              <DisplayTitle title={title} />
            </h2>
            <p className="site-prose text-text-sub-600">{contact.intro}</p>
            <Link
              href={briefHref}
              className="group/arrow site-button mt-2 min-h-14 w-full px-6 sm:w-auto"
            >
              <ArrowLabel>{contact.brief.title}</ArrowLabel>
            </Link>
          </div>
          <div className="flex flex-col gap-8">
            <EmailActions email={contact.email} secondary />
            <dl className="grid gap-x-6 gap-y-4 border-t border-stroke-soft-200 pt-6 sm:grid-cols-2">
              {contact.facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-0.5">
                  <dt className="text-label-sm text-text-sub-600">
                    {fact.label}
                  </dt>
                  <dd className="text-paragraph-sm text-text-strong-950">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="flex flex-wrap items-center gap-x-5 text-paragraph-md text-text-sub-600">
              {contact.elsewhere}
              {publicProfiles.map((channel) => (
                <a
                  key={channel.href}
                  href={channel.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="site-link inline-flex min-h-11 items-center"
                >
                  {channel.name}
                </a>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export { FinalCta }
