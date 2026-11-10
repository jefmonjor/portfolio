const BREVO_EMAIL_ENDPOINT = "https://api.brevo.com/v3/smtp/email"
const BREVO_DEADLINE_MS = 10_000

type Mailbox = { email: string; name?: string }

export type BriefEmail = {
  sender: Mailbox
  to: Mailbox
  replyTo: Mailbox
  subject: string
  text: string
}

type SendOptions = {
  apiKey: string
  fetch?: typeof fetch
}

/** Sends one transactional email through Brevo; nothing is kept on this side. */
export async function sendWithBrevo(
  email: BriefEmail,
  { apiKey, fetch: fetchImpl = fetch }: SendOptions
): Promise<"sent" | "upstream"> {
  try {
    const response = await fetchImpl(BREVO_EMAIL_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: email.sender,
        to: [email.to],
        replyTo: email.replyTo,
        subject: email.subject,
        textContent: email.text,
        tags: ["brief"],
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(BREVO_DEADLINE_MS),
    })
    if (response.ok) return "sent"
    console.error("[contact] Brevo rejected the brief", {
      status: response.status,
    })
    return "upstream"
  } catch (error) {
    console.error("[contact] Brevo unreachable", {
      message: error instanceof Error ? error.message : String(error),
    })
    return "upstream"
  }
}
