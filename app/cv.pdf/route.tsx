import { renderToBuffer } from "@react-pdf/renderer"
import { getTranslations } from "next-intl/server"
import { type NextRequest } from "next/server"

import { profile, portfolioUpdatedAt } from "@/lib/profile"
import { hasLocale } from "next-intl"
import { routing } from "@/i18n/routing"
import {
  CvDocument,
  type CvEducationEntry,
  type CvExperienceEntry,
  type CvLanguageEntry,
  type CvLabels,
  type CvProjectEntry,
} from "@/server/cv/cv-document"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const rawLocale = request.nextUrl.searchParams.get("locale")
  const locale = hasLocale(routing.locales, rawLocale)
    ? rawLocale
    : routing.defaultLocale

  const [tMeta, tHero, tAbout, tCommon, tExperience, tExperienceEntries, tSkills, tSkillsGroups, tProjects, tProjectEntries, tEducation, tEducationEntries, tLanguages, tContact, tFooter] =
    await Promise.all([
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
    ])

  const labels: CvLabels = {
    role: tMeta("role"),
    present: tCommon("present"),
    tagline: tHero("tagline"),
    manifesto: tAbout("manifesto"),
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
      const highlights = tExperienceEntries.raw(
        `${id}.highlights`
      ) as ReadonlyArray<string>
      const rawEnd = profile.experience.find((e) => e.id === id)?.endISO
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
    projectEntry: (id): CvProjectEntry => ({
      name: tProjectEntries(`${id}.name`),
      summary: tProjectEntries(`${id}.summary`),
    }),
    educationEntry: (id): CvEducationEntry => {
      const entry = profile.education.find((e) => e.id === id)
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
    practiceItems: tSkills.raw("practiceItems") as ReadonlyArray<string>,
    footer: tFooter("lastUpdated"),
  }

  const buffer = await renderToBuffer(
    <CvDocument labels={labels} generatedOnISO={portfolioUpdatedAt} />
  )

  const filename = `${profile.shortName.replace(/\s+/g, "_")}_CV_${locale}.pdf`

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  })
}
