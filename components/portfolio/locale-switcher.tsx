"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"

import { Link, usePathname, useRouter } from "@/i18n/navigation"
import { routing, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

// Plain links instead of a select: every language is one tap away, crawlers
// can follow the alternates, and the control needs no popover library.
function LocaleSwitcher() {
  const t = useTranslations("localeSwitcher")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = React.useTransition()

  function onSelect(event: React.MouseEvent<HTMLAnchorElement>, next: Locale) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)
      return
    event.preventDefault()
    if (next === locale) return
    // Keep the reader on the same section after the language changes.
    startTransition(() => {
      router.replace(`${pathname}${window.location.hash}`, { locale: next })
    })
  }

  return (
    <nav
      aria-label={t("ariaLabel")}
      aria-busy={isPending}
      className="flex h-7 items-center rounded-full border border-border p-0.5"
    >
      {routing.locales.map((loc) => {
        const current = loc === locale
        return (
          <Link
            key={loc}
            href={pathname}
            locale={loc}
            // Switching language is rare; prefetching both other locales on
            // every visit cost ~50 KB of RSC payload nobody asked for.
            prefetch={false}
            hrefLang={loc}
            lang={loc}
            aria-current={current ? "page" : undefined}
            title={t(`names.${loc}`)}
            onClick={(event) => onSelect(event, loc)}
            data-hit-area="y"
            className={cn(
              "flex h-full min-w-7 items-center justify-center rounded-full px-1.5 font-mono text-[11px] tracking-widest uppercase transition-colors duration-150",
              current
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
              isPending && !current && "opacity-60"
            )}
          >
            {t(`options.${loc}`)}
          </Link>
        )
      })}
    </nav>
  )
}

export { LocaleSwitcher }
