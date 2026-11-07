import { EmailActions } from "@/components/site/email-actions"
import type { SiteContent } from "@/content/site/types"
import { publicProfiles } from "@/lib/profile"

function ContactBlock({ contact }: { contact: SiteContent["contact"] }) {
  return (
    <div className="flex flex-col gap-10">
      <p className="site-prose text-muted-foreground">{contact.intro}</p>

      <EmailActions email={contact.email} />

      <dl className="grid gap-x-8 border-t border-border sm:grid-cols-2">
        {contact.facts.map((fact) => (
          <div
            key={fact.label}
            className="flex flex-col gap-0.5 border-b border-border py-3"
          >
            <dt className="text-sm text-muted-foreground">{fact.label}</dt>
            <dd className="text-[1rem] text-foreground">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <p className="flex flex-wrap items-center gap-x-5 text-[1rem] text-muted-foreground">
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
