import { defineRouting } from "next-intl/routing"

import { defaultLocale, locales } from "@/i18n/locales"

export * from "@/i18n/locales"

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: false,
  alternateLinks: false,
})
