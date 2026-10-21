"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AiChat01Icon,
  ArrowUp02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { contactEmail } from "@/lib/email"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "@/types/assistant"
import {
  ASSISTANT_HISTORY_INPUT_MESSAGES,
  ASSISTANT_MESSAGE_INPUT_CHARS,
  ASSISTANT_REPLY_MAX_CHARS,
} from "@/types/limits"

const STORAGE_KEY = "jefmonjor:assistant"
const URL_PATTERN = /(https?:\/\/[^\s)]+[^\s).,;:!?])/g

// The route returns `{ reply }` or an error code. A hand-written guard keeps
// Zod out of the page bundle; the server already validated the shape.
function readReply(body: unknown): string | null {
  if (typeof body !== "object" || body === null || !("reply" in body)) {
    return null
  }
  const reply = body.reply
  if (typeof reply !== "string") return null
  const trimmed = reply.trim()
  return trimmed.length > 0 && trimmed.length <= ASSISTANT_REPLY_MAX_CHARS
    ? trimmed
    : null
}

function isChatMessage(value: unknown): value is ChatMessage {
  return (
    typeof value === "object" &&
    value !== null &&
    "role" in value &&
    "content" in value &&
    (value.role === "user" || value.role === "assistant") &&
    typeof value.content === "string"
  )
}

function loadConversation(): ChatMessage[] {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.every(isChatMessage) ? parsed : []
  } catch {
    return []
  }
}

function saveConversation(messages: ReadonlyArray<ChatMessage>): void {
  try {
    if (messages.length === 0) window.sessionStorage.removeItem(STORAGE_KEY)
    else window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch {
    // Private mode or blocked storage: the chat still works, it just won't
    // survive a reload.
  }
}

// Replies are plain text. Links are the only markup worth rendering, and
// building them as elements (never as HTML) keeps model output inert.
function Linkified({ text }: { text: string }) {
  const parts = text.split(URL_PATTERN)
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all underline underline-offset-2 hover:text-brand"
          >
            {part}
          </a>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        )
      )}
    </>
  )
}

function Assistant() {
  const t = useTranslations("assistant")
  const locale = useLocale()
  const panelId = React.useId()
  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [input, setInput] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const requestRef = React.useRef<AbortController | null>(null)
  const restoredRef = React.useRef(false)

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, busy])

  React.useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  React.useEffect(
    () => () => {
      requestRef.current?.abort()
      requestRef.current = null
    },
    []
  )

  function openAssistant(): void {
    if (!restoredRef.current) {
      restoredRef.current = true
      setMessages(loadConversation())
    }
    setOpen(true)
  }

  function commit(next: ChatMessage[]): void {
    setMessages(next)
    saveConversation(next)
  }

  async function send(text: string) {
    const question = text.trim()
    if (!question || busy) return
    const history: ChatMessage[] = [
      ...messages,
      { role: "user", content: question },
    ]
    setMessages(history)
    setInput("")
    setBusy(true)
    const controller = new AbortController()
    requestRef.current = controller

    let reply: string
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The route accepts a bounded window and trims it further. Sending the
        // whole history used to break the chat on the ninth question, when the
        // array outgrew the request contract and every send became a 400.
        body: JSON.stringify({
          messages: history.slice(-ASSISTANT_HISTORY_INPUT_MESSAGES),
          locale,
        }),
        signal: controller.signal,
      })
      if (requestRef.current !== controller) return
      if (res.status === 429) {
        reply = t("rateLimited")
      } else if (res.status === 503) {
        reply = t("unavailable", { email: contactEmail() })
      } else if (!res.ok) {
        reply = t("error", { email: contactEmail() })
      } else {
        reply =
          readReply(await res.json()) ?? t("error", { email: contactEmail() })
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      reply = t("error", { email: contactEmail() })
    }

    if (requestRef.current !== controller) return
    commit([...history, { role: "assistant", content: reply }])
    requestRef.current = null
    setBusy(false)
  }

  function closeAssistant(): void {
    requestRef.current?.abort()
    requestRef.current = null
    if (busy) {
      setMessages((current) =>
        current.at(-1)?.role === "user" ? current.slice(0, -1) : current
      )
    }
    setBusy(false)
    setOpen(false)
    // Return focus to the launcher once it is back in the DOM.
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  function resetConversation(): void {
    requestRef.current?.abort()
    requestRef.current = null
    setBusy(false)
    commit([])
    inputRef.current?.focus()
  }

  const suggestions = [t("s1"), t("s2"), t("s3")]

  return (
    <div
      data-print-hidden
      className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6"
    >
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={t("title")}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation()
              closeAssistant()
            }
          }}
          className="flex h-[min(30rem,calc(100svh-6rem))] w-[min(23rem,calc(100vw-2rem))] origin-bottom-right animate-in flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-lg duration-200 ease-out fade-in-0 zoom-in-95 motion-reduce:zoom-in-100"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border py-1.5 pr-1.5 pl-3">
            <span className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              <span aria-hidden className="inline-block size-1.5 bg-brand" />
              {t("title")}
            </span>
            <div className="flex items-center gap-1">
              {messages.length > 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={resetConversation}
                  className="h-7 px-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase"
                >
                  {t("reset")}
                </Button>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={t("close")}
                onClick={closeAssistant}
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  className="size-3.5"
                  strokeWidth={1.75}
                />
              </Button>
            </div>
          </div>

          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            aria-busy={busy}
            className="flex-1 space-y-3 overflow-y-auto overscroll-contain p-3"
          >
            <p className="text-xs leading-relaxed text-pretty text-muted-foreground">
              {t("intro")}
            </p>
            {messages.length === 0 ? (
              <div className="flex flex-col items-start gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={busy}
                    onClick={() => void send(s)}
                    className="min-h-8 rounded-md border border-border px-2.5 py-1.5 text-left font-mono text-[10px] tracking-wide text-muted-foreground transition-[color,border-color,transform] duration-150 ease-out hover:border-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none active:scale-[0.98] disabled:opacity-60"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-lg px-2.5 py-1.5 text-xs leading-relaxed wrap-break-word",
                  m.role === "user"
                    ? "ml-auto bg-foreground text-background"
                    : "border border-border whitespace-pre-line text-foreground"
                )}
              >
                {m.role === "assistant" ? (
                  <Linkified text={m.content} />
                ) : (
                  m.content
                )}
              </div>
            ))}
            {busy ? (
              <div
                className="flex w-fit items-center gap-1 rounded-lg border border-border px-2.5 py-2"
                aria-label={t("thinking")}
              >
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    aria-hidden
                    style={{ animationDelay: `${delay}ms` }}
                    className="size-1 animate-pulse rounded-full bg-muted-foreground motion-reduce:animate-none"
                  />
                ))}
              </div>
            ) : null}
          </div>

          <form
            className="flex items-center gap-2 border-t border-border p-2"
            onSubmit={(event) => {
              event.preventDefault()
              void send(input)
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              aria-label={t("inputLabel")}
              placeholder={t("placeholder")}
              maxLength={ASSISTANT_MESSAGE_INPUT_CHARS}
              enterKeyHint="send"
              className="h-9 min-w-0 flex-1 rounded-md border border-input bg-transparent px-2.5 text-base outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 sm:h-8 sm:text-xs"
            />
            <Button
              type="submit"
              variant="outline"
              size="icon-sm"
              disabled={busy || input.trim().length === 0}
              aria-label={t("send")}
              className="size-9 sm:size-8"
            >
              <HugeiconsIcon
                icon={ArrowUp02Icon}
                className="size-3.5"
                strokeWidth={1.75}
              />
            </Button>
          </form>
          <p className="border-t border-border px-3 py-1.5 font-mono text-[9px] leading-relaxed tracking-wide text-pretty text-muted-foreground">
            {t("disclaimer")}
          </p>
        </div>
      ) : (
        <Button
          ref={triggerRef}
          type="button"
          variant="outline"
          aria-label={t("open")}
          aria-controls={panelId}
          aria-expanded={false}
          onClick={openAssistant}
          className="h-11 gap-2 rounded-full bg-background pr-4 pl-3.5 shadow-md transition-transform duration-150 ease-out active:scale-[0.97]"
        >
          <HugeiconsIcon
            icon={AiChat01Icon}
            className="size-5"
            strokeWidth={1.75}
          />
          <span className="hidden font-mono text-[10px] tracking-widest uppercase sm:inline">
            {t("launcher")}
          </span>
        </Button>
      )}
    </div>
  )
}

export { Assistant }
