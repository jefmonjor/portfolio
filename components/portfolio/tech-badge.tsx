import { Badge } from "@/components/ui/badge"
import {
  TECH_ICON_FALLBACK_ID,
  techIconId,
  techIconSymbolId,
} from "@/lib/tech-icons"
import { cn } from "@/lib/utils"

type TechBadgeProps = {
  label: string
  className?: string
}

function TechBadge({ label, className }: TechBadgeProps) {
  const id = techIconId(label)

  return (
    <Badge
      variant="outline"
      className={cn("h-auto max-w-full py-1 text-xs font-normal", className)}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className={cn(
          "size-2.5 shrink-0 fill-muted-foreground",
          !id && "opacity-60"
        )}
      >
        <use href={`#${id ? techIconSymbolId(id) : TECH_ICON_FALLBACK_ID}`} />
      </svg>
      {label}
    </Badge>
  )
}

export { TechBadge }
