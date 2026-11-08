import { resolveLocale, type Locale } from "@/i18n/locales"

// Char codes, not a literal: the minifier folds any string concatenation back into the address.
const ADDRESS_CHAR_CODES = [
  106, 101, 102, 109, 111, 110, 106, 111, 114, 64, 103, 109, 97, 105, 108, 46,
  99, 111, 109,
]

const CV_CONTACT_SUBJECT: Record<Locale, string> = {
  en: "[Portfolio] Contact",
  es: "[Portfolio] Contacto",
  ca: "[Portfolio] Contacte",
}

export function cvContactSubject(locale: string): string {
  return CV_CONTACT_SUBJECT[resolveLocale(locale)]
}

export function contactEmail(): string {
  return String.fromCharCode(...ADDRESS_CHAR_CODES)
}

export function contactMailto(subject: string, body?: string): string {
  const query = `subject=${encodeURIComponent(subject)}`
  const bodyQuery = body ? `&body=${encodeURIComponent(body)}` : ""
  return `mailto:${contactEmail()}?${query}${bodyQuery}`
}
