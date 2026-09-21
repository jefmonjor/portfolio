import { describe, expect, it } from "vitest"

import robots from "@/app/robots"
import sitemap from "@/app/sitemap"
import { GET as getLlmsText } from "@/app/llms.txt/route"
import { siteUrl } from "@/lib/profile"

describe("search-engine routes", () => {
  it("publishes the canonical host in robots.txt", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/", disallow: "/api/" },
      sitemap: `${siteUrl}/sitemap.xml`,
      host: siteUrl,
    })
  })

  it("publishes the canonical localized pages and the CV file", () => {
    const entries = sitemap()

    expect(entries.map(({ url }) => url)).toEqual([
      `${siteUrl}/en`,
      `${siteUrl}/es`,
      `${siteUrl}/ca`,
      `${siteUrl}/cv.pdf`,
    ])
    expect(entries[0]?.alternates?.languages).toEqual({
      en: `${siteUrl}/en`,
      es: `${siteUrl}/es`,
      ca: `${siteUrl}/ca`,
      "x-default": siteUrl,
    })
  })

  it("keeps the CV file out of the localized hreflang cluster", () => {
    const cvEntry = sitemap().find(({ url }) => url === `${siteUrl}/cv.pdf`)

    expect(cvEntry?.alternates).toBeUndefined()
  })

  it("publishes a public Markdown profile for retrieval systems", async () => {
    const response = getLlmsText()
    const body = await response.text()

    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8"
    )
    expect(body).toContain("# Jefferson Montesdeoca Jordán")
    expect(body).toContain(`${siteUrl}/es`)
    expect(body).toContain("https://github.com/jefmonjor/portfolio")
    expect(body).not.toContain("Other Tales")
    expect(body).not.toContain("Ilnami")
    expect(body).not.toMatch(/8 products|ocho productos|vuit productes/i)
  })

  it("keeps the pointer file crawlable but out of the index", () => {
    // The CV routes carry the same header; they resolve translations through
    // the server runtime, so they are covered by the build instead.
    expect(getLlmsText().headers.get("x-robots-tag")).toBe("noindex, follow")
  })
})
