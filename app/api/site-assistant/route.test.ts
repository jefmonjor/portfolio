import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const create = vi.fn()

vi.mock("openai", () => {
  class RateLimitError extends Error {}
  class OpenAI {
    static RateLimitError = RateLimitError
    responses = { create }
  }
  return { default: OpenAI }
})

async function post(body: unknown, headers: Record<string, string> = {}) {
  const { POST } = await import("@/app/api/site-assistant/route")
  const response = await POST(
    new Request("http://localhost/api/site-assistant", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": `10.1.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`,
        ...headers,
      },
      body: JSON.stringify(body),
    })
  )
  return {
    status: response.status,
    body: (await response.json()) as {
      reply?: string
      signature?: string
      error?: string
    },
  }
}

const question = (content: string) => ({
  locale: "es",
  messages: [{ role: "user", content }],
})

describe("site assistant route", () => {
  beforeEach(() => {
    vi.stubEnv("OPENAI_API_KEY", "test")
    create.mockReset()
  })
  afterEach(() => vi.unstubAllEnvs())

  it("answers from the site prompt and signs the reply", async () => {
    create.mockResolvedValue({
      status: "completed",
      output_text: "Escríbele a hola@jefmonjor.dev.",
      usage: { total_tokens: 120 },
    })

    const { status, body } = await post(question("¿Cómo empiezo?"))

    expect(status).toBe(200)
    expect(body.reply).toBe("Escríbele a hola@jefmonjor.dev.")
    expect(body.signature).toMatch(/^[A-Za-z0-9_-]{43}$/)
    const call = create.mock.calls[0]?.[0] as { instructions: string }
    expect(call.instructions).toContain("Eres el asistente de Jefferson Montesdeoca")
    expect(call.instructions).toContain("hola@jefmonjor.dev")
  })

  it("rejects locales the site does not serve", async () => {
    const { status } = await post({ ...question("Hola"), locale: "ca" })
    expect(status).toBe(400)
    expect(create).not.toHaveBeenCalled()
  })

  it("rejects requests from other sites", async () => {
    const { status } = await post(question("Hola"), {
      origin: "https://evil.example",
      "sec-fetch-site": "cross-site",
    })
    expect(status).toBe(403)
    expect(create).not.toHaveBeenCalled()
  })

  it("says so when the AI is not configured", async () => {
    vi.stubEnv("OPENAI_API_KEY", "")
    const { status, body } = await post(question("Hola"))
    expect(status).toBe(503)
    expect(body.error).toBe("unconfigured")
  })

  it("reports an upstream failure without leaking it", async () => {
    create.mockRejectedValue(new Error("boom"))
    const { status, body } = await post(question("Hola"))
    expect(status).toBe(502)
    expect(body.error).toBe("upstream")
  })
})
