import type { SiteContent } from "@/content/site/types"

type CredentialsBandProps = {
  credentials: SiteContent["credentials"]
}

function CredentialsBand({ credentials }: CredentialsBandProps) {
  return (
    <section aria-label={credentials.label} className="site-container">
      <div
        data-reveal
        className="flex flex-col gap-4 border-t border-stroke-soft-200 py-10 lg:flex-row lg:items-baseline lg:gap-12"
      >
        <p className="shrink-0 text-subheading-xs text-text-sub-600 uppercase">
          {credentials.label}
        </p>
        <ul className="flex flex-wrap items-baseline gap-x-8 gap-y-2">
          {credentials.companies.map((company) => (
            <li
              key={company}
              className="font-heading text-title-h3 text-text-strong-950"
            >
              {company}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export { CredentialsBand }
