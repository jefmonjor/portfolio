import { describe, expect, it } from "vitest"

import { hasVisibleText, visibleLength } from "@/lib/visible-text"

describe("hasVisibleText", () => {
  it("treats zero-width and whitespace-only input as empty", () => {
    expect(hasVisibleText("​​​")).toBe(false)
    expect(hasVisibleText(" ⁠﻿ \n")).toBe(false)
    expect(hasVisibleText("")).toBe(false)
  })

  it("ignores bidi controls, soft hyphens and blank-looking fillers too", () => {
    for (const invisible of [
      "\u200E",
      "\u200F",
      "\u202E",
      "\u2066",
      "\u00AD",
      "\u3164",
      "\u2061",
      "\u180E",
      "\u034F",
      "\u2800",
    ]) {
      expect(hasVisibleText(invisible.repeat(5))).toBe(false)
    }
  })

  it("counts only the characters a reader can see", () => {
    expect(visibleLength("a\u200Bb c")).toBe(3)
  })

  it("keeps any visible character, emoji included", () => {
    expect(hasVisibleText("CV")).toBe(true)
    expect(hasVisibleText("​👩‍💻")).toBe(true)
  })
})
