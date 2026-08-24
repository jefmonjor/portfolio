import { z } from "zod"

import { assistantLocaleSchema } from "@/types/assistant"

export const CV_TAILOR_OFFER_MAX_CHARS = 4000
export const CV_TAILOR_SUMMARY_MAX_CHARS = 900
export const CV_TAILOR_KEYWORDS_MAX = 15
export const CV_TAILOR_KEYWORD_MAX_CHARS = 40

export const cvTailorRequestSchema = z
  .object({
    offer: z.string().trim().min(40).max(CV_TAILOR_OFFER_MAX_CHARS),
    locale: assistantLocaleSchema,
  })
  .strict()

export const cvTailorResponseSchema = z
  .object({
    summary: z.string().trim().min(1).max(CV_TAILOR_SUMMARY_MAX_CHARS),
    keywords: z
      .array(z.string().trim().min(1).max(CV_TAILOR_KEYWORD_MAX_CHARS))
      .max(CV_TAILOR_KEYWORDS_MAX),
  })
  .strict()

export type CvTailorResponse = z.infer<typeof cvTailorResponseSchema>
