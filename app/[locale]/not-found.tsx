import { ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { getTranslations } from "next-intl/server"

import { Background } from "@/components/portfolio/background"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"

export default async function NotFound() {
  const t = await getTranslations("notFound")

  return (
    <div className="relative isolate flex min-h-svh flex-col items-center justify-center gap-8 bg-background px-4 text-foreground">
      <Background />

      <pre
        aria-hidden
        className="relative z-10 font-mono text-[10px] leading-tight text-muted-foreground sm:text-xs"
      >{`  ┌─────────────────────────┐
  │  404 / NOT FOUND        │
  │                         │
  │  signal: ░░░░░░░░░░     │
  │  route : null           │
  │  trace : 0xDEADBEEF     │
  └─────────────────────────┘`}</pre>

      <div className="relative z-10 flex max-w-md flex-col items-center gap-3 text-center">
        <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
          {t("indexLabel")}
        </span>
        <h1 className="font-heading text-3xl leading-tight font-medium tracking-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          {t("body")}
        </p>
      </div>

      <Button asChild variant="outline" className="relative z-10">
        <Link href="/">
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
