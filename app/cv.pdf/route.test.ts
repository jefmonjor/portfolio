import { NextRequest } from "next/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// Rendering is the expensive part this route has to protect, so it is the
// part every test watches.
const renderCvPdf = vi.fn(async () => Buffer.from("%PDF-1.7 test"))

vi.mock("@/server/cv/render", () => ({
  renderCvPdf,
  cvFilename: (suffix: string, locale: string) =>
    `CV_${suffix}_${locale.toUpperCase()}.pdf`,
}))
vi.mock("@/server/cv/labels", () => ({
  loadCvLabels: vi.fn(async () => ({})),
}))

async function get(query: string, ip = "203.0.113.10") {
  const { GET } = await import("@/app/cv.pdf/route")
  return GET(
    new NextRequest(`http://localhost/cv.pdf${query}`, {
      headers: { "x-forwarded-for": ip },
    })
  )
}

describe("GET /cv.pdf", () => {
  beforeEach(() => {
    vi.resetModules()
    renderCvPdf.mockClear()
  })
  afterEach(() => vi.unstubAllEnvs())

  // Any extra query key used to miss the CDN cache and force a fresh render.
  it("redirects an unknown query key to the canonical URL without rendering", async () => {
    const response = await get("?locale=es&variant=technical&zz=1")

    expect(response.status).toBe(308)
    expect(response.headers.get("location")).toBe(
      "/cv.pdf?locale=es&variant=technical"
    )
    expect(renderCvPdf).not.toHaveBeenCalled()
  })

  it("sends a bare junk query to the indexable file", async () => {
    const response = await get("?zz=1")

    expect(response.status).toBe(308)
    expect(response.headers.get("location")).toBe("/cv.pdf")
    expect(renderCvPdf).not.toHaveBeenCalled()
  })

  it.each([
    ["?variant=ats", "/cv.pdf?locale=en&variant=technical"],
    ["?locale=es", "/cv.pdf?locale=es&variant=general"],
    ["?variant=technical&locale=ca", "/cv.pdf?locale=ca&variant=technical"],
    [
      "?locale=es&locale=ca&variant=general",
      "/cv.pdf?locale=es&variant=general",
    ],
    ["?locale=xx&variant=general", "/cv.pdf"],
    ["?locale=en&variant=general", "/cv.pdf"],
  ])("canonicalizes %s", async (query, location) => {
    const response = await get(query)

    expect(response.status).toBe(308)
    expect(response.headers.get("location")).toBe(location)
    expect(renderCvPdf).not.toHaveBeenCalled()
  })

  it("renders each file once per process", async () => {
    const first = await get("?locale=es&variant=technical")
    const second = await get("?locale=es&variant=technical", "203.0.113.11")
    const bare = await get("")

    expect(first.status).toBe(200)
    expect(first.headers.get("content-type")).toBe("application/pdf")
    expect(second.status).toBe(200)
    expect(bare.status).toBe(200)
    expect(bare.headers.get("link")).toContain('rel="canonical"')
    expect(renderCvPdf).toHaveBeenCalledTimes(2)
  })

  it("limits one client with its own bucket", async () => {
    vi.stubEnv("CV_PDF_RATE_MINUTE", "2")

    expect((await get("")).status).toBe(200)
    expect((await get("")).status).toBe(200)
    const limited = await get("?locale=es&variant=general")
    expect(limited.status).toBe(429)
    expect(limited.headers.get("retry-after")).toBe("60")
    expect(await limited.text()).toMatch(/descargas/i)
    // Another visitor is unaffected.
    expect((await get("", "203.0.113.99")).status).toBe(200)
  })
})
