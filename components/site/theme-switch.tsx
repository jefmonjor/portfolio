"use client"

import { MoonIcon, SunIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useThemeToggle } from "@/hooks/use-theme-toggle"

function ThemeSwitch({ label }: { label: string }) {
  const toggleTheme = useThemeToggle()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="site-press inline-flex size-11 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
    >
      <HugeiconsIcon
        icon={MoonIcon}
        className="size-[18px] dark:hidden"
        strokeWidth={1.5}
      />
      <HugeiconsIcon
        icon={SunIcon}
        className="hidden size-[18px] dark:block"
        strokeWidth={1.5}
      />
    </button>
  )
}

export { ThemeSwitch }
