"use client"

import {
  Alert02Icon,
  Copy01Icon,
  Mail01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import { useEffect, useRef, useState } from "react"

import type { SiteContent } from "@/content/site/types"
import { useIsHydrated } from "@/hooks/use-is-hydrated"
import { siteContactEmail, siteContactMailto } from "@/lib/email"

type CopyState = "idle" | "copied" | "failed"

type EmailActionsProps = {
  email: SiteContent["contact"]["email"]
  /** Outline the email button when the project brief is the main path. */
  secondary?: boolean
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

function useCopyAddress() {
  const [copyState, setCopyState] = useState<CopyState>("idle")
  const resetTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(siteContactEmail())
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

function EmailActions({ email: labels, secondary = false }: EmailActionsProps) {
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
          className={`min-h-8 font-heading text-title-h5 break-all text-text-strong-950 select-all md:text-title-h4 ${isHydrated ? "" : "w-[14ch] max-w-full animate-pulse rounded-6 bg-bg-weak-50"}`}
        >
          {isHydrated ? siteContactEmail() : null}
        </span>
      </p>
      <noscript>
        <p className="text-paragraph-sm text-text-sub-600">
          {labels.withoutJavaScript}
        </p>
      </noscript>
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href={isHydrated ? siteContactMailto(labels.subject) : undefined}
          aria-disabled={!isHydrated}
          className={`site-button aria-disabled:pointer-events-none aria-disabled:opacity-60 ${secondary ? "site-button-stroke" : ""}`}
        >
          <HugeiconsIcon
            icon={Mail01Icon}
            aria-hidden
            className={`size-[18px] ${secondary ? "text-icon-sub-600" : ""}`}
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
