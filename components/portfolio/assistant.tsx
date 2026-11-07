"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AiChat01Icon,
  ArrowUp02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { downloadCv, downloadTailoredCv } from "@/lib/cv-download"
import {
  parseConversation,
  readReply,
  requestMessages,
  serializeConversation,
  type ConversationMessage,
} from "@/lib/assistant/conversation"
import { contactEmail } from "@/lib/email"
import { cn } from "@/lib/utils"
import { hasVisibleText } from "@/lib/visible-text"
import type { AssistantAction } from "@/types/assistant"
import { ASSISTANT_MESSAGE_INPUT_CHARS } from "@/types/limits"

const STORAGE_KEY = "jefmonjor:assistant"
const URL_PATTERN = /(https?:\/\/[^\s)]+[^\s).,;:!?])/g

type Message = ConversationMessage

function loadConversation(): Message[] {
  try {
    return parseConversation(window.sessionStorage.getItem(STORAGE_KEY))
  } catch {
    return []
  }
}

function saveConversation(messages: ReadonlyArray<Message>): void {
  try {
    if (messages.length === 0) window.sessionStorage.removeItem(STORAGE_KEY)
    else {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        serializeConversation(messages)
      )
    }
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
  const tModal = useTranslations("cvModal")
  const tToast = useTranslations("cvToast")
  const locale = useLocale()
  const panelId = React.useId()
  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [pendingAction, setPendingAction] = React.useState<string | null>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
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

  function commit(next: Message[]): void {
    setMessages(next)
    saveConversation(next)
  }

  function actionKey(action: AssistantAction): string {
    return action.type === "cv" ? `cv:${action.variant}` : "cv-tailor"
  }

  function actionLabel(action: AssistantAction): string {
    if (action.type === "cv-tailor") return t("cvTailored")
    return action.variant === "technical" ? t("cvTechnical") : t("cvGeneral")
  }

  // Same routes as the download button in the hero: GET /cv.pdf for the
  // ready variants, POST /api/cv-tailor with the pasted offer for the third.
  async function runAction(action: AssistantAction): Promise<void> {
    if (pendingAction) return
    setPendingAction(actionKey(action))
    try {
      const result =
        action.type === "cv"
          ? await downloadCv(action.variant, locale)
          : await downloadTailoredCv(action.offer, locale)
      if (result.ok) {
        toast.success(tToast("title"), { description: tToast("description") })
      } else if (action.type === "cv") {
        toast.error(tModal("downloadError"))
      } else if (result.error === "rate_limited") {
        toast.error(tModal("tailorLimited"))
      } else if (result.error === "unavailable") {
        toast.error(tModal("tailorUnavailable"))
      } else {
        toast.error(tModal("tailorError"))
      }
    } catch {
      toast.error(
        action.type === "cv" ? tModal("downloadError") : tModal("tailorError")
      )
    } finally {
      setPendingAction(null)
    }
  }

  async function send(text: string) {
    const question = text.trim()
    if (!hasVisibleText(question) || busy) return
    const history: Message[] = [
      ...messages,
      { role: "user", content: question },
    ]
    setMessages(history)
    setInput("")
    setBusy(true)
    const controller = new AbortController()
    requestRef.current = controller

    const notice = (content: string): Message => ({
      role: "assistant",
      content,
    })
    let reply: Message
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: requestMessages(history), locale }),
        signal: controller.signal,
      })
      if (requestRef.current !== controller) return
      if (res.status === 429) {
        reply = notice(t("rateLimited"))
      } else if (res.status === 503) {
        reply = notice(t("unavailable", { email: contactEmail() }))
      } else if (!res.ok) {
        reply = notice(t("error", { email: contactEmail() }))
      } else {
        reply =
          readReply(await res.json()) ??
          notice(t("error", { email: contactEmail() }))
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      reply = notice(t("error", { email: contactEmail() }))
    }

    if (requestRef.current !== controller) return
    commit([...history, reply])
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
          className="flex h-[min(30rem,calc(100svh-6rem))] w-[min(23rem,calc(100vw-2rem))] origin-bottom-right animate-in flex-col overflow-hidden border border-border bg-background shadow-lg duration-200 ease-out fade-in-0 zoom-in-95 motion-reduce:zoom-in-100"
        >
          <div className="flex items-center justify-between gap-2 border-b border-border py-1.5 pr-1.5 pl-3">
            <span className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
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
                  className="h-7 px-2 font-mono text-[11px] tracking-widest text-muted-foreground uppercase"
                >
                  {t("reset")}
                </Button>
              ) : null}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                data-hit-area
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
                    className="min-h-8 border border-border px-2.5 py-1.5 text-left font-mono text-[11px] tracking-wide text-muted-foreground transition-[color,border-color,transform] duration-150 ease-out hover:border-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none active:scale-[0.98] disabled:opacity-60"
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
                  "max-w-[85%] px-2.5 py-1.5 text-xs leading-relaxed wrap-break-word whitespace-pre-line",
                  m.role === "user"
                    ? "ml-auto bg-foreground text-background"
                    : "border border-border text-foreground"
                )}
              >
                {m.role === "assistant" ? (
                  <Linkified text={m.content} />
                ) : (
                  m.content
                )}
                {m.role === "assistant" && m.actions ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.actions.map((action) => {
                      const key = actionKey(action)
                      const loading = pendingAction === key
                      return (
                        <button
                          key={key}
                          type="button"
                          disabled={pendingAction !== null}
                          aria-busy={loading}
                          onClick={() => void runAction(action)}
                          className="min-h-7 border border-border bg-background px-2 py-1 text-left font-mono text-[11px] tracking-wide text-foreground transition-[border-color,transform] duration-150 ease-out hover:border-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none active:scale-[0.98] disabled:opacity-60"
                        >
                          {loading ? t("cvPreparing") : actionLabel(action)}
                        </button>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            ))}
            {busy ? (
              <div
                className="flex w-fit items-center gap-1 border border-border px-2.5 py-2"
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
            className="flex items-end gap-2 border-t border-border p-2"
            onSubmit={(event) => {
              event.preventDefault()
              void send(input)
            }}
          >
            {/* A textarea so a pasted job offer keeps its line breaks;
                Enter still sends and Shift+Enter starts a new line. */}
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault()
                  void send(input)
                }
              }}
              aria-label={t("inputLabel")}
              placeholder={t("placeholder")}
              maxLength={ASSISTANT_MESSAGE_INPUT_CHARS}
              enterKeyHint="send"
              className="field-sizing-content max-h-32 min-h-9 min-w-0 flex-1 resize-none border border-input bg-transparent px-2.5 py-2 text-base leading-snug outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 sm:min-h-8 sm:py-1.5 sm:text-xs"
            />
            <Button
              type="submit"
              variant="outline"
              size="icon-sm"
              data-hit-area
              disabled={busy || !hasVisibleText(input)}
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
          <p className="border-t border-border px-3 py-1.5 font-mono text-[11px] leading-relaxed tracking-wide text-pretty text-muted-foreground">
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
          <span className="hidden font-mono text-[11px] tracking-widest uppercase sm:inline">
            {t("launcher")}
          </span>
        </Button>
      )}
    </div>
  )
}

export { Assistant }
