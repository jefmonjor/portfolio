import ca from "@/messages/ca.json"
import es from "@/messages/es.json"
import en from "@/messages/en.json"

import type { Locale } from "@/i18n/routing"
import { profile } from "@/lib/profile"
import {
  CV_TAILOR_KEYWORDS_MAX,
  CV_TAILOR_PROJECTS_MAX,
  CV_TAILOR_REQUIREMENTS_MAX,
  CV_TAILOR_SUMMARY_MAX_CHARS,
  type CvTailorModelOutput,
  type CvTailoredContent,
} from "@/types/cv-tailor"

type TailoringEvidence = {
  readonly keywords: ReadonlyArray<string>
  readonly projectIds: ReadonlyArray<string>
  readonly projects: ReadonlyArray<{
    readonly id: string
    readonly name: string
  }>
}

// The focus sentence is written server-side from canonical facts, so it must
// read like the rest of the summary: what is already evidenced for this role,
// never a claim the profile does not back.
const COPY: Record<Locale, { focus: string }> = {
  ca: {
    focus:
      "Per a aquesta posició, l'evidència més directa es troba en {keywords}{projects}.",
  },
  es: {
    focus:
      "Para esta posición, la evidencia más directa está en {keywords}{projects}.",
  },
  en: {
    focus:
      "For this role, the most direct evidence is in {keywords}{projects}.",
  },
}

function normalize(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("en")
    .replace(/\s+/g, " ")
    .trim()
}

function unique(values: ReadonlyArray<string>): string[] {
  const seen = new Set<string>()
  return values.filter((value) => {
    const key = normalize(value)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function tailoringEvidence(locale: Locale): TailoringEvidence {
  const messages = locale === "es" ? es : locale === "ca" ? ca : en
  const practiceItems = messages.skills.practiceItems
  const skillItems = profile.skills.flatMap((group) =>
    group.id === "practice" ? practiceItems : group.items
  )
  const stackItems = [
    ...profile.experience.flatMap((entry) => entry.stack ?? []),
    ...profile.projects.flatMap((entry) => entry.stack ?? []),
  ]

  return {
    keywords: unique([...profile.focus, ...skillItems, ...stackItems]),
    projectIds: profile.projects.map((project) => project.id),
    projects: profile.projects.map((project) => ({
      id: project.id,
      name:
        (
          messages.projects.entries as Record<string, { readonly name: string }>
        )[project.id]?.name ?? project.id,
    })),
  }
}

function canonicalSelections(
  requested: ReadonlyArray<string>,
  allowed: ReadonlyArray<string>,
  limit: number
): string[] {
  const canonical = new Map(allowed.map((value) => [normalize(value), value]))
  return unique(
    requested
      .map((value) => canonical.get(normalize(value)))
      .filter((value): value is string => value !== undefined)
  ).slice(0, limit)
}

function exactOfferExcerpts(
  requested: ReadonlyArray<string>,
  offer: string
): string[] {
  const searchableOffer = offer.toLocaleLowerCase("en")
  return unique(
    requested
      .map((value) => {
        const excerpt = value.trim()
        const start = searchableOffer.indexOf(excerpt.toLocaleLowerCase("en"))
        return start >= 0
          ? offer.slice(start, start + excerpt.length).trim()
          : undefined
      })
      .filter((value): value is string => value !== undefined)
  ).slice(0, CV_TAILOR_REQUIREMENTS_MAX)
}

export function normalizeTailorModelOutput(
  output: CvTailorModelOutput,
  offer: string,
  locale: Locale
): Omit<CvTailoredContent, "summary"> {
  const evidence = tailoringEvidence(locale)

  return {
    keywords: canonicalSelections(
      output.keywords,
      evidence.keywords,
      CV_TAILOR_KEYWORDS_MAX
    ),
    projectIds: canonicalSelections(
      output.projectIds,
      evidence.projectIds,
      CV_TAILOR_PROJECTS_MAX
    ),
    unverifiedRequirements: exactOfferExcerpts(
      output.unverifiedRequirements,
      offer
    ),
  }
}

function formatList(values: ReadonlyArray<string>, locale: Locale): string {
  return new Intl.ListFormat(locale, {
    style: "long",
    type: "conjunction",
  }).format(values)
}

function truncateAtWord(value: string, maxChars: number): string {
  if (value.length <= maxChars) return value
  const candidate = value.slice(0, Math.max(1, maxChars - 1))
  const boundary = candidate.lastIndexOf(" ")
  return `${candidate.slice(0, boundary > 0 ? boundary : undefined).trim()}…`
}

export function buildTailoredSummary(
  baseSummary: string,
  keywords: ReadonlyArray<string>,
  projectNames: ReadonlyArray<string>,
  locale: Locale
): string {
  if (keywords.length === 0 && projectNames.length === 0) {
    return truncateAtWord(baseSummary.trim(), CV_TAILOR_SUMMARY_MAX_CHARS)
  }

  const keywordText = formatList(keywords.slice(0, 6), locale)
  const evidenceText =
    keywordText ||
    (locale === "en"
      ? "relevant personal projects"
      : locale === "ca"
        ? "projectes propis rellevants"
        : "proyectos propios relevantes")
  const projectText =
    projectNames.length > 0
      ? locale === "en"
        ? `, with personal products such as ${formatList(projectNames.slice(0, 3), locale)}`
        : locale === "ca"
          ? `, amb productes propis com ${formatList(projectNames.slice(0, 3), locale)}`
          : `, con productos propios como ${formatList(projectNames.slice(0, 3), locale)}`
      : ""
  const focus = COPY[locale].focus
    .replace("{keywords}", evidenceText)
    .replace("{projects}", projectText)

  return truncateAtWord(
    `${baseSummary.trim()} ${focus}`,
    CV_TAILOR_SUMMARY_MAX_CHARS
  )
}
