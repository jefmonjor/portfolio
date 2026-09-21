import type { MetadataRoute } from "next"

import { routing } from "@/i18n/routing"
import { portfolioUpdatedAt, siteUrl } from "@/lib/profile"

// `x-default` is the locale-detecting root. It is spelled exactly as the
// canonical alternates in the document head, so both annotations describe the
// same URL instead of a trailing-slash pair.
const languages: Record<string, string> = Object.fromEntries([
  ...routing.locales.map((locale) => [locale, `${siteUrl}/${locale}`]),
  ["x-default", siteUrl],
])

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}`,
      lastModified: portfolioUpdatedAt,
      changeFrequency: "monthly" as const,
      priority: 1,
      alternates: { languages },
    })),
    // The parameterless CV: one clean, indexable file. Every variant carries a
    // query string and is served `noindex`, so the CV cannot fan out into a
    // cluster of near-duplicate PDFs.
    {
      url: `${siteUrl}/cv.pdf`,
      lastModified: portfolioUpdatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
  ]
}
