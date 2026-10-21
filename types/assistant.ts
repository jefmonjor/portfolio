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
