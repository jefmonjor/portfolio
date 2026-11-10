import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const brevo = vi.fn<typeof fetch>()

let visitor = 0
const nextIp = () => `10.2.${Math.floor(visitor / 250)}.${visitor++ % 250}`

async function post(
  body: unknown,
  {
    ip = nextIp(),
    headers = {},
  }: { ip?: string; headers?: Record<string, string> } = {}
) {
  const { POST } = await import("@/app/api/contact/route")
  const response = await POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": ip,
        ...headers,
      },
      body: JSON.stringify(body),
    })
  )
  return {
    status: response.status,
    body: (await response.json()) as { ok?: boolean; error?: string },
  }
}

const brief = (overrides: Record<string, string> = {}) => ({
  locale: "es",
  name: "Ana Pérez",
  email: "ana@example.com",
  company: "Acme",
  problem: "Nuestro ERP no habla con la tienda online.",
  type: "Integración de sistemas y APIs",
  budget: "",
  timeline: "En 1–3 meses",
  website: "",
  ...overrides,
})

function sentEmail() {
  const [url, init] = brevo.mock.calls[0] ?? []
  return {
    url,
    headers: new Headers(init?.headers),
    body: JSON.parse(String(init?.body)) as {
      sender: { email: string }
      to: Array<{ email: string }>
      replyTo: { email: string; name: string }
      subject: string
      textContent: string
    },
  }
}

describe("contact route", () => {
  beforeEach(() => {
    vi.stubEnv("BREVO_API_KEY", "test-key")
    vi.stubGlobal("fetch", brevo)
    brevo.mockReset()
    brevo.mockResolvedValue(new Response("{}", { status: 201 }))
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it("sends the brief to the site inbox with a reply-to the visitor", async () => {
    const { status, body } = await post(brief())

    expect(status).toBe(200)
    expect(body).toEqual({ ok: true })
    const email = sentEmail()
    expect(email.url).toBe("https://api.brevo.com/v3/smtp/email")
    expect(email.headers.get("api-key")).toBe("test-key")
    expect(email.body.to).toEqual([
      expect.objectContaining({ email: "hola@jefmonjor.dev" }),
    ])
    expect(email.body.replyTo).toEqual({
      email: "ana@example.com",
      name: "Ana Pérez",
    })
    expect(email.body.subject).toContain("Ana Pérez")
    expect(email.body.textContent).toContain("Email: ana@example.com")
    expect(email.body.textContent).toContain(
      "Nuestro ERP no habla con la tienda online."
    )
    expect(email.body.textContent).not.toContain("Presupuesto")
  })

  it("lets the inbox and the sender be configured", async () => {
    vi.stubEnv("CONTACT_TO_EMAIL", "leads@jefmonjor.dev")
    vi.stubEnv("CONTACT_SENDER_EMAIL", "web@jefmonjor.dev")

    await post(brief())

    const email = sentEmail()
    expect(email.body.to[0]?.email).toBe("leads@jefmonjor.dev")
    expect(email.body.sender.email).toBe("web@jefmonjor.dev")
  })

  it("answers a filled trap field as if it were sent, without sending", async () => {
    const { status, body } = await post(brief({ website: "https://spam" }))

    expect(status).toBe(200)
    expect(body).toEqual({ ok: true })
    expect(brevo).not.toHaveBeenCalled()
  })

  it.each([
    ["an invalid email", { email: "ana@" }],
    ["a blank name", { name: "​ " }],
    ["a choice the brief does not offer", { budget: "1 €" }],
    ["a line break in the name", { name: "Ana\nBcc: x@y.z" }],
  ])("rejects %s", async (_, overrides) => {
    const { status, body } = await post(brief(overrides))

    expect(status).toBe(400)
    expect(body.error).toBe("bad_request")
    expect(brevo).not.toHaveBeenCalled()
  })

  it("rejects unknown fields", async () => {
    const { status } = await post({ ...brief(), cc: "x@y.z" })
    expect(status).toBe(400)
  })

  it("says it is unconfigured without a Brevo key", async () => {
    vi.stubEnv("BREVO_API_KEY", "")

    const { status, body } = await post(brief())

    expect(status).toBe(503)
    expect(body.error).toBe("unconfigured")
  })

  it("reports an upstream failure when Brevo refuses", async () => {
    brevo.mockResolvedValue(new Response("{}", { status: 401 }))

    const { status, body } = await post(brief())

    expect(status).toBe(502)
    expect(body.error).toBe("upstream")
  })

  it("rejects cross-site requests", async () => {
    const { status } = await post(brief(), {
      headers: { "sec-fetch-site": "cross-site" },
    })

    expect(status).toBe(403)
    expect(brevo).not.toHaveBeenCalled()
  })

  it("limits how often one visitor can send", async () => {
    const ip = nextIp()
    const statuses = []
    for (let attempt = 0; attempt < 3; attempt++) {
      statuses.push((await post(brief(), { ip })).status)
    }

    expect(statuses).toEqual([200, 200, 429])
    expect(brevo).toHaveBeenCalledTimes(2)
  })
})
