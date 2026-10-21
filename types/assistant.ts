import { z } from "zod"

import { isLocale, routing } from "@/i18n/routing"
import {
  ASSISTANT_HISTORY_INPUT_MESSAGES,
  ASSISTANT_MESSAGE_INPUT_CHARS,
  ASSISTANT_REPLY_MAX_CHARS,
} from "@/types/limits"

export { ASSISTANT_HISTORY_INPUT_MESSAGES, ASSISTANT_MESSAGE_INPUT_CHARS }

export const assistantLocaleSchema = z.preprocess((value) => {
  const candidate = typeof value === "string" ? value : undefined
  return isLocale(candidate) ? candidate : "es"
}, z.enum(routing.locales))

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(ASSISTANT_MESSAGE_INPUT_CHARS),
})

export const assistantRequestSchema = z
  .object({
    messages: z
      .array(chatMessageSchema)
      .min(1)
      .max(ASSISTANT_HISTORY_INPUT_MESSAGES),
    locale: assistantLocaleSchema,
  })
  .strict()

export const assistantSuccessSchema = z
  .object({
    reply: z.string().trim().min(1).max(ASSISTANT_REPLY_MAX_CHARS),
  })
  .strict()

export type ChatMessage = z.infer<typeof chatMessageSchema>

// What the model returns when the latest message is a job offer. Plain
// strings and arrays only (Structured Outputs rejects length bounds); every
// value is re-checked by verifyOfferAnalysis before anything is shown.
export const offerAnalysisModelOutputSchema = z
  .object({
    isJobOffer: z.boolean(),
    role: z.string(),
    matches: z.array(
      z.object({ requirement: z.string(), evidence: z.string() }).strict()
    ),
    unverified: z.array(z.string()),
  })
  .strict()

export type OfferAnalysisModelOutput = z.infer<
  typeof offerAnalysisModelOutputSchema
>
