import type { SiteContent } from "@/content/site/types"

function EngagementStart({ services }: { services: SiteContent["services"] }) {
  return (
    <div className="flex flex-col gap-6">
      <ol className="flex flex-col">
        {services.startSteps.map((step, index) => (
          <li
            key={step}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start border-b border-stroke-soft-200 py-4 first:border-t"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-bg-weak-50 text-label-xs text-text-sub-600 tabular-nums ring-1 ring-stroke-soft-200 ring-inset">
              {index + 1}
            </span>
            <span className="pt-0.5 text-paragraph-md text-text-strong-950">
              {step}
            </span>
          </li>
        ))}
      </ol>
      <p className="site-prose text-text-sub-600">{services.rates}</p>
    </div>
  )
}

export { EngagementStart }
