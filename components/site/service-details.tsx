import { BulletList } from "@/components/site/bullet-list"
import type { Service, SiteContent } from "@/content/site/types"

type ServiceDetailsProps = {
  service: Service
  labels: Pick<
    SiteContent["services"],
    "audienceLabel" | "includesLabel" | "formatLabel"
  >
}

function DetailRow({
  term,
  children,
}: {
  term: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-2 border-t border-stroke-soft-200 pt-4 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-8">
      <dt className="text-label-sm text-text-sub-600">{term}</dt>
      <dd className="text-paragraph-md text-text-strong-950">{children}</dd>
    </div>
  )
}

function ServiceDetails({ service, labels }: ServiceDetailsProps) {
  return (
    <>
      <p className="site-prose text-text-strong-950">{service.summary}</p>
      <dl className="mt-8 flex flex-col gap-6">
        <DetailRow term={labels.audienceLabel}>{service.audience}</DetailRow>
        <DetailRow term={labels.includesLabel}>
          <BulletList items={service.includes} />
        </DetailRow>
        <DetailRow term={labels.formatLabel}>{service.format}</DetailRow>
      </dl>
    </>
  )
}

export { ServiceDetails }
