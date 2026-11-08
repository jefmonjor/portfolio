import { describe, expect, it } from "vitest"

import {
  isCrossSiteRequest,
  rejectForeignRequest,
} from "@/server/http/same-origin"

function post(headers: Record<string, string>): Request {
  return new Request("https://www.jefmonjor.dev/api/assistant", {
    method: "POST",
    headers: { host: "www.jefmonjor.dev", ...headers },
    body: "{}",
  })
}

describe("requests from other sites", () => {
  it("accepts the site's own pages", () => {
    expect(isCrossSiteRequest(post({ "sec-fetch-site": "same-origin" }))).toBe(
      false
    )
    expect(
      isCrossSiteRequest(post({ origin: "https://www.jefmonjor.dev" }))
    ).toBe(false)
  })

  it("rejects pages on other sites, even sibling subdomains", () => {
    expect(isCrossSiteRequest(post({ "sec-fetch-site": "cross-site" }))).toBe(
      true
    )
    expect(isCrossSiteRequest(post({ "sec-fetch-site": "same-site" }))).toBe(
      true
    )
    expect(isCrossSiteRequest(post({ origin: "https://evil.example" }))).toBe(
      true
    )
    expect(isCrossSiteRequest(post({ origin: "null" }))).toBe(true)
  })

  it("lets server-side clients without browser headers through to the limits", () => {
    expect(isCrossSiteRequest(post({}))).toBe(false)
  })

  it("answers a cross-site text/plain form post with 403 before reading it", async () => {
    const response = rejectForeignRequest(
      post({ "sec-fetch-site": "cross-site", "content-type": "text/plain" })
    )

    expect(response?.status).toBe(403)
    expect(await response?.json()).toEqual({ error: "forbidden" })
  })

  it("requires JSON, which a browser cannot send cross-site without a preflight", () => {
    expect(
      rejectForeignRequest(
        post({ "sec-fetch-site": "same-origin", "content-type": "text/plain" })
      )?.status
    ).toBe(415)
    expect(
      rejectForeignRequest(
        post({
          "sec-fetch-site": "same-origin",
          "content-type": "application/json; charset=utf-8",
        })
      )
    ).toBeNull()
  })
})
