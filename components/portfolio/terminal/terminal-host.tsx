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

function TerminalHost() {
  const [firstOpenRequested, setFirstOpenRequested] = React.useState(false)

  React.useEffect(() => {
    if (firstOpenRequested) return
    function request() {
      setFirstOpenRequested(true)
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
  }, [firstOpenRequested])

  return firstOpenRequested ? <Terminal defaultOpen /> : null
}

export { TerminalHost }
