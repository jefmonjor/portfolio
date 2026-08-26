import { z } from "zod"

import { assistantLocaleSchema } from "@/types/assistant"

export const CV_TAILOR_OFFER_MAX_CHARS = 4000
export const CV_TAILOR_SUMMARY_MAX_CHARS = 900
export const CV_TAILOR_KEYWORDS_MAX = 15
export const CV_TAILOR_KEYWORD_MAX_CHARS = 120
export const CV_TAILOR_PROJECTS_MAX = 5
export const CV_TAILOR_REQUIREMENTS_MAX = 4
export const CV_TAILOR_REQUIREMENT_MAX_CHARS = 120

export const cvTailorRequestSchema = z
  .object({
    offer: z.string().trim().min(40).max(CV_TAILOR_OFFER_MAX_CHARS),
    locale: assistantLocaleSchema,
  })
  .strict()

export const cvTailorModelOutputSchema = z
  .object({
    keywords: z
      .array(z.string().trim().min(1).max(CV_TAILOR_KEYWORD_MAX_CHARS))
      .max(CV_TAILOR_KEYWORDS_MAX),
    projectIds: z
      .array(z.string().trim().min(1).max(40))
      .max(CV_TAILOR_PROJECTS_MAX),
    unverifiedRequirements: z
      .array(z.string().trim().min(1).max(CV_TAILOR_REQUIREMENT_MAX_CHARS))
      .max(CV_TAILOR_REQUIREMENTS_MAX),
  })
  .strict()

export const cvTailoredContentSchema = cvTailorModelOutputSchema.extend({
  summary: z.string().trim().min(1).max(CV_TAILOR_SUMMARY_MAX_CHARS),
})

export type CvTailorModelOutput = z.infer<typeof cvTailorModelOutputSchema>
export type CvTailoredContent = z.infer<typeof cvTailoredContentSchema>
