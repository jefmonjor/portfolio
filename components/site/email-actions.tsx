"use client"

import { Copy01Icon, Mail01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import type { SiteContent } from "@/content/site/types"
import { contactEmail, contactMailto } from "@/lib/email"

type CopyState = "idle" | "copied" | "failed"

type EmailActionsProps = {
  email: SiteContent["contact"]["email"]
}

const copyFeedbackMs = 2000

function subscribeToNothing(): () => void {
  return () => {}
}

function useIsHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  )
}

function useCopyAddress() {
  const [copyState, setCopyState] = useState<CopyState>("idle")
  const resetTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(contactEmail())
      setCopyState("copied")
    } catch {
      setCopyState("failed")
    }
    window.clearTimeout(resetTimer.current)
    resetTimer.current = window.setTimeout(
      () => setCopyState("idle"),
      copyFeedbackMs
    )
  }

  return { copyState, copyAddress }
}

function EmailActions({ email: labels }: EmailActionsProps) {
  const isHydrated = useIsHydrated()
  const { copyState, copyAddress } = useCopyAddress()

  const copyLabel =
    copyState === "copied"
      ? labels.copied
      : copyState === "failed"
        ? labels.copyFailed
        : labels.copy

  return (
    <div className="flex flex-col gap-4">
      <p className="flex flex-col gap-1">
        <span className="text-sm text-muted-foreground">{labels.label}</span>
        <span
          className={`min-h-[1.5em] font-heading text-[clamp(1.25rem,2vw+0.75rem,1.75rem)] font-medium break-all text-foreground select-all ${isHydrated ? "" : "w-[14ch] max-w-full animate-pulse bg-muted"}`}
        >
          {isHydrated ? contactEmail() : null}
        </span>
      </p>
      <noscript>
        <p className="text-[0.9375rem] text-muted-foreground">
          {labels.withoutJavaScript}
        </p>
      </noscript>
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href={isHydrated ? contactMailto(labels.subject) : undefined}
          aria-disabled={!isHydrated}
          className="site-button aria-disabled:pointer-events-none aria-disabled:opacity-60"
        >
          <HugeiconsIcon
            icon={Mail01Icon}
            aria-hidden
            className="size-[18px]"
            strokeWidth={1.75}
          />
          {labels.write}
        </a>
        <button
          type="button"
          onClick={copyAddress}
          disabled={!isHydrated}
          className="site-button site-button-quiet disabled:opacity-60"
        >
          <HugeiconsIcon
            icon={copyState === "copied" ? Tick02Icon : Copy01Icon}
            aria-hidden
            className="size-[18px]"
            strokeWidth={1.75}
          />
          {copyLabel}
        </button>
      </div>
      <p className="text-sm text-muted-foreground">{labels.noMailApp}</p>
      <p aria-live="polite" className="sr-only">
        {copyState === "idle" ? "" : copyLabel}
      </p>
    </div>
  )
}

export { EmailActions }
