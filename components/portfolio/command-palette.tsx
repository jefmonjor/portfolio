"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useLocale, useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  ComputerTerminal01Icon,
  GridIcon,
  LayersLogoIcon,
  MoonIcon,
  MoreHorizontalIcon,
  SearchIcon,
  SpotlightIcon,
  SunIcon,
  TranslateIcon,
} from "@hugeicons/core-free-icons"

import { useBackground } from "@/components/background-provider"
import { openTerminal } from "@/components/portfolio/terminal/terminal"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { usePathname, useRouter } from "@/i18n/navigation"
import { resolveLocale, routing, type Locale } from "@/i18n/routing"
import {
  BACKGROUND_VARIANTS,
  type BackgroundVariant,
} from "@/lib/background"

const BACKGROUND_ICONS: Record<BackgroundVariant, typeof GridIcon> = {
  grid: GridIcon,
  dots: MoreHorizontalIcon,
  radial: SpotlightIcon,
  noise: LayersLogoIcon,
}

type SectionId =
  | "about"
  | "experience"
  | "skills"
  | "ai"
  | "projects"
  | "education"
  | "contact"

const SECTIONS: ReadonlyArray<SectionId> = [
  "about",
  "experience",
  "skills",
  "ai",
  "projects",
  "education",
  "contact",
]

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

function withCurrentHash(pathname: string): string {
  if (typeof window === "undefined") return pathname
  return `${pathname}${window.location.hash}`
}

function detectMacFromUserAgent(): boolean | null {
  if (typeof navigator === "undefined") return null
  return /mac|iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
}

function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const isMac = React.useSyncExternalStore(
    () => () => {},
    detectMacFromUserAgent,
    () => null
  )

  const t = useTranslations("commandPalette")
  const tNav = useTranslations("nav")

  const { resolvedTheme, setTheme } = useTheme()
  const { variant: backgroundVariant, setVariant: setBackgroundVariant } =
    useBackground()
  const router = useRouter()
  const pathname = usePathname()
  const locale = resolveLocale(useLocale())

  React.useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k") return
      if (!(event.metaKey || event.ctrlKey)) return
      if (event.altKey) return
      if (isEditableTarget(event.target)) {
        // Still allow palette toggle from inputs; this overrides default.
      }
      event.preventDefault()
      setOpen((prev) => !prev)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  function runAndClose(action: () => void) {
    setOpen(false)
    requestAnimationFrame(action)
  }

  function goToSection(id: SectionId) {
    runAndClose(() => {
      const el = document.getElementById(id)
      if (!el) return
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      history.replaceState(null, "", `#${id}`)
    })
  }

  function toggleTheme() {
    runAndClose(() => {
      const current =
        resolvedTheme ??
        (document.documentElement.classList.contains("dark") ? "dark" : "light")
      setTheme(current === "dark" ? "light" : "dark")
    })
  }

  function switchLocale(next: Locale) {
    runAndClose(() => {
      router.replace(withCurrentHash(pathname), { locale: next })
    })
  }

  function switchBackground(next: BackgroundVariant) {
    runAndClose(() => {
      setBackgroundVariant(next)
    })
  }

  const themeLabel =
    resolvedTheme === "dark"
      ? t("actions.themeToLight")
      : t("actions.themeToDark")
  const ThemeIcon = resolvedTheme === "dark" ? SunIcon : MoonIcon

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label={t("title")}
            onClick={() => setOpen(true)}
            className="sm:h-7 sm:w-auto sm:gap-2 sm:px-2"
          >
            <HugeiconsIcon
              icon={SearchIcon}
              className="size-3.5"
              strokeWidth={1.75}
            />
            <span className="hidden font-mono text-[10px] tracking-widest text-muted-foreground uppercase sm:inline">
              {t("hintLabel")}
            </span>
            <Kbd className="hidden font-mono text-[10px] sm:inline-flex">
              {isMac === false ? "Ctrl" : "⌘"} K
            </Kbd>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span className="font-mono text-[10px] tracking-wider uppercase">
            {t("title")}
          </span>
        </TooltipContent>
      </Tooltip>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={t("title")}
        description={t("description")}
      >
        <CommandInput placeholder={t("placeholder")} />
        <CommandList>
          <CommandEmpty>{t("empty")}</CommandEmpty>

          <CommandGroup heading={t("groups.sections")}>
            {SECTIONS.map((id) => (
              <CommandItem
                key={id}
                value={`${tNav(id)} ${id}`}
                onSelect={() => goToSection(id)}
              >
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-4 text-muted-foreground"
                  strokeWidth={1.75}
                />
                <span>{tNav(id)}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading={t("groups.actions")}>
            <CommandItem
              value={`${t("actions.openTerminal")} terminal shell console`}
              onSelect={() => runAndClose(openTerminal)}
            >
              <HugeiconsIcon
                icon={ComputerTerminal01Icon}
                className="size-4 text-muted-foreground"
                strokeWidth={1.75}
              />
              <span>{t("actions.openTerminal")}</span>
              <CommandShortcut className="font-mono text-[10px]">`</CommandShortcut>
            </CommandItem>

            <CommandItem
              value={`${themeLabel} theme dark light`}
              onSelect={toggleTheme}
            >
              <HugeiconsIcon
                icon={ThemeIcon}
                className="size-4 text-muted-foreground"
                strokeWidth={1.75}
              />
              <span>{themeLabel}</span>
            </CommandItem>

            {routing.locales
              .filter((loc) => loc !== locale)
              .map((loc) => (
                <CommandItem
                  key={loc}
                  value={`${t(`actions.switchTo.${loc}`)} language ${loc}`}
                  onSelect={() => switchLocale(loc)}
                >
                  <HugeiconsIcon
                    icon={TranslateIcon}
                    className="size-4 text-muted-foreground"
                    strokeWidth={1.75}
                  />
                  <span>{t(`actions.switchTo.${loc}`)}</span>
                </CommandItem>
              ))}
          </CommandGroup>

          <CommandGroup heading={t("groups.background")}>
            {BACKGROUND_VARIANTS.map((v) => {
              const isActive = v === backgroundVariant
              return (
                <CommandItem
                  key={v}
                  aria-current={isActive ? "true" : undefined}
                  value={`${t(`background.${v}`)} background ${v}`}
                  onSelect={() => switchBackground(v)}
                >
                  <HugeiconsIcon
                    icon={BACKGROUND_ICONS[v]}
                    className="size-4 text-muted-foreground"
                    strokeWidth={1.75}
                  />
                  <span>{t(`background.${v}`)}</span>
                  {isActive ? (
                    <CommandShortcut className="font-mono text-[10px] uppercase">
                      {t("background.active")}
                    </CommandShortcut>
                  ) : null}
                </CommandItem>
              )
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}

export { CommandPalette }
