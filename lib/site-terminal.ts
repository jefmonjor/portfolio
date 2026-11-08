export const siteTerminalCommands = [
  "help",
  "whoami",
  "ls",
  "projects",
  "open",
  "cat",
  "services",
  "work",
  "how",
  "experience",
  "skills",
  "availability",
  "contact",
  "mail",
  "brief",
  "cv",
  "ask",
  "theme",
  "lang",
  "goto",
  "date",
  "clear",
  "exit",
] as const

export type SiteTerminalCommand = (typeof siteTerminalCommands)[number]

const hiddenAliases: Record<string, SiteTerminalCommand | "sudo" | "echo"> = {
  quit: "exit",
  cls: "clear",
  ai: "how",
  ia: "how",
  sudo: "sudo",
  echo: "echo",
}

export type TerminalLine =
  | { kind: "in" | "out" | "head" | "muted" | "err" | "mail"; text: string }
  | { kind: "link"; text: string; href: string; external?: boolean }

export type TerminalEffect =
  | { type: "navigate"; href: string }
  | { type: "open"; href: string }
  | { type: "mail" }
  | { type: "theme"; value?: "dark" | "light" }
  | { type: "scroll"; id: string; fallback: string }
  | { type: "ask"; question: string }
  | { type: "clear" }
  | { type: "close" }

export type TerminalResult = {
  lines: ReadonlyArray<TerminalLine>
  effect?: TerminalEffect
}

export type TerminalProduct = {
  id: string
  name: string
  what: string
  href?: string
}

/** What the terminal knows, built on the server from the site content. */
export type TerminalData = {
  whoami: ReadonlyArray<string>
  services: ReadonlyArray<string>
  work: ReadonlyArray<{ text: string; href: string }>
  how: ReadonlyArray<string>
  experience: ReadonlyArray<string>
  skills: ReadonlyArray<string>
  availability: ReadonlyArray<string>
  contact: ReadonlyArray<string>
  products: ReadonlyArray<TerminalProduct>
  /** Home sections; one with `href` lives on its own page instead. */
  sections: ReadonlyArray<{ id: string; label: string; href?: string }>
  homeHref: string
  briefHref: string
  cvHref: string
  otherLanguageHref: string
}

export type TerminalStrings = {
  helpTitle: string
  commands: Record<SiteTerminalCommand, string>
  usage: Partial<Record<SiteTerminalCommand, string>>
  notFound: string
  usageOpen: string
  unknownProduct: string
  privateProduct: string
  usageGoto: string
  catUsage: string
  askUsage: string
  opening: string
  sudo: string
  emailLabel: string
  briefLabel: string
}

const out = (text: string): TerminalLine => ({ kind: "out", text })
const fill = (template: string, value: string) => template.replace("%s", value)

function productList(data: TerminalData): TerminalLine[] {
  return data.products.map((product) =>
    product.href
      ? {
          kind: "link",
          text: `${product.id.padEnd(12)}${product.name} — ${product.what}`,
          href: product.href,
          external: true,
        }
      : out(`${product.id.padEnd(12)}${product.name} — ${product.what}`)
  )
}

function topic(
  name: string,
  data: TerminalData,
  strings: TerminalStrings,
  email: string,
  timeZoneNow: () => string
): TerminalResult | null {
  switch (name) {
    case "whoami":
      return { lines: data.whoami.map(out) }
    case "services":
      return { lines: data.services.map(out) }
    case "work":
      return {
        lines: data.work.map((item) => ({ kind: "link", ...item })),
      }
    case "how":
      return { lines: data.how.map(out) }
    case "experience":
      return { lines: data.experience.map(out) }
    case "skills":
      return { lines: data.skills.map(out) }
    case "availability":
      return { lines: data.availability.map(out) }
    case "projects":
      return { lines: productList(data) }
    case "contact":
      return {
        lines: [
          { kind: "mail", text: `${strings.emailLabel}: ${email}` },
          ...data.contact.map(out),
          {
            kind: "link",
            text: `${strings.briefLabel}: ${data.briefHref}`,
            href: data.briefHref,
          },
        ],
      }
    case "date":
      return { lines: [out(timeZoneNow())] }
    default:
      return null
  }
}

export function runTerminalCommand(
  input: string,
  data: TerminalData,
  strings: TerminalStrings,
  email: string,
  timeZoneNow: () => string
): TerminalResult {
  const [rawName = "", ...rest] = input.trim().split(/\s+/)
  const argument = rest.join(" ")
  const lowered = rawName.toLowerCase()
  const name = hiddenAliases[lowered] ?? lowered

  const shown = topic(name, data, strings, email, timeZoneNow)
  if (shown) return shown

  switch (name) {
    case "help":
      return {
        lines: [
          { kind: "head", text: strings.helpTitle },
          ...siteTerminalCommands.map((command) =>
            out(
              `  ${(strings.usage[command] ?? command).padEnd(22)}${strings.commands[command]}`
            )
          ),
        ],
      }
    case "ls":
      return argument.toLowerCase().startsWith("proj")
        ? { lines: productList(data) }
        : {
            lines: [
              out(
                [
                  "services",
                  "work",
                  "projects",
                  "experience",
                  "skills",
                  "contact",
                ].join("   ")
              ),
            ],
          }
    case "open": {
      const wanted = argument.toLowerCase()
      if (!wanted) return { lines: [{ kind: "err", text: strings.usageOpen }] }
      const product = data.products.find(
        (item) => item.id === wanted || item.name.toLowerCase() === wanted
      )
      if (!product)
        return {
          lines: [
            { kind: "err", text: fill(strings.unknownProduct, argument) },
          ],
        }
      if (!product.href)
        return {
          lines: [
            { kind: "muted", text: fill(strings.privateProduct, product.name) },
          ],
        }
      return {
        lines: [{ kind: "muted", text: fill(strings.opening, product.href) }],
        effect: { type: "open", href: product.href },
      }
    }
    case "cat": {
      const wanted = argument.toLowerCase()
      const product = data.products.find(
        (item) => item.id === wanted || item.name.toLowerCase() === wanted
      )
      if (product)
        return runTerminalCommand(
          `open ${product.id}`,
          data,
          strings,
          email,
          timeZoneNow
        )
      return (
        topic(wanted, data, strings, email, timeZoneNow) ?? {
          lines: [{ kind: "err", text: strings.catUsage }],
        }
      )
    }
    case "mail":
      return {
        lines: [{ kind: "muted", text: fill(strings.opening, email) }],
        effect: { type: "mail" },
      }
    case "brief":
      return { lines: [], effect: { type: "navigate", href: data.briefHref } }
    case "cv":
      return { lines: [], effect: { type: "navigate", href: data.cvHref } }
    case "lang":
      return {
        lines: [],
        effect: { type: "navigate", href: data.otherLanguageHref },
      }
    case "theme": {
      const value =
        argument === "dark" || argument === "light" ? argument : undefined
      return { lines: [], effect: { type: "theme", value } }
    }
    case "goto": {
      const section = data.sections.find(
        (item) => item.id === argument.toLowerCase()
      )
      if (!section)
        return {
          lines: [
            {
              kind: "err",
              text: fill(
                strings.usageGoto,
                data.sections.map((item) => item.id).join(", ")
              ),
            },
          ],
        }
      if (section.href)
        return { lines: [], effect: { type: "navigate", href: section.href } }
      return {
        lines: [],
        effect: {
          type: "scroll",
          id: section.id,
          fallback: `${data.homeHref}#${section.id}`,
        },
      }
    }
    case "ask":
      return argument
        ? { lines: [], effect: { type: "ask", question: argument } }
        : { lines: [{ kind: "err", text: strings.askUsage }] }
    case "sudo":
      return { lines: [out(strings.sudo)] }
    case "echo":
      return { lines: [out(argument)] }
    case "clear":
      return { lines: [], effect: { type: "clear" } }
    case "exit":
      return { lines: [], effect: { type: "close" } }
    default:
      return { lines: [{ kind: "err", text: fill(strings.notFound, rawName) }] }
  }
}

export function completeTerminalInput(
  input: string,
  data: TerminalData
): string | null {
  const [command = "", ...rest] = input.split(" ")
  if (rest.length === 0) {
    const matches = siteTerminalCommands.filter((name) =>
      name.startsWith(command)
    )
    return matches.length === 1 ? `${matches[0]} ` : null
  }
  const argument = rest.join(" ").toLowerCase()
  const pool =
    command === "goto"
      ? data.sections.map((item) => item.id)
      : command === "open" || command === "cat"
        ? data.products.map((item) => item.id)
        : []
  const matches = pool.filter((name) => name.startsWith(argument))
  return matches.length === 1 ? `${command} ${matches[0]}` : null
}
