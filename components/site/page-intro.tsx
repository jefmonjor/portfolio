import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"

import { StructuredDataScript } from "@/components/site/structured-data-script"
import type { SiteContent } from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"
import { breadcrumbStructuredData, type Crumb } from "@/lib/site-breadcrumbs"

type PageIntroProps = {
  locale: SiteLocale
  content: SiteContent
  title: string
  intro?: string
  eyebrow?: string
  crumbs: ReadonlyArray<Crumb>
}

function PageIntro({
  locale,
  content,
  title,
  intro,
  eyebrow,
  crumbs,
}: PageIntroProps) {
  const trail: ReadonlyArray<Crumb> = [
    { name: content.nav.home, path: "/" },
    ...crumbs,
  ]
  const ancestors = trail.slice(0, -1)
  const current = trail[trail.length - 1]

  return (
    <header className="site-container pt-6 pb-8 md:pt-8 md:pb-10">
      <nav aria-label={content.nav.breadcrumb}>
        <ol className="flex flex-wrap items-center gap-x-2 text-label-sm text-text-sub-600">
          {ancestors.map((crumb) => (
            <li key={crumb.path} className="flex items-center gap-2">
              <Link
                href={localizedPath(locale, crumb.path)}
                className="inline-flex min-h-11 items-center transition-colors hover:text-text-strong-950"
              >
                {crumb.name}
              </Link>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                aria-hidden
                className="size-3.5 text-icon-soft-400"
                strokeWidth={1.75}
              />
            </li>
          ))}
          {ancestors.length > 0 ? (
            <li
              aria-current="page"
              className="max-w-[28ch] truncate text-text-strong-950"
            >
              {current.name}
            </li>
          ) : null}
        </ol>
      </nav>
      {eyebrow ? (
        <p className="mt-4 text-subheading-xs text-text-sub-600 uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-3 max-w-[22ch] font-heading text-title-h2 text-text-strong-950">
        {title}
      </h1>
      {intro ? (
        <p className="site-prose mt-5 text-text-sub-600">{intro}</p>
      ) : null}
      <StructuredDataScript data={breadcrumbStructuredData(locale, trail)} />
    </header>
  )
}

export { PageIntro }
