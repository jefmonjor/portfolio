import { ProcessSteps } from "@/components/site/process-steps"
import type { SiteContent } from "@/content/site/types"

function EngagementStart({ services }: { services: SiteContent["services"] }) {
  return (
    <div className="flex flex-col gap-8">
      <ProcessSteps steps={services.startSteps} />
      <p className="site-prose text-text-sub-600">{services.rates}</p>
    </div>
  )
}

export { EngagementStart }
