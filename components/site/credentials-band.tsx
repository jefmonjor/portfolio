import type { SiteContent } from "@/content/site/types"

type CredentialsBandProps = {
  credentials: SiteContent["credentials"]
}

function CredentialsBand({ credentials }: CredentialsBandProps) {
  return (
    <section aria-label={credentials.label} className="site-container">
      <div
        data-reveal
        className="grid gap-10 border-t border-stroke-soft-200 py-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-center md:gap-12"
      >
        <div className="flex flex-col gap-4">
          <p className="text-subheading-xs text-text-sub-600 uppercase">
            {credentials.label}
          </p>
          <ul className="flex flex-wrap items-baseline gap-x-7 gap-y-2">
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
      </div>
    </section>
  )
}

export { CredentialsBand }
