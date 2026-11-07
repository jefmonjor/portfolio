import { z } from "zod"

import { visibleLength } from "@/lib/visible-text"

import { assistantLocaleSchema } from "@/types/assistant"
import {
  CV_TAILOR_OFFER_MAX_CHARS,
  CV_TAILOR_OFFER_MIN_CHARS,
} from "@/types/limits"

export { CV_TAILOR_OFFER_MAX_CHARS, CV_TAILOR_OFFER_MIN_CHARS }
export const CV_TAILOR_SUMMARY_MAX_CHARS = 900
export const CV_TAILOR_KEYWORDS_MAX = 15
export const CV_TAILOR_KEYWORD_MAX_CHARS = 120
export const CV_TAILOR_PROJECTS_MAX = 5
export const CV_TAILOR_PROJECT_ID_MAX_CHARS = 40

export const cvTailorRequestSchema = z
  .object({
    offer: z
      .string()
      .trim()
      .max(CV_TAILOR_OFFER_MAX_CHARS)
      .refine((offer) => visibleLength(offer) >= CV_TAILOR_OFFER_MIN_CHARS),
    locale: assistantLocaleSchema,
  })
  .strict()

// OpenAI Structured Outputs rejects length bounds; normalizeTailorModelOutput applies them.
export const cvTailorModelOutputSchema = z
  .object({
    keywords: z.array(z.string()),
    projectIds: z.array(z.string()),
  })
  .strict()

export const cvTailoredContentSchema = z
  .object({
    summary: z.string().trim().min(1).max(CV_TAILOR_SUMMARY_MAX_CHARS),
    keywords: z
      .array(z.string().trim().min(1).max(CV_TAILOR_KEYWORD_MAX_CHARS))
      .max(CV_TAILOR_KEYWORDS_MAX),
    projectIds: z
      .array(z.string().trim().min(1).max(CV_TAILOR_PROJECT_ID_MAX_CHARS))
      .max(CV_TAILOR_PROJECTS_MAX),
  })
  .strict()

export type CvTailorModelOutput = z.infer<typeof cvTailorModelOutputSchema>
export type CvTailoredContent = z.infer<typeof cvTailoredContentSchema>
