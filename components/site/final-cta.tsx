import { EmailActions } from "@/components/site/email-actions"
import { StatusBadge } from "@/components/site/status-badge"
import type { SiteContent } from "@/content/site/types"
import { publicProfiles } from "@/lib/profile"

type FinalCtaProps = {
  contact: SiteContent["contact"]
  availability: string
}

function FinalCta({ contact, availability }: FinalCtaProps) {
  return (
    <section
      id="contact"
      data-reveal
      aria-labelledby="contact-title"
      className="site-container py-16 md:py-24"
    >
      <div className="surface-dark dark-panel grid gap-12 px-6 py-12 md:px-12 md:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="flex flex-col items-start gap-6">
          <StatusBadge>{availability}</StatusBadge>
          <h2
            id="contact-title"
            className="font-heading text-title-h2 text-text-strong-950"
          >
            {contact.homeTitle}
          </h2>
          <p className="site-prose text-text-sub-600">{contact.intro}</p>
        </div>
        <div className="flex flex-col gap-8">
          <EmailActions email={contact.email} />
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
    </section>
  )
}

export { FinalCta }
