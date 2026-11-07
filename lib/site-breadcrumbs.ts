import type { SitePath } from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"
import { absoluteUrl } from "@/lib/profile"
import { buildBreadcrumbList } from "@/lib/seo/structured-data"

export type Crumb = {
  name: string
  path: SitePath
}

export function breadcrumbStructuredData(
  locale: SiteLocale,
  trail: ReadonlyArray<Crumb>
) {
  return {
    "@context": "https://schema.org",
    ...buildBreadcrumbList(
      trail.map((crumb) => ({
        name: crumb.name,
        url: absoluteUrl(localizedPath(locale, crumb.path)),
      }))
    ),
  }
}
