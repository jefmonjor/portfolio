import { z } from "zod"

import { assistantLocaleSchema } from "@/types/assistant"

export const CV_TAILOR_OFFER_MAX_CHARS = 4000
export const CV_TAILOR_SUMMARY_MAX_CHARS = 900
export const CV_TAILOR_KEYWORDS_MAX = 15
export const CV_TAILOR_KEYWORD_MAX_CHARS = 120
export const CV_TAILOR_PROJECTS_MAX = 5
export const CV_TAILOR_PROJECT_ID_MAX_CHARS = 40
export const CV_TAILOR_REQUIREMENTS_MAX = 4
export const CV_TAILOR_REQUIREMENT_MAX_CHARS = 120

export const cvTailorRequestSchema = z
  .object({
    offer: z.string().trim().min(40).max(CV_TAILOR_OFFER_MAX_CHARS),
    locale: assistantLocaleSchema,
  })
  .strict()

// Structured Outputs accepts only a subset of JSON Schema, and per-string
// length bounds are outside it: a schema carrying minLength/maxLength is
// rejected with 400 "'minLength' is not permitted" before the model ever
// runs. So the model-facing contract stays plain — three arrays of strings —
// and every bound lives server-side in normalizeTailorModelOutput, which has
// to re-check them anyway (the model is untrusted input).
export const cvTailorModelOutputSchema = z
  .object({
    keywords: z.array(z.string()),
    projectIds: z.array(z.string()),
    unverifiedRequirements: z.array(z.string()),
  })
  .strict()

// What the renderer is allowed to receive: bounded, trimmed, non-empty.
export const cvTailoredContentSchema = z
  .object({
    summary: z.string().trim().min(1).max(CV_TAILOR_SUMMARY_MAX_CHARS),
    keywords: z
      .array(z.string().trim().min(1).max(CV_TAILOR_KEYWORD_MAX_CHARS))
      .max(CV_TAILOR_KEYWORDS_MAX),
    projectIds: z
      .array(z.string().trim().min(1).max(CV_TAILOR_PROJECT_ID_MAX_CHARS))
      .max(CV_TAILOR_PROJECTS_MAX),
    unverifiedRequirements: z
      .array(z.string().trim().min(1).max(CV_TAILOR_REQUIREMENT_MAX_CHARS))
      .max(CV_TAILOR_REQUIREMENTS_MAX),
  })
  .strict()

export type CvTailorModelOutput = z.infer<typeof cvTailorModelOutputSchema>
export type CvTailoredContent = z.infer<typeof cvTailoredContentSchema>
