import type { SiteContent } from "@/content/site/types"

function EngagementStart({ services }: { services: SiteContent["services"] }) {
  return (
    <div className="flex flex-col gap-6">
      <ol className="flex flex-col">
        {services.startSteps.map((step, index) => (
          <li
            key={step}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-baseline border-b border-border py-4 first:border-t"
          >
            <span className="font-heading text-[1.25rem] text-brand tabular-nums">
              {index + 1}
            </span>
            <span className="text-[1.0625rem] leading-relaxed text-foreground">
              {step}
            </span>
          </li>
        ))}
      </ol>
      <p className="site-prose text-muted-foreground">{services.rates}</p>
    </div>
  )
}

export { EngagementStart }
