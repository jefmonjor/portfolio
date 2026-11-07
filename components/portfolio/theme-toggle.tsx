"use client"

import { useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import { MoonIcon, SunIcon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { useThemeToggle } from "@/hooks/use-theme-toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function ThemeToggle() {
  const onToggle = useThemeToggle()
  const t = useTranslations("themeToggle")

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          data-hit-area
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
        <span className="font-mono text-[11px] tracking-wider uppercase">
          {t("hint")}
        </span>
      </TooltipContent>
    </Tooltip>
  )
}

export { ThemeToggle }
