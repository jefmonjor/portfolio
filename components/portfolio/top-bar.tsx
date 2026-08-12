"use client"

import { motion, useScroll, useSpring } from "motion/react"
import { useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import { ComputerTerminal01Icon } from "@hugeicons/core-free-icons"

import { CommandPalette } from "@/components/portfolio/command-palette"
import { LocaleSwitcher } from "@/components/portfolio/locale-switcher"
import { Terminal, openTerminal } from "@/components/portfolio/terminal/terminal"
import { ThemeToggle } from "@/components/portfolio/theme-toggle"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { profile } from "@/lib/profile"

const NAV_IDS = [
  "about",
  "experience",
  "skills",
  "projects",
  "education",
  "contact",
] as const

function TopBar() {
  const tNav = useTranslations("nav")

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.2,
  })

  return (
    <div data-print-hidden className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <motion.div
        aria-hidden
        style={{ scaleX: progress, transformOrigin: "0 50%" }}
        className="fixed inset-x-0 top-0 h-0.5 bg-brand"
      />
      <div className="mx-auto flex h-11 max-w-6xl items-center justify-between gap-4 rounded-full border border-border bg-background/85 px-4 shadow-sm backdrop-blur sm:px-5">
        <a
          href="#top"
          className="flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase hover:text-foreground"
        >
          <span className="inline-block size-1.5 bg-brand" />
          <span>{profile.shortName}</span>
        </a>

        <nav className="hidden items-center gap-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase lg:flex">
          {NAV_IDS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="px-2 py-1 transition-colors hover:text-foreground"
            >
              {tNav(id)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
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
              <span className="flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase">
                {tNav("terminal")}
                <Kbd className="font-mono text-[10px]">`</Kbd>
              </span>
            </TooltipContent>
          </Tooltip>
          <CommandPalette />
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
      <Terminal />
    </div>
  )
}

export { TopBar }
