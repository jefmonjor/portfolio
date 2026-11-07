import type { Metadata } from "next"

import type { PageMeta, SitePath } from "@/content/site/types"
import { localizedPath, siteLocales, type SiteLocale } from "@/i18n/routing"
import { ogImageSize } from "@/lib/seo/og-card"
import { ogImagePath } from "@/lib/seo/og-path"
import {
  alternateOpenGraphLocales,
  languageAlternates,
  openGraphLocale,
} from "@/lib/seo/alternates"

type SitePageMetadataInput = {
  locale: SiteLocale
  path: SitePath
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
  const image = {
    url: ogImagePath(locale, path),
    ...ogImageSize,
    alt: meta.title,
  }

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
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [image],
    },
  }
}
