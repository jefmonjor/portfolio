import { z } from "zod"

import { isLocale, routing } from "@/i18n/routing"

export const ASSISTANT_MESSAGE_INPUT_CHARS = 1500
export const ASSISTANT_HISTORY_INPUT_MESSAGES = 17

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
    reply: z.string().trim().min(1).max(4000),
  })
  .strict()

export type ChatMessage = z.infer<typeof chatMessageSchema>
