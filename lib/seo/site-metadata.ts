import type { Metadata } from "next"

import type { PageMeta } from "@/content/site/types"
import { localizedPath, siteLocales, type SiteLocale } from "@/i18n/routing"
import {
  alternateOpenGraphLocales,
  languageAlternates,
  openGraphLocale,
} from "@/lib/seo/alternates"

type SitePageMetadataInput = {
  locale: SiteLocale
  path: `/${string}`
  meta: PageMeta
  siteName: string
  type?: "website" | "article"
}

export function sitePageMetadata({
  locale,
  path,
  meta,
  siteName,
  type = "website",
}: SitePageMetadataInput): Metadata {
  const url = localizedPath(locale, path)

  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: {
      canonical: url,
      languages: languageAlternates(siteLocales, path),
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      type,
      siteName,
      locale: openGraphLocale[locale],
      alternateLocale: alternateOpenGraphLocales(siteLocales, locale),
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  }
}
