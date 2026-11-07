import Link from "next/link"
import { useLocale, useTranslations } from "next-intl"

import { localizedPath, nearestSiteLocale, resolveLocale } from "@/i18n/routing"

function FullSiteBanner() {
  const t = useTranslations("cvBanner")
  const siteHome = localizedPath(
    nearestSiteLocale(resolveLocale(useLocale())),
    "/"
  )

  return (
    <aside
      data-print-hidden
      className="relative z-50 border-b border-border bg-background px-4 py-2 text-center text-sm text-muted-foreground"
    >
      {t("lead")}{" "}
      <Link
        href={siteHome}
        className="font-medium text-foreground underline decoration-brand decoration-2 underline-offset-4 hover:decoration-foreground"
      >
        {t("link")}
        <span aria-hidden> →</span>
      </Link>
    </aside>
  )
}

export { FullSiteBanner }
