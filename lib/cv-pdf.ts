import { routing, type Locale } from "@/i18n/routing"

export const CV_PDF_VARIANTS = ["general", "technical"] as const

export type CvPdfVariantName = (typeof CV_PDF_VARIANTS)[number]

export function cvPdfPath(locale: Locale, variant: CvPdfVariantName): string {
  if (locale === routing.defaultLocale && variant === "general") {
    return "/cv.pdf"
  }
  return `/cv.pdf?${new URLSearchParams({ locale, variant })}`
}
