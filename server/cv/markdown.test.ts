import { describe, expect, it } from "vitest"

import type { CvLabels } from "@/server/cv/cv-document"
import { buildCvMarkdown } from "@/server/cv/markdown"

const labels: CvLabels = {
  role: "Product Engineer · AI & Backend",
  present: "Present",
  headline: "Product and backend engineering",
  summary: "Canonical professional summary.",
  availability: "Selectively open to relevant opportunities",
  metrics: [],
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

describe("Markdown CV", () => {
  const markdown = buildCvMarkdown(labels, "en")

  it("publishes the whole CV as headed plain text", () => {
    expect(markdown).toContain("# Jefferson Montesdeoca Jordán")
    expect(markdown).toContain("## Professional Summary")
    expect(markdown).toContain("## Professional Experience")
    expect(markdown).toContain("## Personal Projects")
    expect(markdown).toContain("Canonical professional summary.")
    expect(markdown).toContain("Led a canonical migration.")
    expect(markdown).toContain("https://jefmonjor.dev")
  })

  it("never prints the email: this surface is crawlable plain text", () => {
    expect(markdown).not.toMatch(/@[a-z0-9.-]+\.[a-z]{2,}/i)
    expect(markdown).toContain("#contact")
  })
})
