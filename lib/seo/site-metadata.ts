import type { Metadata } from "next"

import type { PageMeta, SitePath } from "@/content/site/types"
import { localizedPath, siteLocales, type Locale } from "@/i18n/routing"
import { profile } from "@/lib/profile"
import {
  alternateOpenGraphLocales,
  languageAlternates,
  openGraphLocale,
} from "@/lib/seo/alternates"
import { ogImageSize } from "@/lib/seo/og-card"
import { ogImagePath } from "@/lib/seo/og-path"

type PageMetadataInput = {
  locale: Locale
  path: SitePath
  meta: PageMeta
  locales?: ReadonlyArray<Locale>
  type?: "website" | "article" | "profile"
}

export function pageMetadata({
  locale,
  path,
  meta,
  locales = siteLocales,
  type = "website",
}: PageMetadataInput): Metadata {
  const url = localizedPath(locale, path)
  const image = {
    url: ogImagePath(locale, path),
    ...ogImageSize,
    alt: meta.title,
  }

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: url,
      languages: languageAlternates(locales, path),
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      type,
      siteName: profile.shortName,
      locale: openGraphLocale[locale],
      alternateLocale: alternateOpenGraphLocales(locales, locale),
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
