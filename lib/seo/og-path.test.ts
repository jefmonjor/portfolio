import { describe, expect, it } from "vitest"

import { ogImagePath, ogPageFromSegments } from "@/lib/seo/og-path"

describe("Open Graph image paths", () => {
  it("serves each page's card from a stable, prefix-free PNG URL", () => {
    expect(ogImagePath("en", "/")).toBe("/og/en/home.png")
    expect(ogImagePath("es", "/services")).toBe("/og/es/services.png")
    expect(ogImagePath("en", "/work/ilnami-private-by-design")).toBe(
      "/og/en/work/ilnami-private-by-design.png"
    )
    expect(ogImagePath("ca", "/cv")).toBe("/og/ca/cv.png")
  })

  it("reads the page back from the URL segments", () => {
    expect(ogPageFromSegments(["home.png"])).toBe("/")
    expect(ogPageFromSegments(["work", "ilnami-private-by-design.png"])).toBe(
      "/work/ilnami-private-by-design"
    )
  })
})
