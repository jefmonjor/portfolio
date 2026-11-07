import {
  BACKGROUND_VARIANTS,
  isBackgroundVariant,
  type BackgroundVariant,
} from "@/lib/background"
import type { CvPdfVariantName } from "@/lib/cv-pdf"
import { visibleLength } from "@/lib/visible-text"
import { CV_TAILOR_OFFER_MIN_CHARS } from "@/types/limits"

export type TerminalLineKind = "in" | "out" | "err" | "ok" | "muted" | "head"

export type TerminalOutLine = {
  kind: TerminalLineKind
  text: string
}

type OfferOrCaptureFromNextPrompt = string | null

export type TerminalEffect =
  | { type: "clear" }
  | { type: "close" }
  | { type: "cv"; variant: CvPdfVariantName }
  | { type: "cv-tailor"; offer: OfferOrCaptureFromNextPrompt }
  | { type: "theme"; value: "dark" | "light" | null }
  | { type: "lang"; value: "en" | "es" | "ca" }
  | { type: "bg"; value: BackgroundVariant }
  | { type: "open"; href: string }
  | { type: "goto"; section: string }

export type TerminalOutcome = {
  lines: TerminalOutLine[]
  effects: TerminalEffect[]
}

export type TerminalData = {
  name: string
  shortName: string
  role: string
  location: string
  since: string
  timezone: string
  locale: "en" | "es" | "ca"
  email?: string
  linkedin?: string
  about: string
  sections: ReadonlyArray<string>
  projects: ReadonlyArray<{
    id: string
    name: string
    summary: string
    url?: string
  }>
  experience: ReadonlyArray<{
    org: string
    role: string
    dates: string
    summary: string
  }>
  skills: ReadonlyArray<{ group: string; items: ReadonlyArray<string> }>
}

export type TerminalStrings = {
  notFound: string
  hint: string
  help: ReadonlyArray<string>
  web: ReadonlyArray<string>
  unknownProject: string
  privateProject: string
  usageOpen: string
  usageGoto: string
  opening: string
  noEmail: string
  catTopics: string
  langAlready: string
  sudo: string
  emptyArg: string
  cvUsage: string
  cvPasteOffer: string
  cvPreparing: string
  cvDone: string
  cvError: string
  cvLimited: string
  cvUnavailable: string
  cvOfferTooShort: string
}

export const TERMINAL_OFFER_MIN_CHARS = CV_TAILOR_OFFER_MIN_CHARS

const CV_GENERAL = new Set(["", "general", "g"])
const CV_TECHNICAL = new Set([
  "technical",
  "tech",
  "ats",
  "t",
  "tecnico",
  "técnico",
  "tècnic",
])
const CV_TAILORED = new Set([
  "tailored",
  "tailor",
  "offer",
  "oferta",
  "adaptado",
  "adaptat",
  "a",
])

const COMMANDS = [
  "help",
  "whoami",
  "ls",
  "projects",
  "open",
  "cat",
  "experience",
  "skills",
  "contact",
  "cv",
  "web",
  "theme",
  "lang",
  "bg",
  "goto",
  "echo",
  "sudo",
  "date",
  "clear",
  "exit",
] as const

function format(template: string, value: string): string {
  return template.replace("%s", value)
}

function out(text: string, kind: TerminalLineKind = "out"): TerminalOutLine {
  return { kind, text }
}

function findProject(
  data: TerminalData,
  query: string
): TerminalData["projects"][number] | undefined {
  const q = query.toLowerCase()
  return data.projects.find(
    (p) => p.id.toLowerCase() === q || p.name.toLowerCase() === q
  )
}

function projectList(data: TerminalData): TerminalOutLine[] {
  return data.projects.map((p, i) => {
    const tag = p.url ? p.url.replace(/^https?:\/\/(www\.)?/, "") : "·private"
    const index = String(i + 1).padStart(2, "0")
    return out(`${index}  ${p.name.padEnd(28)} ${tag}`)
  })
}

export function execute(
  raw: string,
  data: TerminalData,
  t: TerminalStrings
): TerminalOutcome {
  const input = raw.trim()
  if (input.length === 0) return { lines: [], effects: [] }

  const [command, ...rest] = input.split(/\s+/)
  const arg = rest.join(" ")
  const cmd = command.toLowerCase()

  switch (cmd) {
    case "help":
      return { lines: t.help.map((line) => out(line)), effects: [] }

    case "whoami":
      return {
        lines: [
          out(data.name, "head"),
          out(`${data.role} · ${data.location}`),
          out(`since ${data.since} · ${data.timezone}`, "muted"),
        ],
        effects: [],
      }

    case "ls":
      if (arg === "projects" || arg === "project") {
        return { lines: projectList(data), effects: [] }
      }
      return {
        lines: [out(data.sections.join("   "))],
        effects: [],
      }

    case "projects":
      return { lines: projectList(data), effects: [] }

    case "open": {
      if (!arg) return { lines: [out(t.usageOpen, "err")], effects: [] }
      const project = findProject(data, arg)
      if (!project)
        return {
          lines: [out(format(t.unknownProject, arg), "err")],
          effects: [],
        }
      if (!project.url)
        return {
          lines: [out(format(t.privateProject, project.name), "err")],
          effects: [],
        }
      return {
        lines: [out(format(t.opening, project.name), "ok")],
        effects: [{ type: "open", href: project.url }],
      }
    }

    case "cat": {
      const topic = arg.toLowerCase()
      if (!topic) return { lines: [out(t.catTopics, "muted")], effects: [] }
      if (topic === "about" || topic === "about.txt")
        return { lines: [out(data.about)], effects: [] }
      if (topic === "experience" || topic === "xp")
        return {
          lines: data.experience.flatMap((e) => [
            out(`${e.role} @ ${e.org}`, "head"),
            out(e.dates, "muted"),
            out(e.summary),
            out(""),
          ]),
          effects: [],
        }
      if (topic === "skills")
        return {
          lines: data.skills.map((s) =>
            out(`${s.group.padEnd(14)} ${s.items.join(", ")}`)
          ),
          effects: [],
        }
      if (topic === "contact")
        return {
          lines: [
            out(data.email ? `email     ${data.email}` : t.noEmail),
            ...(data.linkedin ? [out(`linkedin  ${data.linkedin}`)] : []),
          ],
          effects: [],
        }
      const project = findProject(data, topic)
      if (project)
        return {
          lines: [
            out(project.name, "head"),
            out(project.summary),
            ...(project.url ? [out(project.url, "muted")] : []),
          ],
          effects: [],
        }
      return { lines: [out(t.catTopics, "muted")], effects: [] }
    }

    case "experience":
      return {
        lines: data.experience.map((e) =>
          out(`${e.dates.padEnd(20)} ${e.role} @ ${e.org}`)
        ),
        effects: [],
      }

    case "skills":
      return {
        lines: data.skills.map((s) =>
          out(`${s.group.padEnd(14)} ${s.items.join(", ")}`)
        ),
        effects: [],
      }

    case "contact":
      return {
        lines: [
          out(data.email ? `email     ${data.email}` : t.noEmail),
          ...(data.linkedin ? [out(`linkedin  ${data.linkedin}`)] : []),
        ],
        effects: [{ type: "goto", section: "contact" }],
      }

    case "web":
    case "ai":
    case "ia":
      return {
        lines: t.web.map((line, i) => out(line, i === 0 ? "head" : "out")),
        effects: [],
      }

    case "cv":
    case "resume": {
      const [variant = "", ...offerWords] = rest
      const kind = variant.toLowerCase()
      if (CV_GENERAL.has(kind))
        return {
          lines: [out(`cv general → ${t.cvPreparing}`, "ok")],
          effects: [{ type: "cv", variant: "general" }],
        }
      if (CV_TECHNICAL.has(kind))
        return {
          lines: [out(`cv technical → ${t.cvPreparing}`, "ok")],
          effects: [{ type: "cv", variant: "technical" }],
        }
      if (CV_TAILORED.has(kind)) {
        const offer = offerWords.join(" ").trim()
        if (visibleLength(offer) >= TERMINAL_OFFER_MIN_CHARS)
          return {
            lines: [out(`cv tailored → ${t.cvPreparing}`, "ok")],
            effects: [{ type: "cv-tailor", offer }],
          }
        return {
          lines: [out(t.cvPasteOffer, "muted")],
          effects: [{ type: "cv-tailor", offer: null }],
        }
      }
      return { lines: [out(t.cvUsage, "err")], effects: [] }
    }

    case "theme": {
      const value = arg.toLowerCase()
      if (value === "dark" || value === "light")
        return {
          lines: [out(`theme → ${value}`, "ok")],
          effects: [{ type: "theme", value }],
        }
      return {
        lines: [out("theme → toggle", "ok")],
        effects: [{ type: "theme", value: null }],
      }
    }

    case "lang": {
      const value = arg.toLowerCase()
      if (value !== "en" && value !== "es" && value !== "ca")
        return { lines: [out("usage: lang <en|es|ca>", "err")], effects: [] }
      if (value === data.locale)
        return { lines: [out(t.langAlready, "muted")], effects: [] }
      return {
        lines: [out(`lang → ${value}`, "ok")],
        effects: [{ type: "lang", value }],
      }
    }

    case "bg": {
      const value = arg.toLowerCase()
      if (!isBackgroundVariant(value))
        return {
          lines: [out(`usage: bg <${BACKGROUND_VARIANTS.join("|")}>`, "err")],
          effects: [],
        }
      return {
        lines: [out(`background → ${value}`, "ok")],
        effects: [{ type: "bg", value }],
      }
    }

    case "goto": {
      const section = arg.toLowerCase()
      if (!data.sections.includes(section))
        return {
          lines: [out(format(t.usageGoto, data.sections.join(", ")), "err")],
          effects: [],
        }
      return {
        lines: [out(format(t.opening, `#${section}`), "ok")],
        effects: [{ type: "goto", section }, { type: "close" }],
      }
    }

    case "echo":
      return { lines: [out(arg || t.emptyArg)], effects: [] }

    case "sudo":
      return { lines: [out(t.sudo, "muted")], effects: [] }

    case "date":
      return {
        lines: [out(new Date().toString())],
        effects: [],
      }

    case "clear":
    case "cls":
      return { lines: [], effects: [{ type: "clear" }] }

    case "exit":
    case "quit":
      return { lines: [], effects: [{ type: "close" }] }

    default:
      return {
        lines: [out(format(t.notFound, command), "err"), out(t.hint, "muted")],
        effects: [],
      }
  }
}

export function completions(prefix: string): string[] {
  const p = prefix.toLowerCase()
  return COMMANDS.filter((c) => c.startsWith(p))
}
