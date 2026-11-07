import { describe, expect, it } from "vitest"

import { hasVisibleText } from "@/lib/visible-text"

describe("hasVisibleText", () => {
  it("treats zero-width and whitespace-only input as empty", () => {
    expect(hasVisibleText("​​​")).toBe(false)
    expect(hasVisibleText(" ⁠﻿ \n")).toBe(false)
    expect(hasVisibleText("")).toBe(false)
  })

  it("keeps any visible character, emoji included", () => {
    expect(hasVisibleText("CV")).toBe(true)
    expect(hasVisibleText("​👩‍💻")).toBe(true)
  })
})
