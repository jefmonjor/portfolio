import { Badge } from "@/components/ui/badge"
import { techIcon } from "@/lib/tech-icons"
import { cn } from "@/lib/utils"

type TechBadgeProps = {
  label: string
  className?: string
}

// Generic code glyph for tools with no brand icon (trademark removals in
// simple-icons, concepts like "Microservices") so every badge reads the same.
const FALLBACK_PATH =
  "M8.7 15.9 4.8 12l3.9-3.9-1.4-1.4L2 12l5.3 5.3 1.4-1.4zm6.6 0 3.9-3.9-3.9-3.9 1.4-1.4L22 12l-5.3 5.3-1.4-1.4z"

function TechBadge({ label, className }: TechBadgeProps) {
  const icon = techIcon(label)

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
          !icon && "opacity-60"
        )}
      >
        <path d={icon?.path ?? FALLBACK_PATH} />
      </svg>
      {label}
    </Badge>
  )
}

export { TechBadge }
