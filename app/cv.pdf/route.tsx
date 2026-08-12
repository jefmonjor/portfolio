import { renderToBuffer } from "@react-pdf/renderer"
import { getTranslations } from "next-intl/server"
import { type NextRequest } from "next/server"

import { resolveLocale } from "@/i18n/routing"
import { parseStringArray } from "@/lib/i18n-values"
import { profile, portfolioUpdatedAt } from "@/lib/profile"
import {
  CvAtsDocument,
  type CvTailored,
} from "@/server/cv/cv-ats-document"
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

// Tailored content arrives via query params (produced by /api/cv-tailor).
// Capped hard so nobody can stuff arbitrary payloads into the PDF.
const MAX_SUMMARY_CHARS = 900
const MAX_KEYWORDS = 15
const MAX_KEYWORD_CHARS = 40

function parseTailored(params: URLSearchParams): CvTailored | undefined {
  const summary = params.get("summary")?.trim().slice(0, MAX_SUMMARY_CHARS)
  if (!summary) return undefined
  const keywords = (params.get("keywords") ?? "")
    .split("|")
    .map((k) => k.trim().slice(0, MAX_KEYWORD_CHARS))
    .filter(Boolean)
    .slice(0, MAX_KEYWORDS)
  return { summary, keywords }
}

export async function GET(request: NextRequest): Promise<Response> {
  const locale = resolveLocale(request.nextUrl.searchParams.get("locale"))
  const variant =
    request.nextUrl.searchParams.get("variant") === "ats" ? "ats" : "full"
  const tailored =
    variant === "ats"
      ? parseTailored(request.nextUrl.searchParams)
      : undefined

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
  ])
  const [tStatus, tMetrics] = await Promise.all([
    getTranslations({ locale, namespace: "status" }),
    getTranslations({ locale, namespace: "metrics.entries" }),
  ])
  const METRIC_KEYS = ["years", "sectors", "companies", "products"] as const

  const labels: CvLabels = {
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
    practiceItems: parseStringArray(tSkills.raw("practiceItems")),
    footer: tFooter("lastUpdated", { date: portfolioUpdatedAt }),
  }

  const buffer = await renderToBuffer(
    variant === "ats" ? (
      <CvAtsDocument
        labels={labels}
        locale={locale === "en" ? "en" : locale === "ca" ? "ca" : "es"}
        tailored={tailored}
      />
    ) : (
      <CvDocument labels={labels} />
    )
  )

  const suffix = variant === "ats" ? `ATS_${locale}` : locale
  const filename = `${profile.shortName.replace(/\s+/g, "_")}_CV_${suffix}.pdf`

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  })
}
