import { z } from "zod"

import { siteLocales } from "@/i18n/routing"
import {
  ASSISTANT_HISTORY_INPUT_MESSAGES,
  chatMessageSchema,
} from "@/types/assistant"
import {
  ASSISTANT_REPLY_MAX_CHARS,
  ASSISTANT_SIGNATURE_MAX_CHARS,
} from "@/types/limits"

export const siteAssistantRequestSchema = z
  .object({
    messages: z
      .array(chatMessageSchema)
      .min(1)
      .max(ASSISTANT_HISTORY_INPUT_MESSAGES),
    locale: z.enum(siteLocales),
  })
  .strict()

export const siteAssistantReplySchema = z
  .object({
    reply: z.string().trim().min(1).max(ASSISTANT_REPLY_MAX_CHARS),
    signature: z.string().max(ASSISTANT_SIGNATURE_MAX_CHARS).optional(),
  })
  .strict()

export type SiteAssistantRequest = z.infer<typeof siteAssistantRequestSchema>
export type SiteAssistantReply = z.infer<typeof siteAssistantReplySchema>
