import type { AssistantFailure } from "@/content/site/types"
import type { SiteLocale } from "@/i18n/routing"
import type { ChatMessage } from "@/types/assistant"
import { siteAssistantReplySchema } from "@/types/site-assistant"

export type AssistantTurn = Pick<ChatMessage, "role" | "content" | "signature">

export type AssistantResult =
  | { ok: true; reply: string; signature?: string }
  | { ok: false; error: AssistantFailure }

const knownFailures: ReadonlyArray<AssistantFailure> = [
  "rate_limited",
  "unconfigured",
  "upstream",
  "bad_request",
]

export async function askSiteAssistant(
  messages: ReadonlyArray<AssistantTurn>,
  locale: SiteLocale
): Promise<AssistantResult> {
  let response: Response
  try {
    response = await fetch("/api/site-assistant", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages, locale }),
    })
  } catch {
    return { ok: false, error: "network" }
  }

  const body: unknown = await response.json().catch(() => null)
  if (response.ok) {
    const parsed = siteAssistantReplySchema.safeParse(body)
    return parsed.success
      ? { ok: true, ...parsed.data }
      : { ok: false, error: "upstream" }
  }
  const error =
    typeof body === "object" && body !== null && "error" in body
      ? knownFailures.find((failure) => failure === body.error)
      : undefined
  return { ok: false, error: error ?? "upstream" }
}
