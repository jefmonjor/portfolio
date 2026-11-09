"use client"

import { SparklesIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

import { OPEN_TERMINAL_EVENT } from "@/components/site/console-events"
import type { SiteConsoleCopy } from "@/content/site/types"
import { useIsHydrated } from "@/hooks/use-is-hydrated"
import type { SiteLocale } from "@/i18n/routing"
import type { TerminalData } from "@/lib/site-terminal"

const SiteTerminal = dynamic(() => import("@/components/site/site-terminal"), {
  ssr: false,
})
const SiteAssistantPanel = dynamic(
  () => import("@/components/site/site-assistant-panel"),
  { ssr: false }
)

type SiteConsoleProps = {
  locale: SiteLocale
  copy: SiteConsoleCopy
  emailSubject: string
  terminal: TerminalData
}

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))

/** The floating AI assistant and the terminal; both load on first use. */
function SiteConsole({
  locale,
  copy,
  emailSubject,
  terminal,
}: SiteConsoleProps) {
  const isHydrated = useIsHydrated()
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [terminalUsed, setTerminalUsed] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [assistantUsed, setAssistantUsed] = useState(false)

  useEffect(() => {
    const open = () => {
      setTerminalUsed(true)
      setTerminalOpen(true)
    }
    const onKey = (event: KeyboardEvent) => {
      const shortcut =
        (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) ||
        (event.key === "`" && !isTyping(event.target))
      if (!shortcut) return
      event.preventDefault()
      open()
    }
    window.addEventListener(OPEN_TERMINAL_EVENT, open)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener(OPEN_TERMINAL_EVENT, open)
      window.removeEventListener("keydown", onKey)
    }
  }, [])

  if (!isHydrated) return null

  return (
    <>
      {assistantOpen ? null : (
        <button
          type="button"
          onClick={() => {
            setAssistantUsed(true)
            setAssistantOpen(true)
          }}
          aria-controls="site-assistant"
          aria-expanded={false}
          className="assistant-launcher site-button site-button-stroke"
        >
          <HugeiconsIcon
            icon={SparklesIcon}
            aria-hidden
            className="size-[18px]"
            strokeWidth={1.75}
          />
          <span>{copy.assistant.open}</span>
        </button>
      )}
      {assistantUsed ? (
        <SiteAssistantPanel
          open={assistantOpen}
          onClose={() => setAssistantOpen(false)}
          locale={locale}
          copy={copy.assistant}
          emailSubject={emailSubject}
          briefHref={terminal.briefHref}
        />
      ) : null}
      {terminalUsed ? (
        <SiteTerminal
          open={terminalOpen}
          onClose={() => setTerminalOpen(false)}
          locale={locale}
          copy={copy.terminal}
          errors={copy.assistant.errors}
          emailSubject={emailSubject}
          data={terminal}
        />
      ) : null}
    </>
  )
}

export { SiteConsole }
