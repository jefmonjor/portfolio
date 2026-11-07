"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { samePathInLocale, type SiteLocale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

const languageNames: Record<SiteLocale, string> = {
  en: "English",
  es: "Español",
}

const otherLanguage: Record<SiteLocale, SiteLocale> = { en: "es", es: "en" }

type LanguageLinkProps = {
  current: SiteLocale
  className?: string
}

function LanguageLink({ current, className }: LanguageLinkProps) {
  const pathname = usePathname()
  const target = otherLanguage[current]

  return (
    <Link
      href={samePathInLocale(pathname, target)}
      hrefLang={target}
      lang={target}
      rel="alternate"
      prefetch={false}
      className={cn(
        "inline-flex min-h-11 items-center text-sm text-muted-foreground transition-colors hover:text-foreground",
        className
      )}
    >
      {languageNames[target]}
    </Link>
  )
}

export { LanguageLink }
