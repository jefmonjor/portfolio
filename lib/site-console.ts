import { headlineText, type SiteContent } from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"
import { profile } from "@/lib/profile"
import { siteProducts } from "@/lib/site-products"
import type { TerminalData } from "@/lib/site-terminal"

const skillLabels: Record<SiteLocale, Record<string, string>> = {
  en: {
    languages: "Languages",
    backend: "Backend",
    frontend: "Frontend",
    data: "Data",
    cloud: "Cloud and DevOps",
    ai: "AI",
  },
  es: {
    languages: "Lenguajes",
    backend: "Backend",
    frontend: "Frontend",
    data: "Datos",
    cloud: "Cloud y DevOps",
    ai: "IA",
  },
}

export function buildTerminalData(
  locale: SiteLocale,
  content: SiteContent
): TerminalData {
  const { hero, about, services, work, approach, experience, contact, nav } =
    content
  const factLine = (fact: { label: string; value: string }) =>
    `${fact.label}: ${fact.value}`

  return {
    whoami: [
      `${profile.name} — ${hero.role}`,
      ...about.facts.map(factLine),
      hero.availability.status,
    ],
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
      ...approach.principles.map((principle) => `  · ${principle.title}`),
    ],
    experience: experience.groups.map(
      (group) =>
        `${group.period.padEnd(20)}${group.organization} — ${group.role}`
    ),
    skills: profile.skills.flatMap((group) => {
      const label = skillLabels[locale][group.id]
      return label
        ? [`${label.padEnd(18)}${group.items.slice(0, 7).join(", ")}`]
        : []
    }),
    availability: [
      hero.availability.status,
      ...contact.facts.slice(0, 1).map(factLine),
    ],
    contact: contact.facts.slice(1).map(factLine),
    products: siteProducts(locale).map((product) => ({
      id: product.id,
      name: product.name,
      what: product.kind,
      href: product.href,
    })),
    sections: [
      { id: "connect", label: headlineText(content.display.connect) },
      { id: "approach", label: headlineText(content.display.approach) },
      { id: "work", label: nav.work },
      { id: "services", label: nav.services },
      { id: "about", label: headlineText(content.display.about) },
      { id: "experience", label: nav.experience },
      { id: "contact", label: nav.contact },
    ],
    homeHref: localizedPath(locale, "/"),
    briefHref: `${localizedPath(locale, "/contact")}#brief`,
    cvHref: localizedPath(locale, "/cv"),
    otherLanguageHref: localizedPath(locale === "en" ? "es" : "en", "/"),
  }
}
