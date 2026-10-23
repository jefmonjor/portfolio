import { routing, type Locale } from "@/i18n/routing"

export type CvPdfVariantName = "general" | "technical"

// The one URL each PDF is served from. The CDN keys its cache on the full
// query string, so every other spelling is redirected here instead of being
// rendered again. The default file keeps the bare, indexable /cv.pdf.
export function cvPdfPath(locale: Locale, variant: CvPdfVariantName): string {
  if (locale === routing.defaultLocale && variant === "general") {
    return "/cv.pdf"
  }
  return `/cv.pdf?${new URLSearchParams({ locale, variant })}`
}
