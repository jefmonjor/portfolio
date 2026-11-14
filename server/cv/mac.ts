import type { Locale } from "@/i18n/routing"
import { portfolioUpdatedAt, profile, siteUrlShort } from "@/lib/profile"
import type { CvLabels } from "@/server/cv/cv-document"
import { cvLinkHref } from "@/server/cv/links"

// Manfred Awesomic CV schema: https://github.com/getmanfred/mac (draft 2019-09)
const MAC_VERSION = "0.3"

const PREFERRED_ROLES = [
  "Software Architect",
  "Senior Backend Engineer",
  "Fractional Architect",
] as const

function yearsOfExperience(): number {
  const firstStart =
    profile.experience.map((entry) => entry.startISO).sort()[0] ??
    portfolioUpdatedAt
  const months = (iso: string) => {
    const [year = "0", month = "1"] = iso.split("-")
    return Number(year) * 12 + Number(month) - 1
  }
  return Math.floor((months(portfolioUpdatedAt) - months(firstStart)) / 12)
}

function anchorToFirstDay(value: string): string {
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
      relevantYearsOfExperience: yearsOfExperience(),
      relevantLinks: publicProfiles(),
    },
    careerPreferences: {
      status: "openToOffers",
      contact: { publicProfiles: publicProfiles() },
      preferences: { preferredRoles: [...PREFERRED_ROLES] },
      requirements: {
        contractTypes: ["freelance", "permanent"],
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
              startDate: anchorToFirstDay(entry.startISO),
              ...(entry.endISO === "present"
                ? {}
                : { finishDate: anchorToFirstDay(entry.endISO) }),
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
          degreeAchieved: entry.completed,
          name: data.title,
          startDate: anchorToFirstDay(entry.startISO),
          ...(entry.endISO
            ? { finishDate: anchorToFirstDay(entry.endISO) }
            : {}),
          institution: { name: entry.organization },
        }
      }),
    },
  }
}
