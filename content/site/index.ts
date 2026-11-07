import { en } from "@/content/site/en"
import { es } from "@/content/site/es"
import {
  caseStudySlugs,
  type CaseStudy,
  type CaseStudySlug,
  type ExperienceEntryId,
  type SiteContent,
  type SitePath,
} from "@/content/site/types"
import enMessages from "@/messages/en.json"
import esMessages from "@/messages/es.json"
import type { SiteLocale } from "@/i18n/routing"

export const indexableSitePaths: ReadonlyArray<SitePath> = [
  "/",
  "/services",
  "/work",
  ...caseStudySlugs.map((slug) => `/work/${slug}` as const),
  "/experience",
  "/contact",
  "/privacy",
]

const contentByLocale: Record<SiteLocale, SiteContent> = { en, es }

const experienceByLocale = {
  en: enMessages.experience.entries,
  es: esMessages.experience.entries,
} satisfies Record<SiteLocale, Record<ExperienceEntryId, unknown>>

export type ExperienceEntry = {
  role: string
  location: string
  start: string
  end: string
  summary: string
  highlights: ReadonlyArray<string>
}

export function getSiteContent(locale: SiteLocale): SiteContent {
  return contentByLocale[locale]
}

const currentJobTitleByLocale: Record<SiteLocale, string> = {
  en: enMessages.metadata.currentJobTitle,
  es: esMessages.metadata.currentJobTitle,
}

export function getCurrentJobTitle(locale: SiteLocale): string {
  return currentJobTitleByLocale[locale]
}

export function getExperienceEntry(
  locale: SiteLocale,
  id: ExperienceEntryId
): ExperienceEntry {
  return experienceByLocale[locale][id]
}

export function isCaseStudySlug(value: string): value is CaseStudySlug {
  return caseStudySlugs.some((slug) => slug === value)
}

export function findCaseStudy(
  content: SiteContent,
  slug: CaseStudySlug
): CaseStudy {
  const found = content.work.cases.find((entry) => entry.slug === slug)
  if (!found) throw new Error(`Missing case study content: ${slug}`)
  return found
}

export function caseStudyAfter(
  content: SiteContent,
  slug: CaseStudySlug
): CaseStudy {
  const cases = content.work.cases
  const index = cases.findIndex((entry) => entry.slug === slug)
  return cases[(index + 1) % cases.length] ?? cases[0]
}
