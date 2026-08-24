import type { MetadataRoute } from "next"

import { routing } from "@/i18n/routing"
import { portfolioUpdatedAt, siteUrl } from "@/lib/profile"

const languages: Record<string, string> = Object.fromEntries([
  ...routing.locales.map((locale) => [locale, `${siteUrl}/${locale}`]),
  ["x-default", `${siteUrl}/`],
])

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: portfolioUpdatedAt,
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }))
}
