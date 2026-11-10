import { z } from "zod"

import { siteLocales } from "@/i18n/routing"
import {
  CONTACT_COMPANY_MAX_CHARS,
  CONTACT_EMAIL_MAX_CHARS,
  CONTACT_NAME_MAX_CHARS,
  CONTACT_OPTION_MAX_CHARS,
  CONTACT_PROBLEM_MAX_CHARS,
} from "@/types/limits"

const singleLine = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .regex(/^[^\p{Cc}]*$/u)

/** The six-question brief, as the contact page sends it. */
export const contactRequestSchema = z
  .object({
    locale: z.enum(siteLocales),
    name: singleLine(CONTACT_NAME_MAX_CHARS).min(1),
    email: z.email().max(CONTACT_EMAIL_MAX_CHARS),
    company: singleLine(CONTACT_COMPANY_MAX_CHARS),
    problem: z.string().trim().min(1).max(CONTACT_PROBLEM_MAX_CHARS),
    type: singleLine(CONTACT_OPTION_MAX_CHARS),
    budget: singleLine(CONTACT_OPTION_MAX_CHARS),
    timeline: singleLine(CONTACT_OPTION_MAX_CHARS),
    /** Hidden from people; a bot that fills it gets a success it did not earn. */
    website: z.string().max(CONTACT_OPTION_MAX_CHARS),
  })
  .strict()

export type ContactRequest = z.infer<typeof contactRequestSchema>

export const contactFailures = [
  "bad_request",
  "rate_limited",
  "unconfigured",
  "upstream",
] as const

export type ContactFailure = (typeof contactFailures)[number] | "network"

export const contactResponseSchema = z.union([
  z.object({ ok: z.literal(true) }).strict(),
  z.object({ error: z.enum(contactFailures) }).strict(),
])
