import type { SitePath } from "@/content/site/types"
import type { Locale } from "@/i18n/locales"

export function ogImagePath(locale: Locale, page: SitePath): string {
  return `/og/${locale}${page === "/" ? "/home" : page}.png`
}
