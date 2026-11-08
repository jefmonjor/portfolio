"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"

import type { AssistantFailure, SiteConsoleCopy } from "@/content/site/types"
import { useThemeToggle } from "@/hooks/use-theme-toggle"
import type { SiteLocale } from "@/i18n/routing"
import { siteContactEmail, siteContactMailto } from "@/lib/email"
import { askSiteAssistant } from "@/lib/site-assistant/client"
import {
  completeTerminalInput,
  runTerminalCommand,
  type TerminalData,
  type TerminalEffect,
  type TerminalLine,
} from "@/lib/site-terminal"

type SiteTerminalProps = {
  open: boolean
  onClose: () => void
  locale: SiteLocale
  copy: SiteConsoleCopy["terminal"]
  errors: Record<AssistantFailure, string>
  emailSubject: string
  data: TerminalData
}

const quickCommands = ["help", "projects", "work", "contact", "brief"] as const

const andorraTime = (locale: SiteLocale) => () =>
  new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Andorra",
  }).format(new Date())

function SiteTerminal({
  open,
  onClose,
  locale,
  copy,
  errors,
  emailSubject,
  data,
}: SiteTerminalProps) {
  const router = useRouter()
  const { setTheme } = useTheme()
  const toggleTheme = useThemeToggle()
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const screen = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<TerminalLine[]>([
    { kind: "head", text: copy.banner[0] },
    { kind: "muted", text: copy.banner[1] },
  ])
  const [draft, setDraft] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [recall, setRecall] = useState(0)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (open && !element.open) {
      element.showModal()
      input.current?.focus()
    } else if (!open && element.open) {
      element.close()
    }
  }, [open])

  useEffect(() => {
    screen.current?.scrollTo({ top: screen.current.scrollHeight })
  }, [lines])

  const print = (next: ReadonlyArray<TerminalLine>) =>
    setLines((current) => [...current, ...next])

  async function ask(question: string) {
    setBusy(true)
    print([{ kind: "muted", text: copy.thinking }])
    const result = await askSiteAssistant(
      [{ role: "user", content: question }],
      locale
    )
    setBusy(false)
    print([
      result.ok
        ? { kind: "out", text: result.reply }
        : { kind: "err", text: errors[result.error] },
    ])
  }

  function apply(effect: TerminalEffect) {
    switch (effect.type) {
      case "navigate":
        onClose()
        router.push(effect.href)
        return
      case "open":
        window.open(effect.href, "_blank", "noopener,noreferrer")
        return
      case "mail":
        window.location.assign(siteContactMailto(emailSubject))
        return
      case "theme":
        if (effect.value) setTheme(effect.value)
        else toggleTheme()
        return
      case "scroll": {
        const target = document.getElementById(effect.id)
        onClose()
        if (target) target.scrollIntoView({ behavior: "smooth" })
        else router.push(effect.fallback)
        return
      }
      case "ask":
        void ask(effect.question)
        return
      case "clear":
        setLines([])
        return
      case "close":
        onClose()
    }
  }

  function execute(entry: string) {
    setDraft("")
    setRecall(0)
    print([{ kind: "in", text: entry }])
    if (!entry || busy) return
    setHistory((current) => [...current, entry])
    const result = runTerminalCommand(
      entry,
      data,
      copy,
      siteContactEmail(),
      andorraTime(locale)
    )
    print(result.lines)
    if (result.effect) apply(result.effect)
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    execute(draft.trim())
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Tab") {
      event.preventDefault()
      const completed = completeTerminalInput(draft, data)
      if (completed) setDraft(completed)
      return
    }
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return
    event.preventDefault()
    const next =
      event.key === "ArrowUp"
        ? Math.min(recall + 1, history.length)
        : Math.max(recall - 1, 0)
    setRecall(next)
    setDraft(next === 0 ? "" : (history[history.length - next] ?? ""))
  }

  function render(line: TerminalLine) {
    switch (line.kind) {
      case "in":
        return (
          <>
            <span className="site-terminal-prompt">{copy.prompt} </span>
            {line.text}
          </>
        )
      case "mail":
        return <a href={siteContactMailto(emailSubject)}>{line.text}</a>
      case "link":
        return line.external ? (
          <a href={line.href} target="_blank" rel="noopener noreferrer">
            {line.text} ↗
          </a>
        ) : (
          <Link href={line.href} onClick={onClose}>
            {line.text}
          </Link>
        )
      default:
        return line.text
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby="site-terminal-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) onClose()
      }}
      className="site-terminal surface-dark"
    >
      <div className="site-terminal-bar">
        <span aria-hidden className="site-terminal-dots" />
        <h2 id="site-terminal-title" className="text-label-sm">
          {copy.title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="site-terminal-close"
          aria-label={copy.close}
        >
          esc
        </button>
      </div>
      <div
        ref={screen}
        className="site-terminal-screen"
        role="log"
        aria-live="polite"
        onClick={() => input.current?.focus()}
      >
        {lines.map((line, index) => (
          <p key={index} className={`site-terminal-line is-${line.kind}`}>
            {render(line)}
          </p>
        ))}
      </div>
      <div className="site-terminal-quick">
        {quickCommands.map((command) => (
          <button
            key={command}
            type="button"
            onClick={() => execute(command)}
            disabled={busy}
          >
            {command}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="site-terminal-input">
        <label htmlFor="site-terminal-command" className="site-terminal-prompt">
          {copy.prompt}
        </label>
        <input
          ref={input}
          id="site-terminal-command"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="send"
          aria-busy={busy}
        />
      </form>
    </dialog>
  )
}

export default SiteTerminal
