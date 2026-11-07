import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { getLocale, getTranslations } from "next-intl/server"

import { Background } from "@/components/portfolio/background"
import { Button } from "@/components/ui/button"
import { localizedPath, nearestSiteLocale } from "@/i18n/routing"

export default async function NotFound() {
  const t = await getTranslations("notFound")
  const home = localizedPath(nearestSiteLocale(await getLocale()), "/")

  return (
    <div className="relative isolate flex min-h-svh flex-col items-center justify-center gap-8 bg-background px-4 text-foreground">
      <title>{t("title")}</title>
      <Background />

      <p
        aria-hidden
        className="relative z-10 font-heading text-[clamp(4rem,10vw,7rem)] leading-none font-medium tracking-[-0.02em] text-muted-foreground/40 tabular-nums"
      >
        404
      </p>

      <div className="relative z-10 flex max-w-md flex-col items-center gap-3 text-center">
        <h1 className="font-heading text-3xl leading-tight font-medium tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          {t("body")}
        </p>
      </div>

      <Button asChild variant="outline" className="relative z-10 min-h-11 px-4">
        <Link href={home}>
          <HugeiconsIcon
            icon={ArrowLeft01Icon}
            className="size-3.5"
            strokeWidth={1.75}
            data-icon="inline-start"
          />
          {t("cta")}
        </Link>
      </Button>
    </div>
  )
}
