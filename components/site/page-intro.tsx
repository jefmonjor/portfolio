import Link from "next/link"

import { StructuredDataScript } from "@/components/site/structured-data-script"
import { localizedPath, type SiteLocale } from "@/i18n/routing"
import { breadcrumbStructuredData, type Crumb } from "@/lib/site-breadcrumbs"

type PageIntroProps = {
  locale: SiteLocale
  title: string
  intro?: string
  eyebrow?: string
  trail: ReadonlyArray<Crumb>
  breadcrumbLabel: string
  children?: React.ReactNode
}

function PageIntro({
  locale,
  title,
  intro,
  eyebrow,
  trail,
  breadcrumbLabel,
  children,
}: PageIntroProps) {
  const ancestors = trail.slice(0, -1)

  return (
    <header className="site-container pt-8 pb-12 md:pt-12 md:pb-16">
      <nav aria-label={breadcrumbLabel}>
        <ol className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
          {ancestors.map((crumb) => (
            <li key={crumb.path} className="flex items-center gap-2">
              <Link
                href={localizedPath(locale, crumb.path)}
                className="inline-flex min-h-11 items-center transition-colors hover:text-foreground"
              >
                {crumb.name}
              </Link>
              <span aria-hidden className="text-border">
                /
              </span>
            </li>
          ))}
        </ol>
      </nav>
      {eyebrow ? (
        <p className="mt-4 text-sm font-medium text-brand">{eyebrow}</p>
      ) : null}
      <h1 className="mt-2 max-w-[24ch] font-heading text-[clamp(2.25rem,3vw+1.5rem,3.75rem)] leading-[1.06] font-medium tracking-[-0.02em] text-foreground">
        {title}
      </h1>
      {intro ? (
        <p className="site-prose mt-6 text-muted-foreground">{intro}</p>
      ) : null}
      {children}
      <StructuredDataScript data={breadcrumbStructuredData(locale, trail)} />
    </header>
  )
}

export { PageIntro }
