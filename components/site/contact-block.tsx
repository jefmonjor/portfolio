import { EmailActions } from "@/components/site/email-actions"
import type { SiteContent } from "@/content/site/types"
import { publicProfiles } from "@/lib/profile"

function ContactBlock({ contact }: { contact: SiteContent["contact"] }) {
  return (
    <div className="flex flex-col gap-10">
      <p className="site-prose text-text-sub-600">{contact.intro}</p>

      <EmailActions email={contact.email} />

      <dl className="grid gap-3 sm:grid-cols-2">
        {contact.facts.map((fact) => (
          <div
            key={fact.label}
            className="site-card flex flex-col gap-1 rounded-16 px-4 py-3.5"
          >
            <dt className="text-label-sm text-text-sub-600">{fact.label}</dt>
            <dd className="text-paragraph-md text-text-strong-950">
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
  )
}

export { ContactBlock }
