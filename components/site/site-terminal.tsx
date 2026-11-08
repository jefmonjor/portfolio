"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import {
  terminalCommands,
  type AssistantFailure,
  type SiteConsoleCopy,
  type TerminalCommand,
} from "@/content/site/types"
import type { SiteLocale } from "@/i18n/routing"
import { siteContactEmail, siteContactMailto } from "@/lib/email"
import { askSiteAssistant } from "@/lib/site-assistant/client"
import type { TerminalData } from "@/lib/site-console"

type Line =
  | { kind: "input" | "text" | "muted" | "error"; text: string }
  | { kind: "link"; text: string; href: string }

type SiteTerminalProps = {
  open: boolean
  onClose: () => void
  locale: SiteLocale
  copy: SiteConsoleCopy["terminal"]
  errors: Record<AssistantFailure, string>
  emailSubject: string
  data: TerminalData
}

const isCommand = (value: string): value is TerminalCommand =>
  terminalCommands.some((command) => command === value)

const text = (value: string): Line => ({ kind: "text", text: value })

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
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const screen = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<Line[]>([
    { kind: "muted", text: copy.hint },
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

  const print = (...next: Line[]) =>
    setLines((current) => [...current, ...next])

  const navigate = (href: string) => {
    onClose()
    router.push(href)
  }

  async function ask(question: string) {
    if (!question) {
      print({ kind: "error", text: copy.askUsage })
      return
    }
    setBusy(true)
    print({ kind: "muted", text: copy.thinking })
    const result = await askSiteAssistant(
      [{ role: "user", content: question }],
      locale
    )
    setBusy(false)
    print(
      result.ok
        ? text(result.reply)
        : { kind: "error", text: errors[result.error] }
    )
  }

  function run(command: TerminalCommand, argument: string) {
    switch (command) {
      case "help":
        print(
          ...terminalCommands.map((name) =>
            text(`${name.padEnd(14)}${copy.commands[name]}`)
          )
        )
        return
      case "whoami":
        print(...data.whoami.map(text))
        return
      case "services":
        print(...data.services.map(text))
        return
      case "work":
        print(...data.work.map((link): Line => ({ kind: "link", ...link })))
        return
      case "how":
        print(...data.how.map(text))
        return
      case "availability":
        print(...data.availability.map(text))
        return
      case "contact":
        print(
          {
            kind: "link",
            text: `${copy.labels.email}: ${siteContactEmail()}`,
            href: siteContactMailto(emailSubject),
          },
          ...data.contact.map(text),
          {
            kind: "link",
            text: `${copy.labels.brief}: ${data.briefHref}`,
            href: data.briefHref,
          }
        )
        return
      case "mail":
        print({ kind: "muted", text: copy.opening })
        window.location.href = siteContactMailto(emailSubject)
        return
      case "brief":
        navigate(data.briefHref)
        return
      case "cv":
        navigate(data.cvHref)
        return
      case "lang":
        navigate(data.otherLanguageHref)
        return
      case "clear":
        setLines([])
        return
      case "exit":
        onClose()
        return
      case "ask":
        void ask(argument)
    }
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const entry = draft.trim()
    setDraft("")
    setRecall(0)
    print({ kind: "input", text: entry })
    if (!entry || busy) return
    setHistory((current) => [...current, entry])
    const [name = "", ...rest] = entry.split(/\s+/)
    const command = name.toLowerCase()
    if (isCommand(command)) run(command, rest.join(" "))
    else print({ kind: "error", text: copy.unknown.replace("{command}", name) })
  }

  function browseHistory(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return
    event.preventDefault()
    const next =
      event.key === "ArrowUp"
        ? Math.min(recall + 1, history.length)
        : Math.max(recall - 1, 0)
    setRecall(next)
    setDraft(next === 0 ? "" : (history[history.length - next] ?? ""))
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
      >
        {lines.map((line, index) => (
          <p key={index} className={`site-terminal-line is-${line.kind}`}>
            {line.kind === "input" ? (
              <span className="site-terminal-prompt">{copy.prompt} </span>
            ) : null}
            {line.kind === "link" ? (
              line.href.startsWith("/") ? (
                <Link href={line.href} onClick={onClose}>
                  {line.text}
                </Link>
              ) : (
                <a href={line.href}>{line.text}</a>
              )
            ) : (
              line.text
            )}
          </p>
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
          onKeyDown={browseHistory}
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
