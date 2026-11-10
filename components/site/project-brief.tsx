"use client"

import {
  Alert02Icon,
  Copy01Icon,
  SentIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRef, useState } from "react"

import type { ProjectBrief as ProjectBriefContent } from "@/content/site/types"
import { useIsHydrated } from "@/hooks/use-is-hydrated"
import type { SiteLocale } from "@/i18n/routing"
import { siteContactEmail, siteContactMailto } from "@/lib/email"
import {
  briefSubject,
  composeBriefBody,
  type BriefAnswers,
} from "@/lib/project-brief"
import { hasVisibleText } from "@/lib/visible-text"
import {
  contactResponseSchema,
  type ContactFailure,
  type ContactRequest,
} from "@/types/contact"
import {
  CONTACT_COMPANY_MAX_CHARS,
  CONTACT_EMAIL_MAX_CHARS,
  CONTACT_NAME_MAX_CHARS,
  CONTACT_PROBLEM_MAX_CHARS,
} from "@/types/limits"

type BriefStatus =
  | "idle"
  | "missing"
  | "invalidEmail"
  | "sending"
  | "sent"
  | "fallback"
  | "copied"
  | "copyFailed"

type ProjectBriefProps = {
  locale: SiteLocale
  brief: ProjectBriefContent
  withoutJavaScript: string
}

const requiredFields = ["name", "email", "problem"] as const

const tone: Record<BriefStatus, "positive" | "negative" | "neutral"> = {
  idle: "neutral",
  missing: "negative",
  invalidEmail: "negative",
  sending: "neutral",
  sent: "positive",
  fallback: "positive",
  copied: "positive",
  copyFailed: "negative",
}

function answer(form: FormData, field: string): string {
  const value = form.get(field)
  return typeof value === "string" ? value.trim() : ""
}

function readAnswers(form: FormData): BriefAnswers {
  return {
    name: answer(form, "name"),
    email: answer(form, "email"),
    company: answer(form, "company"),
    type: answer(form, "type"),
    budget: answer(form, "budget"),
    timeline: answer(form, "timeline"),
    problem: answer(form, "problem"),
  }
}

function firstMissingField(form: FormData) {
  return requiredFields.find((field) => !hasVisibleText(answer(form, field)))
}

async function sendBrief(
  request: ContactRequest
): Promise<"sent" | ContactFailure> {
  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(request),
    })
    const reply = contactResponseSchema.safeParse(await response.json())
    if (!reply.success) return "upstream"
    return "ok" in reply.data ? "sent" : reply.data.error
  } catch {
    return "network"
  }
}

function ChoiceGroup({
  name,
  legend,
  options,
}: {
  name: string
  legend: string
  options: ReadonlyArray<string>
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-label-sm text-text-strong-950">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="brief-choice">
            <input
              type="radio"
              name={name}
              value={option}
              className="sr-only"
            />
            <span className="trim">{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function ProjectBrief({ locale, brief, withoutJavaScript }: ProjectBriefProps) {
  const isHydrated = useIsHydrated()
  const form = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<BriefStatus>("idle")

  function focusField(name: string) {
    form.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus()
  }

  function readValidBrief(): FormData | null {
    if (!form.current) return null
    const data = new FormData(form.current)
    const firstMissing = firstMissingField(data)
    if (firstMissing) {
      setStatus("missing")
      focusField(firstMissing)
      return null
    }
    const email = form.current.elements.namedItem("email")
    if (email instanceof HTMLInputElement && !email.checkValidity()) {
      setStatus("invalidEmail")
      focusField("email")
      return null
    }
    return data
  }

  function openInMailApp(answers: BriefAnswers) {
    window.location.href = siteContactMailto(
      briefSubject(brief, answers.name),
      composeBriefBody(brief.emailLabels, answers)
    )
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === "sending") return
    const data = readValidBrief()
    if (!data) return
    const answers = readAnswers(data)

    setStatus("sending")
    const result = await sendBrief({
      locale,
      ...answers,
      website: answer(data, "website"),
    })
    if (result === "sent") {
      form.current?.reset()
      setStatus("sent")
      return
    }
    if (result === "bad_request") {
      setStatus("invalidEmail")
      focusField("email")
      return
    }
    setStatus("fallback")
    openInMailApp(answers)
  }

  async function copyBrief() {
    const data = readValidBrief()
    if (!data) return
    const answers = readAnswers(data)
    const text = `${siteContactEmail()}\n${briefSubject(brief, answers.name)}\n\n${composeBriefBody(brief.emailLabels, answers)}`
    try {
      await navigator.clipboard.writeText(text)
      setStatus("copied")
    } catch {
      setStatus("copyFailed")
    }
  }

  // Clear a stale "missing" message as soon as the answers are there, and
  // drop the other feedback once the text no longer matches what was sent.
  function refreshStatus() {
    if (status === "idle" || status === "sending" || !form.current) return
    if (status === "missing" && firstMissingField(new FormData(form.current)))
      return
    setStatus("idle")
  }

  const message = {
    idle: "",
    missing: brief.required,
    invalidEmail: brief.invalidEmail,
    sending: brief.sending,
    sent: brief.sent,
    fallback: brief.fallback,
    copied: brief.copied,
    copyFailed: brief.copyFailed,
  }[status]
  const messageTone = tone[status]
  const isSending = status === "sending"

  return (
    <form
      ref={form}
      method="dialog"
      noValidate
      onSubmit={submit}
      onInput={refreshStatus}
      aria-busy={isSending}
      className="flex flex-col gap-8"
    >
      <noscript>
        <p className="text-paragraph-sm text-text-sub-600">
          {withoutJavaScript}
        </p>
      </noscript>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-label-sm text-text-strong-950">
            {brief.fields.name}
          </span>
          <input
            name="name"
            autoComplete="name"
            maxLength={CONTACT_NAME_MAX_CHARS}
            required
            aria-required
            className="brief-input"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-label-sm text-text-strong-950">
            {brief.fields.email}
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={CONTACT_EMAIL_MAX_CHARS}
            required
            aria-required
            className="brief-input"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-label-sm text-text-strong-950">
            {brief.fields.company}
          </span>
          <input
            name="company"
            autoComplete="organization"
            maxLength={CONTACT_COMPANY_MAX_CHARS}
            className="brief-input"
          />
        </label>
      </div>
      <label className="flex flex-col gap-2">
        <span className="text-label-sm text-text-strong-950">
          {brief.fields.problem}
        </span>
        <span
          id="brief-problem-hint"
          className="text-paragraph-sm text-text-sub-600"
        >
          {brief.fields.problemHint}
        </span>
        <textarea
          name="problem"
          rows={5}
          maxLength={CONTACT_PROBLEM_MAX_CHARS}
          required
          aria-required
          aria-describedby="brief-problem-hint"
          className="brief-input min-h-36 resize-y"
        />
      </label>
      <ChoiceGroup
        name="type"
        legend={brief.fields.type}
        options={brief.projectTypes}
      />
      <ChoiceGroup
        name="budget"
        legend={brief.fields.budget}
        options={brief.budgets}
      />
      <ChoiceGroup
        name="timeline"
        legend={brief.fields.timeline}
        options={brief.timelines}
      />
      <label aria-hidden className="sr-only">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={!isHydrated}
          aria-disabled={isSending}
          className="site-button min-h-14 px-6 disabled:opacity-60 aria-disabled:opacity-60"
        >
          <HugeiconsIcon
            icon={SentIcon}
            aria-hidden
            data-arrow
            className="size-[18px]"
            strokeWidth={1.75}
          />
          {isSending ? brief.sending : brief.submit}
        </button>
        <button
          type="button"
          onClick={copyBrief}
          disabled={!isHydrated}
          className="site-button site-button-stroke min-h-14 disabled:opacity-60"
        >
          <HugeiconsIcon
            icon={Copy01Icon}
            aria-hidden
            className="size-[18px] text-icon-sub-600"
            strokeWidth={1.75}
          />
          {brief.copy}
        </button>
      </div>
      <p
        aria-live="polite"
        className={`flex min-h-6 items-start gap-2 text-paragraph-sm ${
          {
            positive: "text-state-success-dark",
            negative: "text-state-error-dark",
            neutral: "text-text-sub-600",
          }[messageTone]
        }`}
      >
        {message && messageTone !== "neutral" ? (
          <HugeiconsIcon
            icon={messageTone === "positive" ? Tick02Icon : Alert02Icon}
            aria-hidden
            className="size-4 shrink-0"
            strokeWidth={1.75}
          />
        ) : null}
        {message}
      </p>
    </form>
  )
}

export { ProjectBrief }
