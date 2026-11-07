import * as React from "react"

import { cn } from "@/lib/utils"

type SectionHeadingProps = {
  title: string
  hint?: string
  className?: string
  id?: string
}

const BRAND_SQUARE_HANGS_IN_GUTTER_FROM_SM = "sm:-ml-[1.125rem]"

function SectionHeading({ title, hint, className, id }: SectionHeadingProps) {
  return (
    <header
      id={id}
      className={cn(
        "flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6",
        className
      )}
    >
      <h2
        className={`flex items-center gap-3 font-heading text-[clamp(1.5rem,1.1vw+1.15rem,2rem)] leading-tight font-medium tracking-[-0.01em] text-foreground ${BRAND_SQUARE_HANGS_IN_GUTTER_FROM_SM}`}
      >
        <span aria-hidden className="inline-block size-1.5 shrink-0 bg-brand" />
        {title}
      </h2>
      {hint ? (
        <p className="text-sm text-muted-foreground sm:text-right">{hint}</p>
      ) : null}
    </header>
  )
}

export { SectionHeading }
