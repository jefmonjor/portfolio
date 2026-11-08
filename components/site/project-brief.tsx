"use client"

import {
  Alert02Icon,
  Copy01Icon,
  Mail01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRef, useState } from "react"

import type { ProjectBrief as ProjectBriefContent } from "@/content/site/types"
import { useIsHydrated } from "@/hooks/use-is-hydrated"
import { contactEmail, contactMailto } from "@/lib/email"
import { hasVisibleText } from "@/lib/visible-text"

type BriefStatus = "idle" | "missing" | "opened" | "copied" | "copyFailed"

type ProjectBriefProps = {
  brief: ProjectBriefContent
  withoutJavaScript: string
}

const problemMaxLength = 1500

function answer(form: FormData, field: string): string {
  const value = form.get(field)
  return typeof value === "string" ? value.trim() : ""
}

const requiredFields = ["name", "problem"] as const

function composeBody(brief: ProjectBriefContent, form: FormData): string {
  const labels = brief.emailLabels
  return [
    [labels.name, answer(form, "name")],
    [labels.company, answer(form, "company")],
    [labels.type, answer(form, "type")],
    [labels.budget, answer(form, "budget")],
    [labels.timeline, answer(form, "timeline")],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .concat(["", `${labels.problem}:`, answer(form, "problem")])
    .join("\n")
}

function firstMissingField(form: FormData) {
  return requiredFields.find((field) => !hasVisibleText(answer(form, field)))
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

function ProjectBrief({ brief, withoutJavaScript }: ProjectBriefProps) {
  const isHydrated = useIsHydrated()
  const form = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<BriefStatus>("idle")

  function readValidBrief(): FormData | null {
    if (!form.current) return null
    const data = new FormData(form.current)
    const firstMissing = firstMissingField(data)
    if (firstMissing) {
      setStatus("missing")
      form.current
        .querySelector<HTMLElement>(`[name="${firstMissing}"]`)
        ?.focus()
      return null
    }
    return data
  }

  function openEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = readValidBrief()
    if (!data) return
    setStatus("opened")
    window.location.href = contactMailto(
      brief.subject,
      composeBody(brief, data)
    )
  }

  async function copyBrief() {
    const data = readValidBrief()
    if (!data) return
    const text = `${contactEmail()}\n${brief.subject}\n\n${composeBody(brief, data)}`
    try {
      await navigator.clipboard.writeText(text)
      setStatus("copied")
    } catch {
      setStatus("copyFailed")
    }
  }

  // Clear a stale "missing" message as soon as both answers are there, and
  // drop the copy/open feedback once the text no longer matches what was sent.
  function refreshStatus() {
    if (status === "idle" || !form.current) return
    if (status === "missing" && firstMissingField(new FormData(form.current)))
      return
    setStatus("idle")
  }

  const message = {
    idle: "",
    missing: brief.required,
    opened: brief.opened,
    copied: brief.copied,
    copyFailed: brief.copyFailed,
  }[status]
  const isPositive = status === "copied" || status === "opened"

  return (
    <form
      ref={form}
      method="dialog"
      noValidate
      onSubmit={openEmail}
      onInput={refreshStatus}
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
          maxLength={problemMaxLength}
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
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={!isHydrated}
          className="site-button min-h-14 px-6 disabled:opacity-60"
        >
          <HugeiconsIcon
            icon={Mail01Icon}
            aria-hidden
            data-arrow
            className="size-[18px]"
            strokeWidth={1.75}
          />
          {brief.submit}
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
        className={`flex min-h-6 items-start gap-2 text-paragraph-sm ${isPositive ? "text-state-success-dark" : "text-state-error-dark"}`}
      >
        {message ? (
          <HugeiconsIcon
            icon={isPositive ? Tick02Icon : Alert02Icon}
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
