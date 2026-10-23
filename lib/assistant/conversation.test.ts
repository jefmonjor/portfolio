import { describe, expect, it } from "vitest"

import {
  parseConversation,
  readReply,
  requestMessages,
  serializeConversation,
} from "@/lib/assistant/conversation"
import type { ChatMessage } from "@/types/assistant"

const signature = "a".repeat(43)

describe("assistant conversation (browser side)", () => {
  it("keeps the signature the server sent with the reply", () => {
    expect(readReply({ reply: " Java 21. ", signature })).toEqual({
      role: "assistant",
      content: "Java 21.",
      signature,
    })
  })

  it("rejects bodies that are not a reply", () => {
    expect(readReply({ error: "rate_limited" })).toBeNull()
    expect(readReply({ reply: "   ", signature })).toBeNull()
    expect(readReply(null)).toBeNull()
  })

  it("stores the signature in sessionStorage and reads it back", () => {
    const conversation: ChatMessage[] = [
      { role: "user", content: "¿Stack?" },
      { role: "assistant", content: "Java 21.", signature },
    ]

    expect(parseConversation(serializeConversation(conversation))).toEqual(
      conversation
    )
  })

  it("discards stored data that is not a conversation", () => {
    expect(parseConversation(null)).toEqual([])
    expect(parseConversation("{")).toEqual([])
    expect(
      parseConversation(
        JSON.stringify([{ role: "assistant", content: "x", signature: 1 }])
      )
    ).toEqual([])
  })

  it("sends the signature back with each assistant turn", () => {
    const history: ChatMessage[] = [
      { role: "user", content: "¿Stack?" },
      { role: "assistant", content: "Java 21.", signature },
      { role: "user", content: "¿Y?" },
    ]

    expect(requestMessages(history)).toEqual(history)
  })

  it("sends at most the window the contract accepts", () => {
    const history: ChatMessage[] = Array.from({ length: 30 }, (_, index) => ({
      role: index % 2 === 0 ? "user" : "assistant",
      content: `m${index}`,
    }))

    expect(requestMessages(history)).toHaveLength(17)
  })
})
