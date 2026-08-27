import type { Locale } from "@/i18n/routing"
import { portfolioUpdatedAt, profile, siteUrlShort } from "@/lib/profile"
import type { CvLabels } from "@/server/cv/cv-document"
import { cvLinkHref } from "@/server/cv/links"

// MAC — Manfred Awesomic CV: an open JSON schema for CVs, used as an
// interchange format by recruiting platforms. Built from the same labels as
// the PDF and Markdown CVs, so there is still one source of truth.
// Schema: https://github.com/getmanfred/mac (draft 2019-09).
//
// The email stays out, as in every crawlable surface: MAC contacts a person
// through public profiles, which is exactly what lib/email.ts wants.

const MAC_VERSION = "0.3"

const RELEVANT_YEARS = 6

const PREFERRED_ROLES = [
  "Product Engineer",
  "Backend Engineer",
  "Software Architect",
] as const

// MAC dates are `format: date`, so month- and year-only facts anchor to the
// first day. The profile keeps the precision it actually has.
function macDate(value: string): string {
  const parts = value.split("-")
  const year = parts[0] ?? "1970"
  const month = parts[1] ?? "01"
  const day = parts[2] ?? "01"
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
}

const COUNTRY_CODES: Record<string, string> = {
  Andorra: "AD",
  Spain: "ES",
}

function macLocation(location: string): {
  country?: string
  municipality?: string
} {
  const [municipality, country] = location.split(", ")
  return {
    ...(municipality ? { municipality } : {}),
    ...(country ? { country: COUNTRY_CODES[country] ?? country } : {}),
  }
}

type MacCompetence = {
  readonly name: string
  readonly type: "technology" | "tool" | "practice" | "domain" | "hardware"
}

// The AI group is tooling; the rest are technologies. Practices are named as
// such by the schema, so they keep their own type instead of posing as stack.
function competenceType(groupId: string): MacCompetence["type"] {
  if (groupId === "practice") return "practice"
  if (groupId === "ai") return "tool"
  return "technology"
}

function publicProfiles() {
  const linkedin = profile.socials.find((s) => s.kind === "linkedin")
  const github = profile.socials.find((s) => s.kind === "github")
  return [
    ...(linkedin ? [{ type: "linkedin" as const, URL: linkedin.href }] : []),
    ...(github ? [{ type: "github" as const, URL: github.href }] : []),
    { type: "website" as const, URL: siteUrlShort },
  ]
}

export function buildMacCv(labels: CvLabels, locale: Locale) {
  const [name, ...surnames] = profile.name.split(" ")

  return {
    settings: {
      MACVersion: MAC_VERSION,
      language: locale.toUpperCase(),
      lastUpdate: portfolioUpdatedAt,
    },
    aboutMe: {
      profile: {
        name,
        surnames: surnames.join(" "),
        title: labels.role,
        description: labels.summary,
        location: macLocation(profile.location),
        contact: { publicProfiles: publicProfiles() },
      },
      relevantYearsOfExperience: RELEVANT_YEARS,
      relevantLinks: publicProfiles(),
    },
    careerPreferences: {
      status: "openToOffers",
      contact: { publicProfiles: publicProfiles() },
      preferences: { preferredRoles: [...PREFERRED_ROLES] },
      requirements: {
        // Employment only. The schema also allows "freelance"; that is not
        // what is on offer, and saying so is the point of listing it.
        contractTypes: ["permanent"],
        location: {
          openToRemote: true,
          remoteOnly: false,
          openToRelocate: true,
          comments: labels.availability,
        },
      },
    },
    experience: {
      jobs: profile.experience.map((entry) => {
        const data = labels.experienceEntry(entry.id)
        return {
          type: entry.organizationType,
          organization: {
            name: entry.organization,
            location: macLocation(entry.location),
          },
          roles: [
            {
              name: data.role,
              startDate: macDate(entry.startISO),
              ...(entry.endISO === "present"
                ? {}
                : { finishDate: macDate(entry.endISO) }),
              ...(data.summary ? { notes: data.summary } : {}),
              challenges: data.highlights.map((highlight) => ({
                description: highlight,
              })),
              competences: (entry.stack ?? []).map((tech) => ({
                name: tech,
                type: "technology" as const,
              })),
            },
          ],
        }
      }),
      // Personal products ship as public artifacts: unlike MAC project roles,
      // they carry no start date the profile could honestly state.
      publicArtifacts: profile.projects
        .filter((project) => project.visibility === "public" && project.url)
        .map((project) => {
          const data = labels.projectEntry(project.id)
          return {
            type: "sideProject",
            details: {
              name: data.name,
              description: data.summary,
              URL: cvLinkHref(project.url as string),
            },
            relatedCompetences: (project.stack ?? []).map((tech) => ({
              name: tech,
              type: "technology" as const,
            })),
          }
        }),
    },
    knowledge: {
      hardSkills: profile.skills.flatMap((group) =>
        (group.id === "practice" ? labels.practiceItems : group.items).map(
          (item) => ({
            skill: { name: item, type: competenceType(group.id) },
          })
        )
      ),
      languages: profile.languages.map((language) => {
        const data = labels.languageEntry(language.id)
        return {
          name: language.code,
          fullName: data.name,
          level: language.level,
        }
      }),
      studies: profile.education.map((entry) => {
        const data = labels.educationEntry(entry.id)
        return {
          studyType:
            entry.kind === "degree" ? "officialDegree" : "certification",
          // A study that was attended but never completed must not be
          // published as achieved.
          degreeAchieved: entry.completed,
          name: data.title,
          startDate: macDate(entry.startISO),
          ...(entry.endISO ? { finishDate: macDate(entry.endISO) } : {}),
          institution: { name: entry.organization },
        }
      }),
    },
  }
}
