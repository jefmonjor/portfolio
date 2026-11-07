import Link from "next/link"

import { ArrowLabel } from "@/components/site/arrow-label"
import { localizedPath, type SiteLocale } from "@/i18n/routing"

type ClosingCtaProps = {
  locale: SiteLocale
  statement: string
  cta: string
}

function ClosingCta({ locale, statement, cta }: ClosingCtaProps) {
  return (
    <section className="site-container mt-8 border-t border-border pt-14 md:pt-20">
      <p className="max-w-[30ch] font-heading text-[clamp(1.5rem,1.6vw+1.1rem,2.25rem)] leading-snug font-medium tracking-[-0.01em] text-foreground">
        {statement}
      </p>
      <Link
        href={localizedPath(locale, "/contact")}
        className="site-button mt-8 w-full sm:w-auto"
      >
        <ArrowLabel>{cta}</ArrowLabel>
      </Link>
    </section>
  )
}

export { ClosingCta }
