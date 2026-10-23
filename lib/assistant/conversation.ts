// Browser-side handling of the chat history: what the route returned, what
// sessionStorage keeps and what goes back with the next question. Plain
// guards instead of Zod keep the page bundle small; the server validates
// everything again.
import type { ChatMessage } from "@/types/assistant"
import {
  ASSISTANT_HISTORY_INPUT_MESSAGES,
  ASSISTANT_REPLY_MAX_CHARS,
} from "@/types/limits"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

// The route returns `{ reply, signature }`. The signature is the server's
// proof that it wrote the reply; without it the turn is not sent back as the
// assistant's (the server would drop it anyway).
export function readReply(body: unknown): ChatMessage | null {
  if (!isRecord(body) || typeof body.reply !== "string") return null
  const content = body.reply.trim()
  if (content.length === 0 || content.length > ASSISTANT_REPLY_MAX_CHARS) {
    return null
  }
  return typeof body.signature === "string" && body.signature.length > 0
    ? { role: "assistant", content, signature: body.signature }
    : { role: "assistant", content }
}

function isChatMessage(value: unknown): value is ChatMessage {
  return (
    isRecord(value) &&
    (value.role === "user" || value.role === "assistant") &&
    typeof value.content === "string" &&
    (value.signature === undefined || typeof value.signature === "string")
  )
}

export function parseConversation(raw: string | null): ChatMessage[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.every(isChatMessage) ? parsed : []
  } catch {
    return []
  }
}

export function serializeConversation(
  messages: ReadonlyArray<ChatMessage>
): string {
  return JSON.stringify(messages)
}

// The route accepts a bounded window and trims it further. Sending the whole
// history used to break the chat on the ninth question, when the array
// outgrew the request contract and every send became a 400.
export function requestMessages(
  history: ReadonlyArray<ChatMessage>
): ChatMessage[] {
  return history.slice(-ASSISTANT_HISTORY_INPUT_MESSAGES)
}
