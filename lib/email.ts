const ADDRESS_CHAR_CODES = [
  106, 101, 102, 109, 111, 110, 106, 111, 114, 64, 103, 109, 97, 105, 108, 46,
  99, 111, 109,
]

export const CONTACT_SUBJECT = "[Portfolio] Contacto"

export function contactEmail(): string {
  return String.fromCharCode(...ADDRESS_CHAR_CODES)
}

export function contactMailto(subject: string = CONTACT_SUBJECT): string {
  return `mailto:${contactEmail()}?subject=${encodeURIComponent(subject)}`
}
