import { z } from "zod"

import { isLocale, routing } from "@/i18n/routing"
import {
  ASSISTANT_HISTORY_INPUT_MESSAGES,
  ASSISTANT_MESSAGE_INPUT_CHARS,
  ASSISTANT_REPLY_MAX_CHARS,
  CV_TAILOR_OFFER_MIN_CHARS,
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

// What the reply lets the visitor do next. A "cv" action downloads a ready
// variant from GET /cv.pdf; "cv-tailor" carries the pasted offer back so the
// client can POST it to /api/cv-tailor. The server decides which to offer;
// the client only renders buttons.
export const assistantActionSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("cv"),
      variant: z.enum(["general", "technical"]),
    })
    .strict(),
  z
    .object({
      type: z.literal("cv-tailor"),
      offer: z
        .string()
        .trim()
        .min(CV_TAILOR_OFFER_MIN_CHARS)
        .max(ASSISTANT_MESSAGE_INPUT_CHARS),
    })
    .strict(),
])

export type AssistantAction = z.infer<typeof assistantActionSchema>

export const assistantSuccessSchema = z
  .object({
    reply: z.string().trim().min(1).max(ASSISTANT_REPLY_MAX_CHARS),
    actions: z.array(assistantActionSchema).max(3).optional(),
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
