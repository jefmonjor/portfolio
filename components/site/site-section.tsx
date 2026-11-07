import { cn } from "@/lib/utils"

type SiteSectionProps = {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}

function SiteSection({ id, title, children, className }: SiteSectionProps) {
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
      <h2
        id={headingId}
        className="self-start font-heading text-title-h4 text-text-strong-950 lg:sticky lg:top-24"
      >
        {title}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

export { SiteSection }
