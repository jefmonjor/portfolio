"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import {
  isTerminalShortcut,
  TERMINAL_EVENT,
} from "@/components/portfolio/terminal/events"

const Terminal = dynamic(
  () =>
    import("@/components/portfolio/terminal/terminal").then(
      (mod) => mod.Terminal
    ),
  { ssr: false }
)

// Listens for the first request to open the terminal, then mounts it already
// open. From then on the terminal owns its shortcut and event listeners.
function TerminalHost() {
  const [requested, setRequested] = React.useState(false)

  React.useEffect(() => {
    if (requested) return
    function request() {
      setRequested(true)
    }
    function onKey(event: KeyboardEvent) {
      if (!isTerminalShortcut(event)) return
      event.preventDefault()
      request()
    }
    window.addEventListener(TERMINAL_EVENT, request)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener(TERMINAL_EVENT, request)
      window.removeEventListener("keydown", onKey)
    }
  }, [requested])

  return requested ? <Terminal defaultOpen /> : null
}

export { TerminalHost }
