import { isSignedReply } from "@/lib/assistant/signature"
import type { ChatMessage, ModelMessage } from "@/types/assistant"

const isAuthenticReply = (message: ChatMessage): boolean =>
  isSignedReply(message.content, message.signature)

export function sanitizeMessages(
  messages: ReadonlyArray<ChatMessage>,
  maxTurns: number,
  maxChars: number,
  pastedOfferMaxChars: number = maxChars,
  isAuthentic: (message: ChatMessage) => boolean = isAuthenticReply
): ModelMessage[] | null {
  const turnLimit = Math.max(1, Math.floor(maxTurns))
  const charLimit = Math.max(1, Math.floor(maxChars))
  const wasTrimmed = messages.length > turnLimit
  let recent = messages.slice(-turnLimit)

  const windowStartsOnOrphanedReply =
    wasTrimmed && recent[0]?.role === "assistant"
  if (windowStartsOnOrphanedReply) {
    recent = recent.slice(1)
  }

  if (recent[0]?.role !== "user" || recent.at(-1)?.role !== "user") {
    return null
  }

  for (let index = 0; index < recent.length; index += 1) {
    const expectedRole = index % 2 === 0 ? "user" : "assistant"
    if (recent[index]?.role !== expectedRole) return null
  }

  const authenticExchanges: ChatMessage[] = []
  for (let index = 0; index < recent.length; index += 2) {
    const question = recent[index]
    const reply = recent[index + 1]
    if (!question) continue
    if (!reply) authenticExchanges.push(question)
    else if (isAuthentic(reply)) authenticExchanges.push(question, reply)
  }

  const pastedOfferLimit = Math.max(charLimit, Math.floor(pastedOfferMaxChars))
  return authenticExchanges.map(({ role, content }, index) => ({
    role,
    content: content.slice(
      0,
      index === authenticExchanges.length - 1 ? pastedOfferLimit : charLimit
    ),
  }))
}
