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

type ChatMessage = { role: "user" | "assistant"; content: string }

function Assistant() {
  const t = useTranslations("assistant")
  const locale = useLocale()
  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [input, setInput] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, busy])

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

    let reply: string
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, locale }),
      })
      if (res.status === 429) {
        reply = t("rateLimited")
      } else if (res.status === 503) {
        reply = t("unavailable", { email: contactEmail() })
      } else if (!res.ok) {
        reply = t("error", { email: contactEmail() })
      } else {
        const data: { reply?: string; error?: string } = await res.json()
        reply = data.reply || t("error", { email: contactEmail() })
      }
    } catch {
      reply = t("error", { email: contactEmail() })
    }

    setMessages((prev) => [...prev, { role: "assistant", content: reply }])
    setBusy(false)
  }

  const suggestions = [t("s1"), t("s2"), t("s3")]

  return (
    <div data-print-hidden className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
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
              onClick={() => setOpen(false)}
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" strokeWidth={1.75} />
            </Button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
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
              placeholder={t("placeholder")}
              maxLength={1500}
              className="h-8 min-w-0 flex-1 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring"
            />
            <Button
              type="submit"
              variant="outline"
              size="icon-sm"
              disabled={busy || input.trim().length === 0}
              aria-label={t("send")}
            >
              <HugeiconsIcon icon={ArrowUp02Icon} className="size-3.5" strokeWidth={1.75} />
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
          <HugeiconsIcon icon={AiChat01Icon} className="size-5" strokeWidth={1.75} />
        </Button>
      )}
    </div>
  )
}

export { Assistant }
