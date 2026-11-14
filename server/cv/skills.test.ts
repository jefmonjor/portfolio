import { describe, expect, it } from "vitest"

import { profile } from "@/lib/profile"
import { evidencedSkillGroups } from "@/server/cv/skills"

const cvProjectIds = profile.projects.map((project) => project.id)
const listed = profile.skills
  .filter((group) => group.id !== "practice")
  .flatMap((group) => group.items)

describe("the skills the CV lists", () => {
  const groups = evidencedSkillGroups(cvProjectIds)
  const evidenced = groups.flatMap((group) => group.items)

  it("are all backed by a job or a product he built", () => {
    expect(listed.filter((skill) => !evidenced.includes(skill))).toEqual([])
  })

  it("stay a short list in four blocks, not a catalogue", () => {
    expect(groups.map((group) => group.id)).toEqual([
      "backend",
      "data",
      "cloud",
      "ai",
    ])
    expect(listed.length).toBeLessThanOrEqual(20)
  })

  it("leave out tools with no experience behind them", () => {
    for (const tool of ["Bootstrap", "WordPress", "Jenkins", "Azure"]) {
      expect(listed).not.toContain(tool)
    }
  })
})
