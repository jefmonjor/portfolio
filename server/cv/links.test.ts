import { describe, expect, it } from "vitest"

import { profile, siteUrlShort } from "@/lib/profile"
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
