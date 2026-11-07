import type { AssistantAction, ChatMessage } from "@/types/assistant"
import {
  ASSISTANT_HISTORY_INPUT_MESSAGES,
  ASSISTANT_REPLY_MAX_CHARS,
} from "@/types/limits"

const MAX_ACTIONS_PER_REPLY = 3

export type ConversationMessage = ChatMessage & {
  readonly actions?: ReadonlyArray<AssistantAction>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isAction(value: unknown): value is AssistantAction {
  if (!isRecord(value)) return false
  if (value.type === "cv") {
    return value.variant === "general" || value.variant === "technical"
  }
  return (
    value.type === "cv-tailor" &&
    typeof value.offer === "string" &&
    value.offer.trim().length > 0
  )
}

function actionsFrom(value: unknown): AssistantAction[] {
  return Array.isArray(value)
    ? value.filter(isAction).slice(0, MAX_ACTIONS_PER_REPLY)
    : []
}

export function readReply(body: unknown): ConversationMessage | null {
  if (!isRecord(body) || typeof body.reply !== "string") return null
  const content = body.reply.trim()
  if (content.length === 0 || content.length > ASSISTANT_REPLY_MAX_CHARS) {
    return null
  }
  const signature =
    typeof body.signature === "string" && body.signature.length > 0
      ? { signature: body.signature }
      : {}
  const actions = actionsFrom(body.actions)

  return {
    role: "assistant",
    content,
    ...signature,
    ...(actions.length > 0 ? { actions } : {}),
  }
}

function isConversationMessage(value: unknown): value is ConversationMessage {
  return (
    isRecord(value) &&
    (value.role === "user" || value.role === "assistant") &&
    typeof value.content === "string" &&
    (value.signature === undefined || typeof value.signature === "string") &&
    (value.actions === undefined ||
      (Array.isArray(value.actions) && value.actions.every(isAction)))
  )
}

export function parseConversation(raw: string | null): ConversationMessage[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.every(isConversationMessage)
      ? parsed
      : []
  } catch {
    return []
  }
}

export function serializeConversation(
  messages: ReadonlyArray<ConversationMessage>
): string {
  return JSON.stringify(messages)
}

export function requestMessages(
  history: ReadonlyArray<ConversationMessage>
): ChatMessage[] {
  return history
    .slice(-ASSISTANT_HISTORY_INPUT_MESSAGES)
    .map(({ role, content, signature }) =>
      signature ? { role, content, signature } : { role, content }
    )
}
