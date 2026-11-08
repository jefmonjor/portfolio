import { z } from "zod"

import { isLocale, routing } from "@/i18n/routing"
import { CV_PDF_VARIANTS } from "@/lib/cv-pdf"
import { hasVisibleText, isTailorableOffer } from "@/lib/visible-text"
import {
  ASSISTANT_ACTIONS_MAX,
  ASSISTANT_HISTORY_INPUT_MESSAGES,
  ASSISTANT_MESSAGE_INPUT_CHARS,
  ASSISTANT_REPLY_MAX_CHARS,
  ASSISTANT_SIGNATURE_MAX_CHARS,
} from "@/types/limits"

export { ASSISTANT_HISTORY_INPUT_MESSAGES, ASSISTANT_MESSAGE_INPUT_CHARS }

export const assistantLocaleSchema = z.preprocess((value) => {
  const candidate = typeof value === "string" ? value : undefined
  return isLocale(candidate) ? candidate : "es"
}, z.enum(routing.locales))

const unverifiedSignatureSchema = z
  .string()
  .max(ASSISTANT_SIGNATURE_MAX_CHARS)
  .optional()

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z
    .string()
    .trim()
    .max(ASSISTANT_MESSAGE_INPUT_CHARS)
    .refine(hasVisibleText),
  signature: unverifiedSignatureSchema,
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

export const assistantActionSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("cv"),
      variant: z.enum(CV_PDF_VARIANTS),
    })
    .strict(),
  z
    .object({
      type: z.literal("cv-tailor"),
      offer: z
        .string()
        .trim()
        .max(ASSISTANT_MESSAGE_INPUT_CHARS)
        .refine(isTailorableOffer),
    })
    .strict(),
])

export type AssistantAction = z.infer<typeof assistantActionSchema>

export const assistantSuccessSchema = z
  .object({
    reply: z.string().trim().min(1).max(ASSISTANT_REPLY_MAX_CHARS),
    signature: z.string().min(1).max(ASSISTANT_SIGNATURE_MAX_CHARS).optional(),
    actions: z
      .array(assistantActionSchema)
      .max(ASSISTANT_ACTIONS_MAX)
      .optional(),
  })
  .strict()

export type ChatMessage = z.infer<typeof chatMessageSchema>

export type ModelMessage = Pick<ChatMessage, "role" | "content">

// OpenAI Structured Outputs rejects length bounds; verifyOfferAnalysis applies them.
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
