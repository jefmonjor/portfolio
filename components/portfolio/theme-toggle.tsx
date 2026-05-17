"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import { MoonIcon, SunIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const t = useTranslations("themeToggle")

  function onToggle() {
    const current =
      resolvedTheme ??
      (typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark")
        ? "dark"
        : "light")
    setTheme(current === "dark" ? "light" : "dark")
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={t("ariaLabel")}
          onClick={onToggle}
        >
          <HugeiconsIcon
            icon={MoonIcon}
            className="size-3.5 dark:hidden"
            strokeWidth={1.5}
          />
          <HugeiconsIcon
            icon={SunIcon}
            className="hidden size-3.5 dark:block"
            strokeWidth={1.5}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <span className="font-mono text-[10px] tracking-wider uppercase">
          {t("hint")}
        </span>
      </TooltipContent>
    </Tooltip>
  )
}

export { ThemeToggle }
