"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { samePathInLocale, type SiteLocale } from "@/i18n/locales"

const languageNames: Record<SiteLocale, string> = {
  en: "English",
  es: "Español",
}

const otherLanguage: Record<SiteLocale, SiteLocale> = { en: "es", es: "en" }

const variantClasses = {
  bar: "text-sm",
  footer: "text-[0.9375rem]",
  short: "min-w-11 justify-center text-sm font-medium uppercase",
} as const

type LanguageLinkProps = {
  current: SiteLocale
  variant?: keyof typeof variantClasses
}

function LanguageLink({ current, variant = "bar" }: LanguageLinkProps) {
  const pathname = usePathname()
  const target = otherLanguage[current]

  return (
    <Link
      href={samePathInLocale(pathname, target)}
      hrefLang={target}
      lang={target}
      rel="alternate"
      prefetch={false}
      className={`inline-flex min-h-11 items-center text-muted-foreground transition-colors hover:text-foreground ${variantClasses[variant]}`}
    >
      {variant === "short" ? (
        <>
          {target}
          <span className="sr-only"> · {languageNames[target]}</span>
        </>
      ) : (
        languageNames[target]
      )}
    </Link>
  )
}

export { LanguageLink }
