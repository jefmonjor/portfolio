import { describe, expect, it } from "vitest"

import { cvProjectIds, profile, siteUrlShort } from "@/lib/profile"
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
    expect(cvLinkHref("https://www.transolido.com")).toBe(
      "https://www.transolido.com"
    )
    expect(cvLinkLabel("https://www.transolido.com")).toBe("transolido.com")
    expect(cvLinkLabel("https://corte1d.jefmonjor.dev/")).toBe(
      "corte1d.jefmonjor.dev"
    )
  })
})

describe("CV project list", () => {
  it("shows four products, and the portfolio is not one of them", () => {
    expect(cvProjectIds).toHaveLength(4)
    expect(cvProjectIds).not.toContain("portfolio")
  })

  it("gives each listed product an openable URL", () => {
    for (const id of cvProjectIds) {
      const project = profile.projects.find((entry) => entry.id === id)
      expect(project, `unknown project id: ${id}`).toBeDefined()
      expect(cvLinkHref(project?.url as string)).toMatch(/^https:\/\//)
    }
  })
})
