import type { MetadataRoute } from "next"

import { indexableSitePaths } from "@/content/site"
import {
  localizedPath,
  routing,
  siteLocales,
  type Locale,
} from "@/i18n/routing"
import { absoluteUrl, portfolioUpdatedAt } from "@/lib/profile"
import { languageAlternates } from "@/lib/seo/alternates"

function localizedEntries(
  locales: ReadonlyArray<Locale>,
  path: `/${string}`,
  priority: number
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    Object.entries(languageAlternates(locales, path)).map(
      ([language, href]) => [language, absoluteUrl(href)]
    )
  )

  return locales.map((locale) => ({
    url: absoluteUrl(localizedPath(locale, path)),
    lastModified: portfolioUpdatedAt,
    changeFrequency: "monthly",
    priority,
    alternates: { languages },
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...indexableSitePaths.flatMap((path) =>
      localizedEntries(siteLocales, path, path === "/" ? 1 : 0.8)
    ),
    ...localizedEntries(routing.locales, "/cv", 0.6),
    {
      url: absoluteUrl("/cv.pdf"),
      lastModified: portfolioUpdatedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]
}
