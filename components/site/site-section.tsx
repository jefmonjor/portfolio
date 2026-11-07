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
      aria-labelledby={headingId}
      className={cn(
        "site-container grid gap-6 border-t border-border py-14 md:py-20 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12",
        className
      )}
    >
      <h2
        id={headingId}
        className="flex items-center gap-3 self-start font-heading text-[clamp(1.5rem,1.1vw+1.15rem,2rem)] leading-tight font-medium tracking-[-0.01em] text-foreground lg:sticky lg:top-24"
      >
        <span aria-hidden className="inline-block size-1.5 shrink-0 bg-brand" />
        {title}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

export { SiteSection }
