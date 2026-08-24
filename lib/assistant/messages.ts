import type { ChatMessage } from "@/types/assistant"

export function sanitizeMessages(
  messages: ReadonlyArray<ChatMessage>,
  maxTurns: number,
  maxChars: number
): ChatMessage[] | null {
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

  return recent.map(({ role, content }) => ({
    role,
    content: content.slice(0, charLimit),
  }))
}
