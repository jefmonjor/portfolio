import * as React from "react"

import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  index: string
  title: string
  hint?: string
  className?: string
  id?: string
}

function SectionHeading({
  index,
  title,
  hint,
  className,
  id,
}: SectionHeadingProps) {
  return (
    <header
      id={id}
      className={cn(
        "flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6",
        className
      )}
    >
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] tracking-[0.18em] text-brand uppercase">
          {index}
        </span>
        <h2 className="font-heading text-[clamp(1.125rem,0.6vw+1rem,1.375rem)] font-medium tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      {hint ? (
        <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
          {hint}
        </p>
      ) : null}
    </header>
  )
}

export { SectionHeading }
