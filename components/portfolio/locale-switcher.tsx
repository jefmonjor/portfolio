"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter } from "@/i18n/navigation"
import { isLocale, routing } from "@/i18n/routing"

function withCurrentHash(pathname: string): string {
  if (typeof window === "undefined") return pathname
  return `${pathname}${window.location.hash}`
}

function LocaleSwitcher() {
  const t = useTranslations("localeSwitcher")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = React.useTransition()

  function onChange(next: string) {
    if (!isLocale(next) || next === locale) return
    startTransition(() => {
      router.replace(withCurrentHash(pathname), {
        locale: next,
      })
    })
  }

  return (
    <Select value={locale} onValueChange={onChange} disabled={isPending}>
      <SelectTrigger
        size="sm"
        aria-label={t("ariaLabel")}
        className="h-7 w-16 gap-1 px-2 font-mono text-[10px] tracking-widest uppercase"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end" className="min-w-16">
        {routing.locales.map((loc) => (
          <SelectItem
            key={loc}
            value={loc}
            className="font-mono text-[10px] tracking-widest uppercase"
          >
            {t(`options.${loc}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { LocaleSwitcher }
