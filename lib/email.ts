// Contact email assembled at call time so the plain address never appears
// as a literal in the static HTML or the JS bundle. Built from char codes
// because the minifier constant-folds string concatenation/joins.
const CODES = [
  106, 101, 102, 109, 111, 110, 106, 111, 114, 64, 103, 109, 97, 105, 108, 46,
  99, 111, 109,
]

export const CONTACT_SUBJECT = "[Portfolio] Contacto"

export function contactEmail(): string {
  return String.fromCharCode(...CODES)
}

export function contactMailto(): string {
  return `mailto:${contactEmail()}?subject=${encodeURIComponent(CONTACT_SUBJECT)}`
}
