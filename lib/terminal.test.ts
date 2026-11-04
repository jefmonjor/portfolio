import { describe, expect, it } from "vitest"

import {
  execute,
  type TerminalData,
  type TerminalStrings,
} from "@/lib/terminal"

const data: TerminalData = {
  name: "Jefferson",
  shortName: "Jefferson",
  role: "Engineer",
  location: "Andorra",
  since: "2019",
  timezone: "CET",
  locale: "es",
  about: "",
  sections: ["about"],
  projects: [],
  experience: [],
  skills: [],
}

const strings: TerminalStrings = {
  notFound: "not found: %s",
  hint: "hint",
  help: [],
  web: [],
  unknownProject: "",
  privateProject: "",
  usageOpen: "",
  usageGoto: "",
  opening: "",
  noEmail: "",
  catTopics: "",
  langAlready: "",
  sudo: "",
  emptyArg: "",
  cvUsage: "usage",
  cvPasteOffer: "paste",
  cvPreparing: "preparing",
  cvDone: "done %s",
  cvError: "",
  cvLimited: "",
  cvUnavailable: "",
  cvOfferTooShort: "",
}

describe("cv command", () => {
  it("downloads the general CV by default", () => {
    expect(execute("cv", data, strings).effects).toEqual([
      { type: "cv", variant: "general" },
    ])
  })

  it("selects the technical variant", () => {
    expect(execute("cv technical", data, strings).effects).toEqual([
      { type: "cv", variant: "technical" },
    ])
    expect(execute("CV ats", data, strings).effects).toEqual([
      { type: "cv", variant: "technical" },
    ])
  })

  it("asks for the offer when none is given, and uses one when it is", () => {
    const prompt = execute("cv tailored", data, strings)
    expect(prompt.effects).toEqual([{ type: "cv-tailor", offer: null }])
    expect(prompt.lines[0].text).toBe("paste")

    const offer = "Backend Engineer with Java and Spring Boot, remote in Europe"
    expect(execute(`cv tailored ${offer}`, data, strings).effects).toEqual([
      { type: "cv-tailor", offer },
    ])
  })

  it("rejects unknown variants", () => {
    const outcome = execute("cv pdf", data, strings)
    expect(outcome.effects).toEqual([])
    expect(outcome.lines[0]).toEqual({ kind: "err", text: "usage" })
  })
})
