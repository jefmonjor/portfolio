import { describe, expect, it } from "vitest"

import { cvPdfAliases, securityHeaders } from "@/next.config.mjs"
import { cvPdfPath } from "@/lib/cv-pdf"

function header(name: string): string {
  return securityHeaders.find((entry) => entry.key === name)?.value ?? ""
}

describe("next.config", () => {
  it("sends each CV alias to the one URL its PDF is served from", () => {
    expect(cvPdfAliases).toEqual([
      { source: "/cv-en.pdf", destination: cvPdfPath("en", "general") },
      { source: "/cv-es.pdf", destination: cvPdfPath("es", "general") },
      { source: "/cv-ca.pdf", destination: cvPdfPath("ca", "general") },
    ])
  })

  it("forbids framing, sniffing and third-party scripts", () => {
    const csp = header("Content-Security-Policy")

    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain("object-src 'none'")
    expect(csp).toMatch(/script-src 'self'(?! https?:)/)
    expect(header("X-Frame-Options")).toBe("DENY")
    expect(header("X-Content-Type-Options")).toBe("nosniff")
    expect(header("Referrer-Policy")).toBe("strict-origin-when-cross-origin")
    expect(header("Permissions-Policy")).toContain("camera=()")
  })
})
