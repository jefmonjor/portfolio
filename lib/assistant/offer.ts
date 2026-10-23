import type { Locale } from "@/i18n/routing"
import type { OfferAnalysisModelOutput } from "@/types/assistant"

// A pasted job offer is the one moment the chat is tempted to stretch the
// profile: "8+ years of Java" against six, "fintech" against banking. Instead
// of trusting the model to hold back, offer comparisons run as a structured
// selection and the server keeps only what it can check:
//   - every requirement must come from the offer itself;
//   - every match must quote the dossier verbatim, or it is demoted to
//     "to confirm";
//   - the reply text is rendered here, never written by the model.

export const OFFER_MATCHES_MAX = 6
export const OFFER_UNVERIFIED_MAX = 6
const REQUIREMENT_MAX_CHARS = 140
const EVIDENCE_MAX_CHARS = 180
const EVIDENCE_MIN_CHARS = 4
// Share of a requirement's distinctive words that must appear in the offer.
const OFFER_GROUNDING = 0.8

// Words every offer and every dossier share. Counting them would let a
// requirement the model made up ("10 years of experience in Rust") pass as
// grounded on "years" and "experience" alone.
const FILLER = new Set(
  (
    "the and for with from that this you your our are will must have has " +
    "years year experience experienced knowledge skills skill strong good " +
    "solid working work ability plus nice required requirement requirements " +
    "con los las del para por una uno que muy anos ano experiencia " +
    "conocimiento conocimientos valorable valora deseable requisito " +
    "requisitos minimo nivel buen buena amb els les per dels anys any " +
    "experiencia coneixement requisits"
  ).split(" ")
)

export type VerifiedOfferAnalysis = {
  readonly role: string | null
  readonly matches: ReadonlyArray<{
    readonly requirement: string
    readonly evidence: string
  }>
  readonly unverified: ReadonlyArray<string>
}

function fold(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("en")
    .replace(/[‘’´`]/g, "'")
    .replace(/[“”«»]/g, '"')
    .replace(/[‐-―−]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
}

// Letters and digits only: tolerates the punctuation and spacing drift a
// model introduces when it "quotes", never a change of words.
function skeleton(value: string): string {
  return fold(value).replace(/[^\p{L}\p{N}]+/gu, "")
}

function words(value: string): string[] {
  return fold(value)
    .split(/[^\p{L}\p{N}+#.]+/u)
    .map((word) => word.replace(/^\.+|\.+$/g, ""))
    .filter(
      (word) => (word.length >= 3 || /\d/.test(word)) && !FILLER.has(word)
    )
}

// Five-letter stems: "microservicios" and "microservices" share "micro".
function stems(value: string): Set<string> {
  return new Set(words(value).map((word) => skeleton(word).slice(0, 5)))
}

function clip(value: string, maxChars: number): string {
  const clean = value.replace(/\s+/g, " ").trim()
  if (clean.length <= maxChars) return clean
  const cut = clean.slice(0, maxChars - 1)
  const boundary = cut.lastIndexOf(" ")
  return `${cut.slice(0, boundary > 0 ? boundary : undefined)}…`
}

// The offer reaches the model between <job_offer> tags. A pasted text that
// closes the tag itself could put words outside the data block, so any tag
// with that name (any case, any spacing) is removed first — repeatedly, so
// removing one cannot assemble another out of the pieces around it.
const OFFER_DELIMITER = /<\s*\/?\s*job_offer\b[^>]*>/gi

export function neutralizeOfferDelimiters(text: string): string {
  let current = text
  for (;;) {
    const next = current.replace(OFFER_DELIMITER, "")
    if (next === current) return current
    current = next
  }
}

export function wrapJobOffer(offer: string): string {
  return `<job_offer>\n${neutralizeOfferDelimiters(offer)}\n</job_offer>`
}

export function looksLikeJobOffer(text: string): boolean {
  const trimmed = text.trim()
  if (trimmed.length < 200) return false
  const lines = trimmed.split(/\n/).filter((line) => line.trim()).length
  const signals =
    /\b(requisit|requirement|requis|oferta|offer|vacante|vacancy|position|posici[oó]|puesto|role|responsabilidad|responsibilit|we are looking|buscamos|busquem|years|años|anys|experience|experiencia|experiència)/i
  return signals.test(trimmed) && (lines >= 4 || trimmed.length >= 600)
}

export function isGroundedInOffer(requirement: string, offer: string): boolean {
  const required = words(requirement)
  if (required.length === 0) return false
  const offerWords = new Set(words(offer))
  const offerSkeleton = skeleton(offer)
  const present = required.filter(
    (word) => offerWords.has(word) || offerSkeleton.includes(skeleton(word))
  ).length
  return present / required.length >= OFFER_GROUNDING
}

export function isQuotedFromDossier(
  evidence: string,
  dossier: string
): boolean {
  const quote = skeleton(evidence)
  return quote.length >= EVIDENCE_MIN_CHARS && skeleton(dossier).includes(quote)
}

// A real quote can still answer a different requirement: "Java (8 → 21)" is
// in the dossier, but it does not back "Kotlin". The quote has to name at
// least one of the requirement's own terms.
export function evidenceAddresses(
  requirement: string,
  evidence: string
): boolean {
  const quoted = stems(evidence)
  return [...stems(requirement)].some((stem) => quoted.has(stem))
}

export function verifyOfferAnalysis(
  output: OfferAnalysisModelOutput,
  offer: string,
  dossier: string
): VerifiedOfferAnalysis | null {
  if (!output.isJobOffer) return null

  const seen = new Set<string>()
  const firstTime = (requirement: string) => {
    const key = skeleton(requirement)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  }

  const matches: Array<{ requirement: string; evidence: string }> = []
  const unverified: string[] = []

  for (const match of output.matches) {
    const requirement = clip(match.requirement, REQUIREMENT_MAX_CHARS)
    if (!isGroundedInOffer(requirement, offer) || !firstTime(requirement)) {
      continue
    }
    if (
      isQuotedFromDossier(match.evidence, dossier) &&
      evidenceAddresses(requirement, match.evidence)
    ) {
      matches.push({
        requirement,
        evidence: clip(match.evidence, EVIDENCE_MAX_CHARS),
      })
    } else {
      // A match the dossier cannot back is not dropped silently: the
      // requirement is real, only the claim was not. It is shown as open.
      unverified.push(requirement)
    }
  }

  for (const item of output.unverified) {
    const requirement = clip(item, REQUIREMENT_MAX_CHARS)
    if (isGroundedInOffer(requirement, offer) && firstTime(requirement)) {
      unverified.push(requirement)
    }
  }

  if (matches.length === 0 && unverified.length === 0) return null

  const role = clip(output.role, 90)
  return {
    role: role && isGroundedInOffer(role, offer) ? role : null,
    matches: matches.slice(0, OFFER_MATCHES_MAX),
    unverified: unverified.slice(0, OFFER_UNVERIFIED_MAX),
  }
}

const COPY: Record<
  Locale,
  {
    title: (role: string | null) => string
    matches: string
    noMatches: string
    unverified: string
    footer: (email: string) => string
  }
> = {
  es: {
    title: (role) =>
      role
        ? `Comparación con la oferta «${role}», solo con lo que consta en el dossier:`
        : "Comparación con la oferta, solo con lo que consta en el dossier:",
    matches: "Requisitos con evidencia (cita literal del dossier):",
    noMatches:
      "Ningún requisito tiene una cita literal del dossier que lo respalde.",
    unverified: "Por confirmar con Jefferson (no consta en el dossier):",
    footer: (email) =>
      `Que algo no conste no significa que no lo tenga, y esto no es una valoración de encaje. Para confirmarlo, escribe a ${email}.`,
  },
  ca: {
    title: (role) =>
      role
        ? `Comparació amb l'oferta «${role}», només amb el que consta al dossier:`
        : "Comparació amb l'oferta, només amb el que consta al dossier:",
    matches: "Requisits amb evidència (cita literal del dossier):",
    noMatches: "Cap requisit té una cita literal del dossier que el sostingui.",
    unverified: "Per confirmar amb Jefferson (no consta al dossier):",
    footer: (email) =>
      `Que una cosa no consti no vol dir que no la tingui, i això no és una valoració d'encaix. Per confirmar-ho, escriu a ${email}.`,
  },
  en: {
    title: (role) =>
      role
        ? `Comparison with the "${role}" offer, using only what the dossier states:`
        : "Comparison with the offer, using only what the dossier states:",
    matches: "Requirements with evidence (verbatim from the dossier):",
    noMatches: "No requirement has a verbatim dossier quote to back it.",
    unverified: "To confirm with Jefferson (not stated in the dossier):",
    footer: (email) =>
      `Something not being stated does not mean he lacks it, and this is not a fit assessment. To confirm, write to ${email}.`,
  },
}

export function renderOfferAnalysis(
  analysis: VerifiedOfferAnalysis,
  locale: Locale,
  email: string
): string {
  const copy = COPY[locale]
  const lines = [copy.title(analysis.role), "", copy.matches]

  if (analysis.matches.length === 0) lines.push(copy.noMatches)
  for (const match of analysis.matches) {
    lines.push(`• ${match.requirement} — “${match.evidence}”`)
  }

  if (analysis.unverified.length > 0) {
    lines.push("", copy.unverified)
    for (const requirement of analysis.unverified) {
      lines.push(`• ${requirement}`)
    }
  }

  lines.push("", copy.footer(email))
  return lines.join("\n")
}
