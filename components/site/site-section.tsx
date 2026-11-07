import { cn } from "@/lib/utils"

type SiteSectionProps = {
  id: string
  title: string
  aside?: React.ReactNode
  children: React.ReactNode
  className?: string
}

function SiteSection({
  id,
  title,
  aside,
  children,
  className,
}: SiteSectionProps) {
  const headingId = `${id}-title`

  return (
    <section
      id={id}
      data-reveal
      aria-labelledby={headingId}
      className={cn(
        "site-container grid gap-8 border-t border-stroke-soft-200 py-16 md:py-24 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12",
        className
      )}
    >
      <div className="self-start lg:sticky lg:top-24">
        <h2
          id={headingId}
          className="font-heading text-title-h4 text-text-strong-950"
        >
          {title}
        </h2>
        {aside}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

export { SiteSection }
