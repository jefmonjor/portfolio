import { describe, expect, it } from "vitest"

import { es } from "@/content/site/es"
import { buildTerminalData } from "@/lib/site-console"
import {
  completeTerminalInput,
  runTerminalCommand,
  siteTerminalCommands,
} from "@/lib/site-terminal"

const data = buildTerminalData("es", es)
const strings = es.console.terminal
const run = (input: string) =>
  runTerminalCommand(input, data, strings, "hola@jefmonjor.dev", () => "ahora")

describe("site terminal", () => {
  it("lists every command in help with a description", () => {
    const { lines } = run("help")
    expect(lines[0]?.text).toBe("COMANDOS DISPONIBLES")
    expect(lines).toHaveLength(siteTerminalCommands.length + 1)
    expect(lines.some((line) => line.text.includes("open <producto>"))).toBe(
      true
    )
  })

  it("shows the site address as a mail line in contact", () => {
    const [first] = run("contact").lines
    expect(first).toEqual({ kind: "mail", text: "Email: hola@jefmonjor.dev" })
  })

  it("lists the live products and opens one in a new tab", () => {
    const products = run("projects")
      .lines.map((line) => line.text)
      .join("\n")
    for (const name of ["Transolido", "Ilnami", "Corte1D", "PRONOQ"]) {
      expect(products).toContain(name)
    }
    expect(run("open ilnami").effect).toEqual({
      type: "open",
      href: "https://ilnami.com",
    })
    expect(run("open nada").lines[0]?.kind).toBe("err")
  })

  it("navigates to the brief, the CV and the other language", () => {
    expect(run("brief").effect).toEqual({
      type: "navigate",
      href: "/es/contact#brief",
    })
    expect(run("cv").effect).toEqual({ type: "navigate", href: "/es/cv" })
    expect(run("lang").effect).toEqual({ type: "navigate", href: "/" })
  })

  it("scrolls to home sections and opens the experience page", () => {
    expect(run("goto services").effect).toEqual({
      type: "scroll",
      id: "services",
      fallback: "/es#services",
    })
    expect(run("goto experience").effect).toEqual({
      type: "navigate",
      href: "/es/experience",
    })
  })

  it("sends questions to the assistant and asks for one when missing", () => {
    expect(run("ask ¿cuándo empezamos?").effect).toEqual({
      type: "ask",
      question: "¿cuándo empezamos?",
    })
    expect(run("ask").lines[0]?.text).toBe(strings.askUsage)
  })

  it("explains unknown commands and keeps the easter egg", () => {
    expect(run("rm -rf /").lines[0]?.text).toContain("comando no encontrado")
    expect(run("sudo").lines[0]?.text).toBe(strings.sudo)
  })

  it("completes commands, products and sections with Tab", () => {
    expect(completeTerminalInput("pro", data)).toBe("projects ")
    expect(completeTerminalInput("open tra", data)).toBe("open transolido")
    expect(completeTerminalInput("goto ser", data)).toBe("goto services")
    expect(completeTerminalInput("c", data)).toBeNull()
  })
})
