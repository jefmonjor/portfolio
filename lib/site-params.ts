import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import { getSiteContent } from "@/content/site"
import type { SiteContent } from "@/content/site/types"
import { isSiteLocale, siteLocales, type SiteLocale } from "@/i18n/routing"

export type SitePageProps = {
  params: Promise<{ locale: string }>
}

export function siteStaticParams() {
  return siteLocales.map((locale) => ({ locale }))
}

export async function resolveSitePage(
  params: SitePageProps["params"]
): Promise<{ locale: SiteLocale; content: SiteContent }> {
  const { locale } = await params
  if (!isSiteLocale(locale)) notFound()
  setRequestLocale(locale)
  return { locale, content: getSiteContent(locale) }
}
