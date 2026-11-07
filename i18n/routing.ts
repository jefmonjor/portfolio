import { defineRouting } from "next-intl/routing"
import { hasLocale } from "next-intl"

export const routing = defineRouting({
  locales: ["en", "es", "ca"] as const,
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
  alternateLinks: false,
})

export type Locale = (typeof routing.locales)[number]

export const siteLocales = ["en", "es"] as const satisfies ReadonlyArray<Locale>

export type SiteLocale = (typeof siteLocales)[number]

export function isLocale(value: string | null | undefined): value is Locale {
  return hasLocale(routing.locales, value)
}

export function isSiteLocale(
  value: string | null | undefined
): value is SiteLocale {
  return hasLocale(siteLocales, value)
}

export function resolveLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : routing.defaultLocale
}

export function localizedPath(locale: Locale, path: `/${string}`): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`
  const suffix = path === "/" ? "" : path
  return `${prefix}${suffix}` || "/"
}

export function nearestSiteLocale(locale: Locale): SiteLocale {
  return isSiteLocale(locale) ? locale : "es"
}

function withoutLocalePrefix(pathname: string): `/${string}` {
  const [, firstSegment, ...rest] = pathname.split("/")
  if (isLocale(firstSegment) && firstSegment !== routing.defaultLocale) {
    return `/${rest.join("/")}`
  }
  return isRootedPath(pathname) ? pathname : `/${pathname}`
}

function isRootedPath(path: string): path is `/${string}` {
  return path.startsWith("/")
}

export function samePathInLocale(pathname: string, target: Locale): string {
  return localizedPath(target, withoutLocalePrefix(pathname))
}
