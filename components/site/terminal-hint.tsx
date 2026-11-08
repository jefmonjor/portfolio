"use client"

import { openTerminal } from "@/components/site/console-events"
import { useIsHydrated } from "@/hooks/use-is-hydrated"

function TerminalHint({ label }: { label: string }) {
  const isHydrated = useIsHydrated()
  if (!isHydrated) return null

  return (
    <button type="button" onClick={openTerminal} className="terminal-hint">
      <span aria-hidden>&gt;_</span> {label}
    </button>
  )
}

export { TerminalHint }
