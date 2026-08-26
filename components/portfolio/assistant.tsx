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
import {
  ASSISTANT_MESSAGE_INPUT_CHARS,
  assistantSuccessSchema,
  type ChatMessage,
} from "@/types/assistant"

function Assistant() {
  const t = useTranslations("assistant")
  const locale = useLocale()
  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [input, setInput] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const requestRef = React.useRef<AbortController | null>(null)

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, busy])

  React.useEffect(
    () => () => {
      requestRef.current?.abort()
      requestRef.current = null
    },
    []
  )

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
        body: JSON.stringify({ messages: history, locale }),
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
        const data = assistantSuccessSchema.safeParse(await res.json())
        reply = data.success
          ? data.data.reply
          : t("error", { email: contactEmail() })
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      reply = t("error", { email: contactEmail() })
    }

    if (requestRef.current !== controller) return
    setMessages((prev) => [...prev, { role: "assistant", content: reply }])
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
  }

  const suggestions = [t("s1"), t("s2"), t("s3")]

  return (
    <div
      data-print-hidden
      className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6"
    >
      {open ? (
        <div className="flex h-[28rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              {t("title")}
            </span>
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

          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            aria-busy={busy}
            className="flex-1 space-y-3 overflow-y-auto p-3"
          >
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t("intro")}
            </p>
            {messages.length === 0 ? (
              <div className="flex flex-col items-start gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-md border border-border px-2 py-1 text-left font-mono text-[10px] tracking-wide text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
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
                  "max-w-[85%] rounded-lg px-2.5 py-1.5 text-xs leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-foreground text-background"
                    : "border border-border whitespace-pre-line text-foreground"
                )}
              >
                {m.content}
              </div>
            ))}
            {busy ? (
              <div className="w-fit rounded-lg border border-border px-2.5 py-1.5 font-mono text-[10px] text-muted-foreground">
                …
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
              value={input}
              onChange={(event) => setInput(event.target.value)}
              aria-label={t("inputLabel")}
              placeholder={t("placeholder")}
              maxLength={ASSISTANT_MESSAGE_INPUT_CHARS}
              className="h-8 min-w-0 flex-1 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring"
            />
            <Button
              type="submit"
              variant="outline"
              size="icon-sm"
              disabled={busy || input.trim().length === 0}
              aria-label={t("send")}
            >
              <HugeiconsIcon
                icon={ArrowUp02Icon}
                className="size-3.5"
                strokeWidth={1.75}
              />
            </Button>
          </form>
          <p className="border-t border-border px-3 py-1.5 font-mono text-[9px] leading-relaxed tracking-wide text-muted-foreground">
            {t("disclaimer")}
          </p>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={t("open")}
          onClick={() => setOpen(true)}
          className="size-11 rounded-full bg-background shadow-md"
        >
          <HugeiconsIcon
            icon={AiChat01Icon}
            className="size-5"
            strokeWidth={1.75}
          />
        </Button>
      )}
    </div>
  )
}

export { Assistant }
