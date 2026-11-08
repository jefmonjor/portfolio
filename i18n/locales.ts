export const locales = ["en", "es", "ca"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const siteLocales = ["en", "es"] as const satisfies ReadonlyArray<Locale>

export type SiteLocale = (typeof siteLocales)[number]

function isOneOf<T extends string>(
  list: ReadonlyArray<T>,
  value: string | null | undefined
): value is T {
  return list.some((item) => item === value)
}

export function isLocale(value: string | null | undefined): value is Locale {
  return isOneOf(locales, value)
}

export function isSiteLocale(
  value: string | null | undefined
): value is SiteLocale {
  return isOneOf(siteLocales, value)
}

export function resolveLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : defaultLocale
}

export function localizedPath(locale: Locale, path: `/${string}`): string {
  const prefix = locale === defaultLocale ? "" : `/${locale}`
  const suffix = path === "/" ? "" : path
  return `${prefix}${suffix}` || "/"
}

export function nearestSiteLocale(locale: string): SiteLocale {
  const resolved = resolveLocale(locale)
  return isSiteLocale(resolved) ? resolved : "es"
}

function isRootedPath(path: string): path is `/${string}` {
  return path.startsWith("/")
}

export function withoutLocalePrefix(pathname: string): `/${string}` {
  const [, firstSegment, ...rest] = pathname.split("/")
  if (isLocale(firstSegment)) return `/${rest.join("/")}`
  return isRootedPath(pathname) ? pathname : `/${pathname}`
}

export function samePathInLocale(pathname: string, target: Locale): string {
  return localizedPath(target, withoutLocalePrefix(pathname))
}
