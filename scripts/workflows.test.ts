import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, it } from "vitest"

// The CI configuration is part of the supply chain: these checks keep the
// guarantees it gives from being dropped in a later edit.
const root = join(import.meta.dirname, "..")
const read = (path: string) => readFileSync(join(root, path), "utf8")
const workflowDir = ".github/workflows"
const workflows = readdirSync(join(root, workflowDir)).filter((name) =>
  /\.ya?ml$/.test(name)
)

describe("GitHub configuration", () => {
  it("pins every action to a full commit SHA", () => {
    for (const name of workflows) {
      const uses = [...read(join(workflowDir, name)).matchAll(/uses:\s*(\S+)/g)]
      for (const [, action] of uses) {
        expect(action, `${name}: ${action}`).toMatch(/@[0-9a-f]{40}$/)
      }
    }
  })

  it("gives the CI token read-only access to the repository", () => {
    expect(read(join(workflowDir, "ci.yml"))).toMatch(
      /^permissions:\n {2}contents: read$/m
    )
  })

  it("fails CI on a high advisory in production dependencies", () => {
    expect(read(join(workflowDir, "ci.yml"))).toMatch(
      /run: pnpm audit --prod --audit-level=high$/m
    )
  })

  it("has Dependabot watch npm weekly and the actions monthly", () => {
    expect(existsSync(join(root, ".github/dependabot.yml"))).toBe(true)
    const config = read(".github/dependabot.yml")
    expect(config).toMatch(
      /package-ecosystem: npm\n\s+directory: \/\n\s+schedule:\n\s+interval: weekly/
    )
    expect(config).toMatch(/dependency-type: development/)
    expect(config).toMatch(
      /package-ecosystem: github-actions\n\s+directory: \/\n\s+schedule:\n\s+interval: monthly/
    )
  })
})
