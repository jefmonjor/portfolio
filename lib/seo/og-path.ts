import type { SitePath } from "@/content/site/types"
import type { Locale } from "@/i18n/routing"

export type OgPage = SitePath

export function ogImagePath(locale: Locale, page: OgPage): string {
  return `/og/${locale}${page === "/" ? "/home" : page}.png`
}

export function ogPageFromSegments(segments: ReadonlyArray<string>): string {
  const joined = segments.join("/").replace(/\.png$/, "")
  return joined === "home" ? "/" : `/${joined}`
}
