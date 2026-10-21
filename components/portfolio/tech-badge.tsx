import { Badge } from "@/components/ui/badge"
import { techIconId } from "@/lib/tech-icons"
import { cn } from "@/lib/utils"

type TechBadgeProps = {
  label: string
  className?: string
}

// Mirrors techIconSymbolId() in tech-icon-sprite.tsx, which stays server-only
// because it imports every path; this file is rendered by client components.
const FALLBACK_SYMBOL = "#ti-fallback"

function TechBadge({ label, className }: TechBadgeProps) {
  const id = techIconId(label)

  return (
    <Badge
      variant="outline"
      className={cn("h-auto max-w-full font-mono text-[10px]", className)}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className={cn(
          "size-2.5 shrink-0 fill-muted-foreground",
          !id && "opacity-60"
        )}
      >
        <use href={id ? `#ti-${id}` : FALLBACK_SYMBOL} />
      </svg>
      {label}
    </Badge>
  )
}

export { TechBadge }
