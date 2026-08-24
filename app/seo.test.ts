import { describe, expect, it } from "vitest"

import robots from "@/app/robots"
import sitemap from "@/app/sitemap"
import { siteUrl } from "@/lib/profile"

describe("search-engine routes", () => {
  it("publishes the canonical host in robots.txt", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/", disallow: "/api/" },
      sitemap: `${siteUrl}/sitemap.xml`,
      host: siteUrl,
    })
  })

  it("publishes only canonical localized pages in the sitemap", () => {
    const entries = sitemap()

    expect(entries.map(({ url }) => url)).toEqual([
      `${siteUrl}/en`,
      `${siteUrl}/es`,
      `${siteUrl}/ca`,
    ])
    expect(entries[0]?.alternates?.languages).toEqual({
      en: `${siteUrl}/en`,
      es: `${siteUrl}/es`,
      ca: `${siteUrl}/ca`,
      "x-default": `${siteUrl}/`,
    })
  })
})
