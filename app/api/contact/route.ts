import { NextResponse } from "next/server"

import { getSiteContent } from "@/content/site"
import { checkContactLimit, requestIp } from "@/lib/assistant/rate-limit"
import { siteContactEmail } from "@/lib/email"
import {
  briefSubject,
  composeBriefBody,
  isOfferedChoice,
} from "@/lib/project-brief"
import { profile } from "@/lib/profile"
import { hasVisibleText } from "@/lib/visible-text"
import { sendWithBrevo } from "@/server/contact/brevo"
import { readGuardedJson } from "@/server/http/guarded-json"
import { contactRequestSchema, type ContactFailure } from "@/types/contact"
import { CONTACT_BODY_MAX_BYTES } from "@/types/limits"

export const runtime = "nodejs"

const SENDER_NAME = "jefmonjor.dev"

const failure = (error: Exclude<ContactFailure, "network">, status: number) =>
  NextResponse.json({ error }, { status })

const accepted = () => NextResponse.json({ ok: true })

export async function POST(request: Request) {
  const body = await readGuardedJson(request, CONTACT_BODY_MAX_BYTES)
  if (!body.ok) return body.response

  const parsed = contactRequestSchema.safeParse(body.value)
  if (!parsed.success) return failure("bad_request", 400)
  const { locale, website, ...answers } = parsed.data

  if (website) return accepted()

  const { brief } = getSiteContent(locale).contact
  const isComplete =
    hasVisibleText(answers.name) &&
    hasVisibleText(answers.problem) &&
    isOfferedChoice(brief.projectTypes, answers.type) &&
    isOfferedChoice(brief.budgets, answers.budget) &&
    isOfferedChoice(brief.timelines, answers.timeline)
  if (!isComplete) return failure("bad_request", 400)

  const apiKey = process.env.BREVO_API_KEY?.trim()
  if (!apiKey) return failure("unconfigured", 503)

  if ((await checkContactLimit(requestIp(request))) !== "ok") {
    return failure("rate_limited", 429)
  }

  const inbox = process.env.CONTACT_TO_EMAIL?.trim() || siteContactEmail()
  const result = await sendWithBrevo(
    {
      sender: {
        email: process.env.CONTACT_SENDER_EMAIL?.trim() || siteContactEmail(),
        name: SENDER_NAME,
      },
      to: { email: inbox, name: profile.name },
      replyTo: { email: answers.email, name: answers.name },
      subject: briefSubject(brief, answers.name),
      text: composeBriefBody(brief.emailLabels, answers),
    },
    { apiKey }
  )
  return result === "sent" ? accepted() : failure("upstream", 502)
}
