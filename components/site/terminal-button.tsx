"use client"

import { CommandLineIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { openTerminal } from "@/components/site/console-events"
import { useIsHydrated } from "@/hooks/use-is-hydrated"

type TerminalButtonProps = {
  label: string
  /** "bar" sits in the header; "menu" is a full-width row in the phone menu. */
  variant?: "bar" | "menu"
}

function TerminalButton({ label, variant = "bar" }: TerminalButtonProps) {
  const isHydrated = useIsHydrated()
  if (!isHydrated) return null

  if (variant === "menu") {
    return (
      <button
        type="button"
        data-closes-menu
        onClick={openTerminal}
        className="site-button site-button-stroke mt-2 min-h-12 w-full"
      >
        <HugeiconsIcon
          icon={CommandLineIcon}
          aria-hidden
          className="size-[18px] text-icon-sub-600"
          strokeWidth={1.75}
        />
        {label}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={openTerminal}
      aria-label={label}
      title={`${label} (Ctrl K)`}
      className="terminal-trigger site-press"
    >
      <HugeiconsIcon
        icon={CommandLineIcon}
        aria-hidden
        className="size-[18px]"
        strokeWidth={1.5}
      />
      <span aria-hidden className="hidden lg:inline">
        Terminal
      </span>
      <kbd aria-hidden className="hidden lg:inline">
        Ctrl K
      </kbd>
    </button>
  )
}

export { TerminalButton }
