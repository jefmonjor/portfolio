import { Badge } from "@/components/ui/badge"
import { techIcon } from "@/lib/tech-icons"
import { cn } from "@/lib/utils"

type TechBadgeProps = {
  label: string
  className?: string
}

function TechBadge({ label, className }: TechBadgeProps) {
  const icon = techIcon(label)

  return (
    <Badge
      variant="outline"
      className={cn("h-auto max-w-full font-mono text-[10px]", className)}
    >
      {icon ? (
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="size-2.5 shrink-0 fill-muted-foreground"
        >
          <path d={icon.path} />
        </svg>
      ) : null}
      {label}
    </Badge>
  )
}

export { TechBadge }
