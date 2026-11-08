import type { SiteContent } from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"
import { profile } from "@/lib/profile"

export type TerminalLink = { text: string; href: string }

/** What the terminal prints, built on the server from the site content. */
export type TerminalData = {
  whoami: ReadonlyArray<string>
  services: ReadonlyArray<string>
  work: ReadonlyArray<TerminalLink>
  how: ReadonlyArray<string>
  availability: ReadonlyArray<string>
  contact: ReadonlyArray<string>
  briefHref: string
  cvHref: string
  otherLanguageHref: string
}

export function buildTerminalData(
  locale: SiteLocale,
  content: SiteContent
): TerminalData {
  const { hero, about, services, work, approach, contact } = content
  const factLine = (fact: { label: string; value: string }) =>
    `${fact.label}: ${fact.value}`

  return {
    whoami: [`${profile.name} — ${hero.role}`, ...about.facts.map(factLine)],
    services: services.items.map(
      (service) => `${service.name} — ${service.summary}`
    ),
    work: work.cases.map((study) => ({
      text: study.title,
      href: localizedPath(locale, `/work/${study.slug}`),
    })),
    how: [
      approach.pipeline.map((stage) => stage.step).join(" → "),
      `${approach.principlesTitle}:`,
      ...approach.principles.map((principle) => `· ${principle.title}`),
    ],
    availability: [
      hero.availability.status,
      ...contact.facts.slice(0, 1).map(factLine),
    ],
    contact: contact.facts.slice(1).map(factLine),
    briefHref: `${localizedPath(locale, "/contact")}#brief`,
    cvHref: localizedPath(locale, "/cv"),
    otherLanguageHref: localizedPath(locale === "en" ? "es" : "en", "/"),
  }
}
