import { ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

function ArrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="group/arrow inline-flex items-center gap-1.5">
      {children}
      <HugeiconsIcon
        icon={ArrowRight02Icon}
        aria-hidden
        className="size-4 translate-y-px transition-transform duration-200 ease-[var(--ease-out-expo)] group-hover/arrow:translate-x-1 group-focus-visible/arrow:translate-x-1"
        strokeWidth={1.75}
      />
    </span>
  )
}

export { ArrowLabel }
