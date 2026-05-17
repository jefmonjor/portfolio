import { useTranslations } from "next-intl"

import { CommandPalette } from "@/components/portfolio/command-palette"
import { LocaleSwitcher } from "@/components/portfolio/locale-switcher"
import { ThemeToggle } from "@/components/portfolio/theme-toggle"
import { profile } from "@/lib/profile"

function TopBar() {
  const tNav = useTranslations("nav")

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-11 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
        <a
          href="#top"
          className="flex items-center gap-2 font-mono text-[11px] tracking-widest uppercase hover:text-foreground"
        >
          <span className="inline-block size-1.5 bg-foreground" />
          <span>{profile.shortName}</span>
        </a>

        <nav className="hidden items-center gap-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase md:flex">
          <a
            href="#about"
            className="px-2 py-1 transition-colors hover:text-foreground"
          >
            {tNav("about")}
          </a>
          <a
            href="#experience"
            className="px-2 py-1 transition-colors hover:text-foreground"
          >
            {tNav("experience")}
          </a>
          <a
            href="#skills"
            className="px-2 py-1 transition-colors hover:text-foreground"
          >
            {tNav("skills")}
          </a>
          <a
            href="#projects"
            className="px-2 py-1 transition-colors hover:text-foreground"
          >
            {tNav("projects")}
          </a>
          <a
            href="#education"
            className="px-2 py-1 transition-colors hover:text-foreground"
          >
            {tNav("education")}
          </a>
          <a
            href="#contact"
            className="px-2 py-1 transition-colors hover:text-foreground"
          >
            {tNav("contact")}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <CommandPalette />
          <LocaleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

export { TopBar }
