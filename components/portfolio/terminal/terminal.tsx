"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { useTheme } from "next-themes"
import { useLocale, useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"

import { useBackground } from "@/components/background-provider"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "@/i18n/navigation"
import { resolveLocale } from "@/i18n/routing"
import { parseString, parseStringArray } from "@/lib/i18n-values"
import { profile, profileTimeZone } from "@/lib/profile"
import {
  completions,
  execute,
  type TerminalData,
  type TerminalLineKind,
  type TerminalOutLine,
  type TerminalStrings,
} from "@/lib/terminal"
import { cn } from "@/lib/utils"

export const TERMINAL_EVENT = "mdbep:terminal:open"

export function openTerminal(): void {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(TERMINAL_EVENT))
}

type HistoryLine = TerminalOutLine & { id: number }

const LINE_CLASS: Record<TerminalLineKind, string> = {
  in: "text-muted-foreground",
  out: "text-foreground",
  err: "text-destructive",
  ok: "text-foreground",
  muted: "text-muted-foreground",
  head: "font-medium text-foreground",
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  )
}

function Terminal() {
  const [open, setOpen] = React.useState(false)
  const [lines, setLines] = React.useState<ReadonlyArray<HistoryLine>>([])
  const [value, setValue] = React.useState("")
  const [history, setHistory] = React.useState<ReadonlyArray<string>>([])
  const [historyIndex, setHistoryIndex] = React.useState<number | null>(null)

  const lineId = React.useRef(0)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const t = useTranslations("terminal")
  const tHero = useTranslations("hero")
  const tCommon = useTranslations("common")
  const tAbout = useTranslations("about")
  const tExp = useTranslations("experience.entries")
  const tProjects = useTranslations("projects.entries")
  const tSkills = useTranslations("skills.groups")

  const { setTheme } = useTheme()
  const { setVariant } = useBackground()
  const router = useRouter()
  const pathname = usePathname()
  const locale = resolveLocale(useLocale())

  const data = React.useMemo<TerminalData>(() => {
    const email = profile.socials.find((s) => s.kind === "email")?.handle
    const linkedin = profile.socials.find((s) => s.kind === "linkedin")?.href

    return {
      name: profile.name,
      shortName: profile.shortName,
      role: tHero("role"),
      location: profile.location,
      since: profile.since,
      timezone: profile.timezone,
      locale,
      email,
      linkedin,
      about: tAbout("manifesto"),
      sections: [
        "about",
        "experience",
        "skills",
        "projects",
        "education",
        "contact",
      ],
      projects: profile.projects.map((p) => ({
        id: p.id,
        name: tProjects(`${p.id}.name`),
        summary: tProjects(`${p.id}.summary`),
        url: p.url,
      })),
      experience: profile.experience.map((e) => {
        const end =
          e.endISO === "present" ? tCommon("present") : tExp(`${e.id}.end`)
        return {
          org: e.organization,
          role: tExp(`${e.id}.role`),
          dates: `${tExp(`${e.id}.start`)} → ${end}`,
          summary: tExp(`${e.id}.summary`),
        }
      }),
      skills: profile.skills.map((s) => ({
        group: tSkills(s.id),
        items: s.items,
      })),
    }
  }, [locale, tHero, tAbout, tProjects, tExp, tSkills, tCommon])

  const strings = React.useMemo<TerminalStrings>(() => {
    // Read via `t.raw` so ICU MessageFormat never parses the command strings:
    // tokens like `<project>` or `cat <a|b>` would otherwise be read as tags.
    // These messages use our own `%s` placeholder, not ICU arguments.
    const raw = (key: string) => parseString(t.raw(key))
    return {
      notFound: raw("notFound"),
      hint: raw("hint"),
      help: parseStringArray(t.raw("help")),
      unknownProject: raw("unknownProject"),
      privateProject: raw("privateProject"),
      usageOpen: raw("usageOpen"),
      usageGoto: raw("usageGoto"),
      opening: raw("opening"),
      noEmail: raw("noEmail"),
      catTopics: raw("catTopics"),
      langAlready: raw("langAlready"),
      sudo: raw("sudo"),
      emptyArg: raw("emptyArg"),
    }
  }, [t])

  const pushLines = React.useCallback(
    (next: ReadonlyArray<TerminalOutLine>) => {
      if (next.length === 0) return
      setLines((prev) => [
        ...prev,
        ...next.map((line) => ({ ...line, id: lineId.current++ })),
      ])
    },
    []
  )

  const resetWithBanner = React.useCallback(() => {
    lineId.current = 0
    setLines(
      parseStringArray(t.raw("banner")).map((text) => ({
        kind: "muted" as const,
        text,
        id: lineId.current++,
      }))
    )
  }, [t])

  React.useEffect(() => {
    function onOpen() {
      setOpen(true)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key !== "`" || event.metaKey || event.ctrlKey || event.altKey)
        return
      // Avoid stealing backticks from regular form fields; the terminal input
      // handles the same shortcut locally while the dialog is focused.
      if (isEditableTarget(event.target)) return
      event.preventDefault()
      setOpen((prev) => !prev)
    }
    window.addEventListener(TERMINAL_EVENT, onOpen)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener(TERMINAL_EVENT, onOpen)
      window.removeEventListener("keydown", onKey)
    }
  }, [])

  React.useEffect(() => {
    if (open && lines.length === 0) resetWithBanner()
  }, [open, lines.length, resetWithBanner])

  React.useEffect(() => {
    if (!open) return
    const node = scrollRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [lines, open])

  function runEffects(effects: ReturnType<typeof execute>["effects"]) {
    let close = false
    let gotoSection: string | null = null

    for (const effect of effects) {
      switch (effect.type) {
        case "clear":
          resetWithBanner()
          break
        case "close":
          close = true
          break
        case "cv":
          window.open(`/cv.pdf?locale=${locale}`, "_blank", "noopener")
          break
        case "theme":
          setTheme(
            effect.value ??
              (document.documentElement.classList.contains("dark")
                ? "light"
                : "dark")
          )
          break
        case "lang":
          router.replace(`${pathname}${window.location.hash}`, {
            locale: effect.value,
          })
          break
        case "bg":
          setVariant(effect.value)
          break
        case "open":
          window.open(effect.href, "_blank", "noopener,noreferrer")
          break
        case "goto":
          gotoSection = effect.section
          break
      }
    }

    if (gotoSection) {
      setOpen(false)
      const section = gotoSection
      requestAnimationFrame(() => {
        const el = document.getElementById(section)
        if (!el) return
        el.scrollIntoView({ behavior: "smooth", block: "start" })
        window.history.replaceState(null, "", `#${section}`)
      })
    } else if (close) {
      setOpen(false)
    }
  }

  function submit() {
    const raw = value
    pushLines([{ kind: "in", text: `$ ${raw}` }])
    if (raw.trim()) {
      setHistory((prev) => [...prev, raw])
    }
    setHistoryIndex(null)
    setValue("")

    const outcome = execute(raw, data, strings)
    pushLines(outcome.lines)
    runEffects(outcome.effects)
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (
      event.key === "`" &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.altKey
    ) {
      event.preventDefault()
      setOpen(false)
      return
    }
    if (event.key === "Enter") {
      event.preventDefault()
      submit()
      return
    }
    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (history.length === 0) return
      const next =
        historyIndex === null
          ? history.length - 1
          : Math.max(historyIndex - 1, 0)
      setHistoryIndex(next)
      setValue(history[next])
      return
    }
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (historyIndex === null) return
      const next = historyIndex + 1
      if (next >= history.length) {
        setHistoryIndex(null)
        setValue("")
      } else {
        setHistoryIndex(next)
        setValue(history[next])
      }
      return
    }
    if (event.key === "Tab") {
      event.preventDefault()
      const [first, ...rest] = value.split(/\s+/)
      if (rest.length > 0) return
      const matches = completions(first)
      if (matches.length === 1) setValue(matches[0] + " ")
      else if (matches.length > 1)
        pushLines([{ kind: "muted", text: matches.join("   ") }])
      return
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Content
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            inputRef.current?.focus()
          }}
          className="fixed top-1/2 left-1/2 z-50 flex h-[min(34rem,80svh)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-none bg-popover text-popover-foreground ring-1 ring-foreground/15 duration-100 outline-none sm:max-w-2xl data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
        >
          <DialogPrimitive.Title className="sr-only">
            {t("title")}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            {t("description")}
          </DialogPrimitive.Description>

          <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-foreground/20" />
              <span className="size-2.5 rounded-full bg-foreground/20" />
              <span className="size-2.5 rounded-full bg-foreground/20" />
            </div>
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              {profile.shortName.toLowerCase().replace(/\s+/g, "")}@mdbep:~
            </span>
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="icon-sm" aria-label={t("close")}>
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
              </Button>
            </DialogPrimitive.Close>
          </div>

          <div
            onClick={() => inputRef.current?.focus()}
            className="flex min-h-0 flex-1 cursor-text flex-col overflow-hidden text-left"
          >
            <div
              ref={scrollRef}
              className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 py-3 font-mono text-xs leading-relaxed"
            >
              {lines.map((line) => (
                <p
                  key={line.id}
                  className={cn(
                    "wrap-break-word whitespace-pre-wrap",
                    LINE_CLASS[line.kind]
                  )}
                >
                  {line.text || " "}
                </p>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-border px-3 py-2.5 font-mono text-xs">
            <span aria-hidden className="text-muted-foreground select-none">
              $
            </span>
            <input
              ref={inputRef}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              aria-label={t("inputLabel")}
              className="flex-1 bg-transparent text-foreground caret-foreground outline-none placeholder:text-muted-foreground/60"
              placeholder={t("placeholder")}
            />
            <span className="hidden font-mono text-[10px] tracking-widest text-muted-foreground/70 uppercase sm:inline">
              {profileTimeZone.split("/").pop()}
            </span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

export { Terminal }
