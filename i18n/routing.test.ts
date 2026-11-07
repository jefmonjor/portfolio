import { describe, expect, it } from "vitest"

import {
  localizedPath,
  nearestSiteLocale,
  samePathInLocale,
} from "@/i18n/routing"

describe("localized paths", () => {
  it("serves English without a prefix and the other languages with one", () => {
    expect(localizedPath("en", "/")).toBe("/")
    expect(localizedPath("en", "/services")).toBe("/services")
    expect(localizedPath("es", "/")).toBe("/es")
    expect(localizedPath("es", "/work/private-bank-modernization")).toBe(
      "/es/work/private-bank-modernization"
    )
    expect(localizedPath("ca", "/cv")).toBe("/ca/cv")
  })

  it("moves the current page to the other language", () => {
    expect(samePathInLocale("/", "es")).toBe("/es")
    expect(samePathInLocale("/es", "en")).toBe("/")
    expect(samePathInLocale("/es/work/x", "en")).toBe("/work/x")
    expect(samePathInLocale("/contact", "es")).toBe("/es/contact")
  })

  it("sends Catalan readers of the CV to the Spanish site", () => {
    expect(nearestSiteLocale("ca")).toBe("es")
    expect(nearestSiteLocale("en")).toBe("en")
  })
})
