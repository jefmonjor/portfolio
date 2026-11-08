import { resolveLocale, type Locale } from "@/i18n/locales"

// Char codes, not a literal: the minifier folds any string concatenation back into the address.
const ADDRESS_CHAR_CODES = [
  106, 101, 102, 109, 111, 110, 106, 111, 114, 64, 103, 109, 97, 105, 108, 46,
  99, 111, 109,
]

// The commercial site's own address; /cv keeps the one above.
const SITE_ADDRESS_CHAR_CODES = [
  104, 111, 108, 97, 64, 106, 101, 102, 109, 111, 110, 106, 111, 114, 46, 100,
  101, 118,
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

function mailto(address: string, subject: string, body?: string): string {
  const query = `subject=${encodeURIComponent(subject)}`
  const bodyQuery = body ? `&body=${encodeURIComponent(body)}` : ""
  return `mailto:${address}?${query}${bodyQuery}`
}

export function contactMailto(subject: string, body?: string): string {
  return mailto(contactEmail(), subject, body)
}

export function siteContactEmail(): string {
  return String.fromCharCode(...SITE_ADDRESS_CHAR_CODES)
}

export function siteContactMailto(subject: string, body?: string): string {
  return mailto(siteContactEmail(), subject, body)
}
