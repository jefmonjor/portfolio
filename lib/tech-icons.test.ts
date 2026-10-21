import { readFileSync } from "node:fs"

import * as simpleIcons from "simple-icons"
import { describe, expect, it } from "vitest"

import * as generated from "@/lib/tech-icons.generated"
import { techIconId } from "@/lib/tech-icons"

const source = readFileSync(new URL("./tech-icons.ts", import.meta.url), "utf8")
const mapped = [
  ...new Set([...source.matchAll(/"(si[A-Z]\w*)"/g)].map((match) => match[1])),
].sort()

describe("tech icons", () => {
  it("generates exactly the icons lib/tech-icons.ts maps", () => {
    const exported = Object.keys(generated)
      .filter((name) => name.startsWith("si"))
      .sort()
    expect(exported).toEqual(mapped)
  })

  it("matches the installed simple-icons paths (run `pnpm icons` if not)", () => {
    for (const name of mapped) {
      const upstream = simpleIcons[name as keyof typeof simpleIcons]
      const local = generated[name as keyof typeof generated]
      expect(upstream, name).toMatchObject({
        path: (local as { path: string }).path,
      })
    }
  })

  it("resolves labels through their normalized forms", () => {
    expect(techIconId("Java (8 → 21)")).toBe("siOpenjdk")
    expect(techIconId("Spring Boot 3")).toBe("siSpringboot")
    expect(techIconId("Redis · Upstash")).toBe("siRedis")
    expect(techIconId("Microservices")).toBeNull()
  })
})
