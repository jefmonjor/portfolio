import { defineRouting } from "next-intl/routing"
import { hasLocale } from "next-intl"

export const routing = defineRouting({
  locales: ["en", "es"] as const,
  defaultLocale: "en",
  localePrefix: "always",
})

export type Locale = (typeof routing.locales)[number]

export function isLocale(value: string | null | undefined): value is Locale {
  return hasLocale(routing.locales, value)
}

export function resolveLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : routing.defaultLocale
}
