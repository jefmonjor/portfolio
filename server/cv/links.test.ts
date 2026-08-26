import { describe, expect, it } from "vitest"

import { profile, siteUrlShort } from "@/lib/profile"
import { TECHNICAL_PROJECT_IDS } from "@/server/cv/cv-ats-document"
import { cvLinkHref, cvLinkLabel } from "@/server/cv/links"

describe("CV links", () => {
  it("prints the portfolio with its short apex URL", () => {
    const portfolio = profile.projects.find(
      (project) => project.id === "portfolio"
    )

    expect(portfolio?.url).toBeTruthy()
    expect(cvLinkHref(portfolio!.url!)).toBe(siteUrlShort)
    expect(cvLinkLabel(portfolio!.url!)).toBe("jefmonjor.dev")
  })

  it("keeps external project URLs untouched and strips their scheme", () => {
    expect(cvLinkHref("https://transolido.com")).toBe("https://transolido.com")
    expect(cvLinkLabel("https://transolido.com")).toBe("transolido.com")
    expect(cvLinkLabel("https://corte1d.jefmonjor.dev/")).toBe(
      "corte1d.jefmonjor.dev"
    )
  })
})

describe("technical CV project list", () => {
  it("lists every public product, so none is dropped silently", () => {
    const published = profile.projects
      .filter((project) => project.visibility === "public")
      .map((project) => project.id)

    for (const id of published) expect(TECHNICAL_PROJECT_IDS).toContain(id)
    expect(TECHNICAL_PROJECT_IDS).toContain("contactqr")
  })

  it("gives each listed public product an openable URL", () => {
    for (const id of TECHNICAL_PROJECT_IDS) {
      const project = profile.projects.find((entry) => entry.id === id)
      expect(project, `unknown project id: ${id}`).toBeDefined()
      if (project?.visibility === "public") {
        expect(cvLinkHref(project.url as string)).toMatch(/^https:\/\//)
      }
    }
  })
})
