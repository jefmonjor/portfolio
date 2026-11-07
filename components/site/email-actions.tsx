"use client"

import {
  Alert02Icon,
  Copy01Icon,
  Mail01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import type { SiteContent } from "@/content/site/types"
import { contactEmail, contactMailto } from "@/lib/email"

type CopyState = "idle" | "copied" | "failed"

type EmailActionsProps = {
  email: SiteContent["contact"]["email"]
}

const copyFeedbackMs = 2000

const copyIcon = {
  idle: Copy01Icon,
  copied: Tick02Icon,
  failed: Alert02Icon,
} satisfies Record<CopyState, IconSvgElement>

const copyIconTone: Record<CopyState, string> = {
  idle: "text-icon-sub-600",
  copied: "text-state-success-base",
  failed: "text-state-error-base",
}

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
        <span className="text-label-sm text-text-sub-600">{labels.label}</span>
        <span
          className={`min-h-8 text-title-h5 break-all text-text-strong-950 select-all md:text-title-h4 ${isHydrated ? "" : "w-[14ch] max-w-full animate-pulse rounded-6 bg-bg-weak-50"}`}
        >
          {isHydrated ? contactEmail() : null}
        </span>
      </p>
      <noscript>
        <p className="text-paragraph-sm text-text-sub-600">
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
          className="site-button site-button-stroke disabled:opacity-60"
        >
          <HugeiconsIcon
            icon={copyIcon[copyState]}
            aria-hidden
            className={`size-[18px] ${copyIconTone[copyState]}`}
            strokeWidth={1.75}
          />
          {copyLabel}
        </button>
      </div>
      <p className="text-paragraph-sm text-text-sub-600">{labels.noMailApp}</p>
      <p aria-live="polite" className="sr-only">
        {copyState === "idle" ? "" : copyLabel}
      </p>
    </div>
  )
}

export { EmailActions }
