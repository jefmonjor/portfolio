import { ArrowLeft02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Inter } from "next/font/google"
import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"

import { SiteShell } from "@/components/site/site-shell"
import { getSiteContent } from "@/content/site"
import { localizedPath, nearestSiteLocale } from "@/i18n/routing"

// This boundary is part of every route under [locale], /cv included, so a
// preloaded font here would be preloaded on /cv as well.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
})

export default async function NotFound() {
  const t = await getTranslations("notFound")
  const locale = nearestSiteLocale(await getLocale())

  return (
    <SiteShell
      fontVariable={inter.variable}
      locale={locale}
      content={getSiteContent(locale)}
    >
      <title>{t("title")}</title>
      <section className="site-container flex flex-col items-start gap-5 pt-20 pb-12 md:pt-32">
        <p className="text-subheading-xs text-text-sub-600 uppercase tabular-nums">
          404
        </p>
        <h1 className="max-w-[20ch] text-title-h2 text-text-strong-950">
          {t("title")}
        </h1>
        <p className="site-prose text-text-sub-600">{t("body")}</p>
        <Link
          href={localizedPath(locale, "/")}
          className="site-button site-button-stroke mt-3"
        >
          <HugeiconsIcon
            icon={ArrowLeft02Icon}
            aria-hidden
            className="size-[18px] text-icon-sub-600"
            strokeWidth={1.75}
          />
          {t("cta")}
        </Link>
      </section>
    </SiteShell>
  )
}
