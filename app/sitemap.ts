import type { MetadataRoute } from "next"

import { indexableSitePaths } from "@/content/site"
import {
  localizedPath,
  routing,
  siteLocales,
  type Locale,
} from "@/i18n/routing"
import { absoluteUrl } from "@/lib/profile"
import { languageAlternates } from "@/lib/seo/alternates"

// The sitemap is generated at build time, so this is the date of the deploy
// that last changed the pages; a fixed date went stale and told crawlers
// nothing had changed.
const deployedAt = new Date()

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
    lastModified: deployedAt,
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
      lastModified: deployedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]
}
