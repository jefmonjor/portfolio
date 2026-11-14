import { describe, expect, it } from "vitest"

import robots, { aiCrawlers } from "@/app/robots"
import sitemap from "@/app/sitemap"
import { GET as getLlmsText } from "@/app/llms.txt/route"
import { siteUrl } from "@/lib/profile"
import { buildLlmsFull } from "@/lib/seo/llms"

describe("search-engine routes", () => {
  it("publishes the canonical host in robots.txt", () => {
    expect(robots()).toEqual({
      rules: [
        { userAgent: "*", allow: "/", disallow: "/api/" },
        { userAgent: [...aiCrawlers], allow: "/", disallow: "/api/" },
      ],
      sitemap: `${siteUrl}/sitemap.xml`,
      host: siteUrl,
    })
  })

  it("names the AI search and assistant crawlers it welcomes", () => {
    expect(aiCrawlers).toEqual(
      expect.arrayContaining(["GPTBot", "ClaudeBot", "PerplexityBot"])
    )
  })

  it("publishes every page of the site in English and Spanish", () => {
    const urls = sitemap().map(({ url }) => url)

    expect(urls).toEqual(
      expect.arrayContaining([
        siteUrl,
        `${siteUrl}/es`,
        `${siteUrl}/services`,
        `${siteUrl}/es/services`,
        `${siteUrl}/work/private-bank-modernization`,
        `${siteUrl}/es/work/transolido-verifactu-invoicing`,
        `${siteUrl}/experience`,
        `${siteUrl}/contact`,
      ])
    )
    expect(urls).not.toContain(`${siteUrl}/ca`)
    expect(urls).not.toContain(`${siteUrl}/ca/services`)
  })

  it("pairs each site page with its translation and an English default", () => {
    const services = sitemap().find(({ url }) => url === `${siteUrl}/services`)

    expect(services?.alternates?.languages).toEqual({
      en: `${siteUrl}/services`,
      es: `${siteUrl}/es/services`,
      "x-default": `${siteUrl}/services`,
    })
  })

  it("keeps the full CV in its three languages", () => {
    const cv = sitemap().find(({ url }) => url === `${siteUrl}/cv`)

    expect(cv?.alternates?.languages).toEqual({
      en: `${siteUrl}/cv`,
      es: `${siteUrl}/es/cv`,
      ca: `${siteUrl}/ca/cv`,
      "x-default": `${siteUrl}/cv`,
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
    expect(body).toContain(`${siteUrl}/services`)
    expect(body).toContain("Solutions Architect & Senior Backend Engineer")
    expect(body).not.toMatch(/Not offering|Product Engineer/)
    expect(body).toContain("https://github.com/jefmonjor/portfolio")
    expect(body).toContain("https://ilnami.com")
    expect(body).not.toMatch(/8 products|ocho productos|vuit productes/i)
  })

  it("builds the full reference as the summary plus one CV", () => {
    const body = buildLlmsFull("# Jefferson\n\n**Role**\n\n## Experience\n")

    expect(body.startsWith("# Jefferson Montesdeoca Jordán")).toBe(true)
    expect(body.match(/^# /gm)).toEqual(["# ", "# "])
    expect(body).toContain("# Full CV\n\n**Role**")
    expect(body).toContain(`${siteUrl}/llms-full.txt`)
    expect(body).toContain("For clients, recruiters and AI sourcing agents")
    expect(body).not.toMatch(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i)
  })

  it("keeps the pointer file crawlable but out of the index", () => {
    expect(getLlmsText().headers.get("x-robots-tag")).toBe("noindex, follow")
  })
})
