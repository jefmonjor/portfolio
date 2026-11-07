import { getTranslations } from "next-intl/server"

import type { Locale } from "@/i18n/routing"
import { cvContactSubject } from "@/lib/email"
import { parseStringArray } from "@/lib/i18n-values"
import { portfolioUpdatedAt, profile } from "@/lib/profile"
import { CV_HEADINGS } from "@/server/cv/headings"
import type {
  CvEducationEntry,
  CvExperienceEntry,
  CvLabels,
  CvLanguageEntry,
  CvProjectEntry,
} from "@/server/cv/cv-document"

export async function loadCvLabels(locale: Locale): Promise<CvLabels> {
  const [
    tMeta,
    tCv,
    tCommon,
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
  ] = await Promise.all([
    getTranslations({ locale, namespace: "metadata" }),
    getTranslations({ locale, namespace: "cv" }),
    getTranslations({ locale, namespace: "common" }),
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
  ])

  return {
    role: tMeta("role"),
    present: tCommon("present"),
    headline: tCv("headline"),
    summary: tCv("summary"),
    availability: `${tStatus("label")} · ${tStatus("detail")}`,
    contactSubject: cvContactSubject(locale),
    otherProjects: tCv("otherProjects"),
    credential: tEducation("verifyCredential"),
    // Standard headings in every export: the website's editorial titles
    // ("Dónde he trabajado") read worse on paper and parse worse by machine.
    sections: {
      profile: CV_HEADINGS[locale].profile,
      experience: CV_HEADINGS[locale].experience,
      skills: CV_HEADINGS[locale].skills,
      projects: CV_HEADINGS[locale].projects,
      education: CV_HEADINGS[locale].education,
      contact: tContact("title"),
      languages: CV_HEADINGS[locale].languages,
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
        // "Este portfolio" and "el sitio que estás leyendo" only make sense on
        // the site itself; a CV reader needs copy that stands on its own.
        name:
          id === "portfolio"
            ? tCv("portfolioName")
            : tProjectEntries(`${id}.name`),
        summary:
          id === "portfolio"
            ? tCv("portfolioSummary")
            : tProjectEntries(`${id}.summary`),
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
