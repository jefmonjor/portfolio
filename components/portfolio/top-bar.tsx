"use client"

import { useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import { ComputerTerminal01Icon } from "@hugeicons/core-free-icons"

import { CommandPalette } from "@/components/portfolio/command-palette"
import { CvDownloadButton } from "@/components/portfolio/cv-download-button"
import { LocaleSwitcher } from "@/components/portfolio/locale-switcher"
import { openTerminal } from "@/components/portfolio/terminal/events"
import { TerminalHost } from "@/components/portfolio/terminal/terminal-host"
import { ThemeToggle } from "@/components/portfolio/theme-toggle"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { profile, publicProfiles } from "@/lib/profile"

const NAV_IDS = [
  "about",
  "experience",
  "skills",
  "ai",
  "projects",
  "education",
  "contact",
] as const

/** A floating pill up to 75rem; from there, a fixed rail with contact and the CV download always in view. */
function TopBar() {
  const tNav = useTranslations("nav")
  const tHero = useTranslations("hero")
  const tStatus = useTranslations("status")

  return (
    <div
      data-print-hidden
      className="sticky top-0 z-40 px-3 pt-3 sm:px-4 wide:fixed wide:inset-y-0 wide:left-0 wide:w-64 wide:p-0"
    >
      <div
        aria-hidden
        className="scroll-progress fixed inset-x-0 top-0 h-0.5 bg-brand"
      />
      <div className="mx-auto flex h-11 max-w-6xl min-w-0 items-center justify-between gap-2 rounded-full border border-border bg-background/85 px-3 shadow-sm backdrop-blur sm:gap-4 sm:px-5 wide:h-full wide:max-w-none wide:flex-col wide:items-stretch wide:justify-start wide:gap-7 wide:overflow-y-auto wide:rounded-none wide:border-0 wide:border-r wide:bg-background wide:px-6 wide:py-7 wide:shadow-none wide:backdrop-blur-none">
        <div className="flex min-w-0 shrink flex-col gap-2">
          <a
            href="#top"
            className="flex min-w-0 shrink items-center gap-2 font-mono text-[11px] tracking-widest uppercase hover:text-foreground"
          >
            <span className="inline-block size-1.5 bg-brand" />
            <span className="sm:hidden lg:inline">Jefferson</span>
            <span className="hidden truncate sm:inline lg:hidden">
              {profile.shortName}
            </span>
          </a>
          <p className="hidden text-[13px] leading-snug text-muted-foreground wide:block">
            {tHero("role")}
          </p>
        </div>

        <nav className="hidden items-center gap-0.5 text-[13px] whitespace-nowrap text-muted-foreground lg:flex wide:-mx-2 wide:flex-col wide:items-stretch wide:text-sm">
          {NAV_IDS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-full px-2 py-1 transition-colors hover:bg-foreground/5 hover:text-foreground wide:rounded-none wide:py-1.5"
            >
              {tNav(id)}
            </a>
          ))}
        </nav>

        <div className="hidden flex-col gap-2 border-t border-border pt-6 wide:flex">
          <Button asChild size="lg">
            <a href="#contact">{tHero("cta.contact")}</a>
          </Button>
          <CvDownloadButton className="w-full" />
          <p className="mt-2 flex gap-2 text-[13px] leading-snug text-muted-foreground">
            <span
              aria-hidden
              className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand"
            />
            {tStatus("label")}
          </p>
          <p className="mt-1 flex gap-4 pl-3.5 font-mono text-[11px] tracking-widest uppercase">
            {publicProfiles.map((channel) => (
              <a
                key={channel.href}
                href={channel.href}
                target="_blank"
                rel="me noopener noreferrer"
                className="text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
              >
                {channel.name}
              </a>
            ))}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2 wide:mt-auto wide:flex-wrap">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                data-hit-area
                aria-label={tNav("terminal")}
                onClick={openTerminal}
              >
                <HugeiconsIcon
                  icon={ComputerTerminal01Icon}
                  className="size-3.5"
                  strokeWidth={1.75}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span className="flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase">
                {tNav("terminal")}
                <Kbd className="font-mono text-[11px]">`</Kbd>
              </span>
            </TooltipContent>
          </Tooltip>
          <CommandPalette />
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
      <TerminalHost />
    </div>
  )
}

export { TopBar }
