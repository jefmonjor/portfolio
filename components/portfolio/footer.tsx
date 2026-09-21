import { useLocale, useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { portfolioUpdatedAt, profile } from "@/lib/profile"

function Footer() {
  const t = useTranslations("footer")
  const tHero = useTranslations("hero")
  const tLocales = useTranslations("localeSwitcher")
  const locale = useLocale()

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          <span className="inline-block size-1.5 bg-brand" />
          <span>{profile.shortName}</span>
          <span className="text-border">/</span>
          <span>{tHero("role")}</span>
        </div>
        {/* Crawlable links between locales: the header switcher is a JS
            control, so these anchors are what lets a crawler walk from one
            language to the next instead of trusting hreflang alone. */}
        <nav
          aria-label={t("languagesLabel")}
          className="flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-widest text-muted-foreground uppercase"
        >
          {routing.locales.map((candidate) =>
            candidate === locale ? (
              <span
                key={candidate}
                aria-current="true"
                className="text-foreground"
              >
                {tLocales(`names.${candidate}`)}
              </span>
            ) : (
              <Link
                key={candidate}
                href="/"
                locale={candidate}
                hrefLang={candidate}
                rel="alternate"
                className="transition-colors hover:text-foreground"
              >
                {tLocales(`names.${candidate}`)}
              </Link>
            )
          )}
        </nav>
        <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          <span>{t("builtLine")}</span>
          <span className="text-border">/</span>
          <span>{t("lastUpdated", { date: portfolioUpdatedAt })}</span>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
