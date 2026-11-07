import { describe, expect, it } from "vitest"

import { profile } from "@/lib/profile"
import type { CvLabels } from "@/server/cv/cv-document"
import { buildMacCv } from "@/server/cv/mac"

const labels: CvLabels = {
  role: "Product Engineer · AI & Backend",
  present: "Present",
  headline: "Product and backend engineering",
  summary: "Canonical professional summary.",
  availability: "Available for part-time work from January 2027",
  contactSubject: "[Portfolio] Contact",
  otherProjects: "Other projects",
  credential: "Verify credential",
  sections: {
    profile: "Profile",
    experience: "Experience",
    skills: "Skills",
    projects: "Projects",
    education: "Education",
    contact: "Contact",
    languages: "Languages",
  },
  skillGroupName: (id) => id,
  experienceEntry: (id) => ({
    role: `Role ${id}`,
    location: "Location",
    start: "2020",
    end: "Present",
    summary: "Canonical experience.",
    highlights: ["Led a canonical migration."],
  }),
  projectEntry: (id) => ({
    name: `Project ${id}`,
    summary: "Canonical project.",
    status: "Live · Public",
  }),
  educationEntry: (id) => ({ title: `Title ${id}`, dates: "2023" }),
  languageEntry: (id) => ({ name: id, level: "Professional" }),
  practiceItems: ["Typed contracts"],
  footer: "Updated",
}

const mac = buildMacCv(labels, "en")
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

describe("MAC export", () => {
  it("fills the sections the schema requires", () => {
    expect(mac.settings.MACVersion).toBe("0.3")
    expect(mac.settings.language).toBe("EN")
    expect(mac.aboutMe.profile.name).toBe("Jefferson")
    expect(mac.aboutMe.profile.surnames).toBe("Montesdeoca Jordán")
    expect(mac.aboutMe.profile.location).toEqual({
      municipality: "Andorra la Vella",
      country: "AD",
    })
    expect(mac.experience.jobs).toHaveLength(profile.experience.length)
    expect(mac.knowledge.studies).toHaveLength(profile.education.length)
  })

  it("publishes unfinished studies as not achieved", () => {
    for (const entry of profile.education) {
      const study = mac.knowledge.studies.find(
        (item) => item.institution.name === entry.organization
      )
      expect(study?.degreeAchieved).toBe(entry.completed)
    }
    expect(
      mac.knowledge.studies.some((study) => study.degreeAchieved === false)
    ).toBe(true)
  })

  it("writes every date as a full yyyy-mm-dd, which the schema never asserts", () => {
    const dates = [
      ...mac.experience.jobs.flatMap((job) =>
        job.roles.flatMap((role) => [
          role.startDate,
          ...("finishDate" in role ? [role.finishDate as string] : []),
        ])
      ),
      ...mac.knowledge.studies.flatMap((study) => [
        study.startDate,
        ...("finishDate" in study ? [study.finishDate as string] : []),
      ]),
    ]

    expect(dates.length).toBeGreaterThan(5)
    for (const date of dates) expect(date).toMatch(ISO_DATE)
  })

  it("leaves the current role open and closes the past ones", () => {
    const current = mac.experience.jobs[0]?.roles[0]
    expect(current?.startDate).toBe("2024-09-01")
    expect(current && "finishDate" in current).toBe(false)
    expect(mac.experience.jobs[1]?.roles[0]).toHaveProperty(
      "finishDate",
      "2024-09-01"
    )
  })

  it("states the location terms a platform filters on, even those defaulting to no", () => {
    const location = mac.careerPreferences.requirements.location

    expect(location.openToRemote).toBe(true)
    expect(location.remoteOnly).toBe(false)
    expect(location.openToRelocate).toBe(true)
  })

  it("offers the part-time engagements the commercial site sells", () => {
    expect(mac.careerPreferences.requirements.contractTypes).toEqual([
      "freelance",
    ])
    expect(mac.careerPreferences.status).toBe("openToOffers")
  })

  it("counts the same seven years the rest of the site states", () => {
    expect(mac.aboutMe.relevantYearsOfExperience).toBe(7)
  })

  it("publishes only public projects, with the short portfolio URL", () => {
    const urls = mac.experience.publicArtifacts.map(
      (artifact) => artifact.details.URL
    )

    expect(urls).toContain("https://jefmonjor.dev")
    expect(urls).not.toContain(undefined)
    expect(mac.experience.publicArtifacts).toHaveLength(
      profile.projects.filter((p) => p.visibility === "public").length
    )
  })

  it("never prints the email: this surface is crawlable too", () => {
    expect(JSON.stringify(mac)).not.toMatch(/@[a-z0-9.-]+\.[a-z]{2,}/i)
  })
})
