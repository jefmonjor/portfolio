import { DisplayTitle } from "@/components/site/display-title"
import type { Headline } from "@/content/site/types"
import { cn } from "@/lib/utils"

type SiteSectionProps = {
  id: string
  title: string | Headline
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
      className={cn("site-container py-20 md:py-28", className)}
    >
      <h2
        id={headingId}
        className="max-w-[18ch] font-heading text-title-h2 text-text-strong-950"
      >
        <DisplayTitle title={title} />
      </h2>
      <div className="mt-10 min-w-0 md:mt-14">{children}</div>
    </section>
  )
}

export { SiteSection }
