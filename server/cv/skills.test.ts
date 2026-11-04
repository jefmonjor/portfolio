import { describe, expect, it } from "vitest"

import { profile } from "@/lib/profile"
import { evidencedSkillGroups } from "@/server/cv/skills"

describe("evidencedSkillGroups", () => {
  const groups = evidencedSkillGroups(
    profile.projects.filter((p) => p.stage === "live").map((p) => p.id)
  )
  const items = groups.flatMap((group) => group.items)

  it("keeps what the jobs and the named products were built with", () => {
    expect(items).toContain("Java (8 → 21)")
    expect(items).toContain("Spring Boot 3")
    expect(items).toContain("Hexagonal Architecture")
    expect(items).toContain("Go")
    expect(items).toContain("Google Cloud Run")
    expect(items).toContain("Redis · Upstash")
    expect(items).toContain("Claude Code")
    expect(items).toContain("Gemini Code Assist")
    expect(items).toContain("TypeScript")
    expect(items).toContain("Docker")
  })

  it("drops catalogue entries nothing in the document backs", () => {
    expect(items).not.toContain("Python")
    expect(items).not.toContain("Jenkins")
    expect(items).not.toContain("Vercel AI SDK")
    expect(items).not.toContain("Orca")
    expect(groups.map((group) => group.id)).not.toContain("practice")
  })
})
