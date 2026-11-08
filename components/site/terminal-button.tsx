"use client"

import { CommandLineIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { openTerminal } from "@/components/site/console-events"
import { useIsHydrated } from "@/hooks/use-is-hydrated"

function TerminalButton({ label }: { label: string }) {
  const isHydrated = useIsHydrated()
  if (!isHydrated) return null

  return (
    <button
      type="button"
      onClick={openTerminal}
      aria-label={label}
      title={label}
      className="site-press inline-flex size-11 items-center justify-center rounded-10 text-icon-sub-600 transition-colors hover:bg-bg-weak-50 hover:text-icon-strong-950 md:size-9"
    >
      <HugeiconsIcon
        icon={CommandLineIcon}
        aria-hidden
        className="size-[18px]"
        strokeWidth={1.5}
      />
    </button>
  )
}

export { TerminalButton }
