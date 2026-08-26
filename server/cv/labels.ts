import { getTranslations } from "next-intl/server"

import type { Locale } from "@/i18n/routing"
import { parseStringArray } from "@/lib/i18n-values"
import { portfolioUpdatedAt, profile } from "@/lib/profile"
import type {
  CvEducationEntry,
  CvExperienceEntry,
  CvLabels,
  CvLanguageEntry,
  CvProjectEntry,
} from "@/server/cv/cv-document"

const METRIC_KEYS = ["years", "sectors", "companies", "products"] as const

export async function loadCvLabels(locale: Locale): Promise<CvLabels> {
  const [
    tMeta,
    tHero,
    tAbout,
    tCommon,
    tExperience,
    tExperienceEntries,
    tSkills,
    tSkillsGroups,
    tProjects,
    tProjectEntries,
    tEducation,
    tEducationEntries,
    tLanguages,
    tContact,
    tFooter,
    tStatus,
    tMetrics,
  ] = await Promise.all([
    getTranslations({ locale, namespace: "metadata" }),
    getTranslations({ locale, namespace: "hero" }),
    getTranslations({ locale, namespace: "about" }),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "experience" }),
    getTranslations({ locale, namespace: "experience.entries" }),
    getTranslations({ locale, namespace: "skills" }),
    getTranslations({ locale, namespace: "skills.groups" }),
    getTranslations({ locale, namespace: "projects" }),
    getTranslations({ locale, namespace: "projects.entries" }),
    getTranslations({ locale, namespace: "education" }),
    getTranslations({ locale, namespace: "education.entries" }),
    getTranslations({ locale, namespace: "education.languageEntries" }),
    getTranslations({ locale, namespace: "contact" }),
    getTranslations({ locale, namespace: "footer" }),
    getTranslations({ locale, namespace: "status" }),
    getTranslations({ locale, namespace: "metrics.entries" }),
  ])

  return {
    role: tMeta("role"),
    present: tCommon("present"),
    tagline: tHero("tagline"),
    manifesto: tAbout("manifesto"),
    availability: `${tStatus("label")} · ${tStatus("detail")}`,
    metrics: METRIC_KEYS.map((key) => ({
      value: tMetrics(`${key}.value`),
      label: tMetrics(`${key}.label`),
    })),
    sections: {
      profile: tHero("indexLabel"),
      experience: tExperience("title"),
      skills: tSkills("title"),
      projects: tProjects("title"),
      education: tEducation("title"),
      contact: tContact("title"),
      languages: tEducation("languagesLabel"),
    },
    skillGroupName: (id) => tSkillsGroups(id),
    experienceEntry: (id): CvExperienceEntry => {
      const highlights = parseStringArray(
        tExperienceEntries.raw(`${id}.highlights`)
      )
      const rawEnd = profile.experience.find((entry) => entry.id === id)?.endISO
      const end =
        rawEnd === "present"
          ? tCommon("present")
          : tExperienceEntries(`${id}.end`)
      return {
        role: tExperienceEntries(`${id}.role`),
        location: tExperienceEntries(`${id}.location`),
        start: tExperienceEntries(`${id}.start`),
        end,
        summary: tExperienceEntries(`${id}.summary`),
        highlights,
      }
    },
    projectEntry: (id): CvProjectEntry => {
      const project = profile.projects.find((entry) => entry.id === id)
      return {
        name: tProjectEntries(`${id}.name`),
        summary: tProjectEntries(`${id}.summary`),
        status: project
          ? `${tProjects(`status.${project.stage}`)} · ${tProjects(`status.${project.visibility}`)}`
          : "",
      }
    },
    educationEntry: (id): CvEducationEntry => {
      const entry = profile.education.find((item) => item.id === id)
      return {
        title: tEducationEntries(`${id}.title`),
        dates: tEducationEntries(`${id}.dates`),
        location: entry?.location,
      }
    },
    languageEntry: (id): CvLanguageEntry => ({
      name: tLanguages(`${id}.name`),
      level: tLanguages(`${id}.level`),
    }),
    practiceItems: parseStringArray(tSkills.raw("practiceItems")),
    footer: tFooter("lastUpdated", { date: portfolioUpdatedAt }),
  }
}
