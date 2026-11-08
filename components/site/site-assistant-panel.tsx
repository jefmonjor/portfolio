"use client"

import {
  Alert02Icon,
  ArrowUp02Icon,
  Cancel01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import type { AssistantFailure, SiteConsoleCopy } from "@/content/site/types"
import type { SiteLocale } from "@/i18n/routing"
import { siteContactMailto } from "@/lib/email"
import {
  askSiteAssistant,
  type AssistantTurn,
} from "@/lib/site-assistant/client"

type SiteAssistantPanelProps = {
  open: boolean
  onClose: () => void
  locale: SiteLocale
  copy: SiteConsoleCopy["assistant"]
  emailSubject: string
  briefHref: string
}

function SiteAssistantPanel({
  open,
  onClose,
  locale,
  copy,
  emailSubject,
  briefHref,
}: SiteAssistantPanelProps) {
  const field = useRef<HTMLTextAreaElement>(null)
  const thread = useRef<HTMLDivElement>(null)
  const [turns, setTurns] = useState<AssistantTurn[]>([])
  const [draft, setDraft] = useState("")
  const [pending, setPending] = useState(false)
  const [failure, setFailure] = useState<AssistantFailure | null>(null)

  useEffect(() => {
    if (open) field.current?.focus()
  }, [open])

  useEffect(() => {
    thread.current?.scrollTo({ top: thread.current.scrollHeight })
  }, [turns, pending])

  async function send(question: string) {
    const content = question.trim()
    if (!content || pending) return
    const asked: AssistantTurn[] = [...turns, { role: "user", content }]
    setTurns(asked)
    setDraft("")
    setFailure(null)
    setPending(true)
    const result = await askSiteAssistant(asked, locale)
    setPending(false)
    if (result.ok) {
      setTurns([
        ...asked,
        {
          role: "assistant",
          content: result.reply,
          signature: result.signature,
        },
      ])
      return
    }
    // The next request must alternate turns, so the unanswered question goes
    // back into the field instead of staying in the history.
    setTurns(turns)
    setDraft(content)
    setFailure(result.error)
  }

  return (
    <section
      id="site-assistant"
      role="dialog"
      aria-modal="false"
      aria-labelledby="site-assistant-title"
      hidden={!open}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose()
      }}
      className="site-assistant"
    >
      <header className="site-assistant-header">
        <h2 id="site-assistant-title" className="text-label-md">
          {copy.title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label={copy.close}
          className="site-press inline-flex size-9 items-center justify-center rounded-10 text-icon-sub-600 hover:bg-bg-weak-50"
        >
          <HugeiconsIcon
            icon={Cancel01Icon}
            className="size-4"
            strokeWidth={1.75}
          />
        </button>
      </header>

      <div ref={thread} className="site-assistant-thread" aria-live="polite">
        {turns.length === 0 ? (
          <>
            <p className="text-paragraph-sm text-text-sub-600">{copy.intro}</p>
            <ul className="mt-4 flex flex-col items-start gap-2">
              {copy.suggestions.map((suggestion) => (
                <li key={suggestion}>
                  <button
                    type="button"
                    onClick={() => void send(suggestion)}
                    className="brief-choice text-left"
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          turns.map((turn, index) => (
            <p
              key={index}
              className={`site-assistant-turn is-${turn.role} text-paragraph-sm`}
            >
              {turn.content}
            </p>
          ))
        )}
        {pending ? (
          <p className="site-assistant-turn is-assistant text-paragraph-sm text-text-sub-600">
            {copy.thinking}
          </p>
        ) : null}
        {failure ? (
          <p className="flex items-start gap-2 text-paragraph-sm text-state-error-dark">
            <HugeiconsIcon
              icon={Alert02Icon}
              aria-hidden
              className="mt-0.5 size-4 shrink-0"
              strokeWidth={1.75}
            />
            {copy.errors[failure]}
          </p>
        ) : null}
      </div>

      <form
        className="site-assistant-form"
        onSubmit={(event) => {
          event.preventDefault()
          void send(draft)
        }}
      >
        <label htmlFor="site-assistant-question" className="sr-only">
          {copy.placeholder}
        </label>
        <textarea
          ref={field}
          id="site-assistant-question"
          value={draft}
          rows={2}
          maxLength={800}
          placeholder={copy.placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              void send(draft)
            }
          }}
          className="brief-input min-h-0 resize-none"
        />
        <button
          type="submit"
          disabled={pending || !draft.trim()}
          aria-label={copy.send}
          className="site-button size-11 shrink-0 px-0 disabled:opacity-50"
        >
          <HugeiconsIcon
            icon={ArrowUp02Icon}
            aria-hidden
            className="size-[18px]"
            strokeWidth={1.75}
          />
        </button>
      </form>

      <footer className="site-assistant-footer">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <a
            href={siteContactMailto(emailSubject)}
            className="site-link inline-flex min-h-11 items-center gap-1.5 text-label-sm"
          >
            <HugeiconsIcon
              icon={Mail01Icon}
              aria-hidden
              className="size-4"
              strokeWidth={1.75}
            />
            {copy.email}
          </a>
          <Link
            href={briefHref}
            onClick={onClose}
            className="site-link inline-flex min-h-11 items-center text-label-sm"
          >
            {copy.brief}
          </Link>
        </div>
        <p className="text-paragraph-sm text-text-sub-600">{copy.disclaimer}</p>
      </footer>
    </section>
  )
}

export default SiteAssistantPanel
