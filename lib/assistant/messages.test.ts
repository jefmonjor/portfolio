import { describe, expect, it } from "vitest"

import { sanitizeMessages } from "@/lib/assistant/messages"
import type { ChatMessage } from "@/types/assistant"

describe("sanitizeMessages", () => {
  it("keeps accepting the fifth user question with an eight-message window", () => {
    const history: ChatMessage[] = Array.from({ length: 9 }, (_, index) => ({
      role: index % 2 === 0 ? "user" : "assistant",
      content: `message-${index}`,
    }))

    const result = sanitizeMessages(history, 8, 800)

    expect(result).toHaveLength(7)
    expect(result?.[0]).toEqual({ role: "user", content: "message-2" })
    expect(result?.at(-1)).toEqual({ role: "user", content: "message-8" })
  })

  it("rejects malformed role order", () => {
    const history: ChatMessage[] = [
      { role: "user", content: "one" },
      { role: "user", content: "two" },
    ]

    expect(sanitizeMessages(history, 8, 800)).toBeNull()
  })

  it("limits content without mutating the original history", () => {
    const history: ChatMessage[] = [{ role: "user", content: "123456" }]

    expect(sanitizeMessages(history, 8, 4)).toEqual([
      { role: "user", content: "1234" },
    ])
    expect(history[0]?.content).toBe("123456")
  })
})
