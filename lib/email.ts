import { resolveLocale, type Locale } from "@/i18n/routing"

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

export function contactMailto(subject: string): string {
  return `mailto:${contactEmail()}?subject=${encodeURIComponent(subject)}`
}
