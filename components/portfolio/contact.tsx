"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CopyIcon,
  Linkedin01Icon,
  Location01Icon,
  Mail01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"

import { SectionHeading } from "@/components/portfolio/section-heading"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { contactEmail, contactMailto } from "@/lib/email"
import { profile } from "@/lib/profile"

type CopyState = "idle" | "copied" | "failed"

const linkedin = profile.socials.find((s) => s.kind === "linkedin")?.href ?? "#"

function Contact() {
  const [copyState, setCopyState] = React.useState<CopyState>("idle")
  // Assembled after mount so the address never ships in the static HTML.
  const [email, setEmail] = React.useState("")
  const resetTimerRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    const id = window.setTimeout(() => setEmail(contactEmail()), 0)
    return () => window.clearTimeout(id)
  }, [])

  const mailto = email ? contactMailto() : "#contact"
  const t = useTranslations("contact")
  const tStatus = useTranslations("status")

  React.useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current)
      }
    }
  }, [])

  function resetCopyStateSoon() {
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current)
    }

    resetTimerRef.current = window.setTimeout(() => {
      setCopyState("idle")
    }, 1600)
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(contactEmail())
      setCopyState("copied")
    } catch {
      setCopyState("failed")
    }
    resetCopyStateSoon()
  }

  const statusDetail = tStatus("detail")
  const copyLabel =
    copyState === "copied"
      ? t("copied")
      : copyState === "failed"
        ? t("copyFailed")
        : t("copy")

  return (
    <section
      id="contact"
      className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-8 sm:py-20"
    >
      <SectionHeading
        index={t("indexLabel")}
        title={t("title")}
        hint={tStatus("label")}
      />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4 border border-dashed border-border p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              {t("emailLabel")}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t("copyAriaLabel")}
                  onClick={onCopy}
                >
                  <HugeiconsIcon
                    icon={copyState === "copied" ? Tick02Icon : CopyIcon}
                    className="size-3.5"
                    strokeWidth={1.75}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span className="font-mono text-[10px] tracking-wider uppercase">
                  {copyLabel}
                </span>
              </TooltipContent>
            </Tooltip>
          </div>
          <span className="sr-only" role="status" aria-live="polite">
            {copyState === "idle" ? "" : copyLabel}
          </span>
          <a
            href={mailto}
            className="font-heading text-[clamp(1.25rem,2.2vw+0.75rem,1.875rem)] font-medium tracking-tight break-all text-foreground hover:underline"
          >
            {email || "•••••••@•••••••"}
          </a>
          <p className="max-w-prose text-xs text-muted-foreground sm:text-sm">
            {t("body")}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild>
              <a href={mailto}>
                <HugeiconsIcon
                  icon={Mail01Icon}
                  className="size-3.5"
                  strokeWidth={1.75}
                  data-icon="inline-start"
                />
                {t("sendEmail")}
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={linkedin} target="_blank" rel="noopener noreferrer">
                <HugeiconsIcon
                  icon={Linkedin01Icon}
                  className="size-3.5"
                  strokeWidth={1.75}
                  data-icon="inline-start"
                />
                {t("openLinkedIn")}
              </a>
            </Button>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-0 border border-dashed border-border">
          <div className="flex items-start gap-3 border-b border-dashed border-border p-4">
            <HugeiconsIcon
              icon={Location01Icon}
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              strokeWidth={1.5}
            />
            <div className="flex flex-col gap-1">
              <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                {t("basedIn")}
              </dt>
              <dd className="text-sm text-foreground">{profile.location}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3 border-b border-dashed border-border p-4">
            <span
              aria-hidden
              className="relative mt-1.5 inline-flex size-1.5 shrink-0"
            >
              <span className="absolute inset-0 animate-ping bg-brand/60" />
              <span className="relative inline-block size-1.5 bg-brand" />
            </span>
            <div className="flex flex-col gap-1">
              <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                {t("status")}
              </dt>
              <dd className="text-sm text-foreground">{tStatus("label")}</dd>
              {statusDetail ? (
                <dd className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  {statusDetail}
                </dd>
              ) : null}
            </div>
          </div>
          <div className="flex items-start gap-3 p-4">
            <span
              aria-hidden
              className="mt-1.5 inline-block size-1.5 shrink-0 bg-foreground/40"
            />
            <div className="flex flex-col gap-1">
              <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                {t("timezone")}
              </dt>
              <dd className="text-sm text-foreground">{profile.timezone}</dd>
            </div>
          </div>
        </dl>
      </div>
    </section>
  )
}

export { Contact }
