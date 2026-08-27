import { describe, expect, it } from "vitest"

import type { CvLabels } from "@/server/cv/cv-document"
import { cvFilename, renderCvPdf } from "@/server/cv/render"

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
    role: id,
    location: "Location",
    start: "2020",
    end: "Present",
    summary: "Canonical experience.",
    highlights: ["Canonical highlight."],
  }),
  projectEntry: (id) => ({
    name: id,
    summary: "Canonical project.",
    status: "Live · Public",
  }),
  educationEntry: (id) => ({
    title: id,
    dates: "2023",
  }),
  languageEntry: (id) => ({
    name: id,
    level: "Professional",
  }),
  practiceItems: ["Typed contracts"],
  footer: "Updated",
}

describe("cvFilename", () => {
  // What the recruiter sees attached to the email. The tailored CV must not
  // advertise that it was generated for the offer they published.
  it("names the tailored CV like any other CV", () => {
    expect(cvFilename("Tailored", "es")).toBe("Jefferson_Montesdeoca_CV_ES.pdf")
    expect(cvFilename("Technical", "es")).toBe(
      "Jefferson_Montesdeoca_CV_Technical_ES.pdf"
    )
    expect(cvFilename("General", "en")).toBe(
      "Jefferson_Montesdeoca_CV_General_EN.pdf"
    )
  })
})

describe("renderCvPdf", () => {
  it("renders tailored canonical content as a valid PDF", async () => {
    const buffer = await renderCvPdf({
      variant: "technical",
      labels,
      locale: "en",
      tailored: {
        summary: "Canonical tailored summary.",
        keywords: ["Java 21", "Spring Boot 3"],
        projectIds: ["transolido"],
      },
    })

    expect(buffer.subarray(0, 4).toString()).toBe("%PDF")
    expect(buffer.byteLength).toBeGreaterThan(10_000)
  })
})
