import { isSignedReply } from "@/lib/assistant/signature"
import type { ChatMessage, ModelMessage } from "@/types/assistant"

// Only replies this server signed may go back to the model as its own words.
const isAuthenticReply = (message: ChatMessage): boolean =>
  isSignedReply(message.content, message.signature)

export function sanitizeMessages(
  messages: ReadonlyArray<ChatMessage>,
  maxTurns: number,
  maxChars: number,
  // The latest user turn may carry a pasted job offer; earlier turns are only
  // context and stay short.
  lastMaxChars: number = maxChars,
  isAuthentic: (message: ChatMessage) => boolean = isAuthenticReply
): ModelMessage[] | null {
  const turnLimit = Math.max(1, Math.floor(maxTurns))
  const charLimit = Math.max(1, Math.floor(maxChars))
  const wasTrimmed = messages.length > turnLimit
  let recent = messages.slice(-turnLimit)

  // A valid client history always starts and ends with a user message. When
  // an even-sized window cuts through a conversation, discard the orphaned
  // assistant reply instead of rejecting every subsequent request.
  if (wasTrimmed && recent[0]?.role === "assistant") {
    recent = recent.slice(1)
  }

  if (recent[0]?.role !== "user" || recent.at(-1)?.role !== "user") {
    return null
  }

  for (let index = 0; index < recent.length; index += 1) {
    const expectedRole = index % 2 === 0 ? "user" : "assistant"
    if (recent[index]?.role !== expectedRole) return null
  }

  // An assistant turn without a valid signature was written by the client
  // (or is a local error notice the browser showed). It is dropped together
  // with the question it claims to answer, so the history still alternates.
  const authentic: ChatMessage[] = []
  for (let index = 0; index < recent.length; index += 2) {
    const question = recent[index]
    const reply = recent[index + 1]
    if (!question) continue
    if (!reply) authentic.push(question)
    else if (isAuthentic(reply)) authentic.push(question, reply)
  }

  const lastLimit = Math.max(charLimit, Math.floor(lastMaxChars))
  return authentic.map(({ role, content }, index) => ({
    role,
    content: content.slice(
      0,
      index === authentic.length - 1 ? lastLimit : charLimit
    ),
  }))
}
