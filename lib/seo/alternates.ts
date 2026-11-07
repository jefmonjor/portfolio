import { localizedPath, routing, type Locale } from "@/i18n/routing"

export const openGraphLocale: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  ca: "ca_ES",
}

export function languageAlternates(
  locales: ReadonlyArray<Locale>,
  path: `/${string}`
): Record<string, string> {
  return Object.fromEntries([
    ...locales.map((locale) => [locale, localizedPath(locale, path)]),
    ["x-default", localizedPath(routing.defaultLocale, path)],
  ])
}

export function alternateOpenGraphLocales(
  locales: ReadonlyArray<Locale>,
  current: Locale
): string[] {
  return locales
    .filter((locale) => locale !== current)
    .map((locale) => openGraphLocale[locale])
}
