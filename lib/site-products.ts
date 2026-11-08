import type { SiteLocale } from "@/i18n/routing"
import { profile } from "@/lib/profile"
import enMessages from "@/messages/en.json"
import esMessages from "@/messages/es.json"

export type SiteProduct = {
  id: string
  name: string
  kind: string
  summary: string
  href?: string
  stack: ReadonlyArray<string>
}

type ProductCopy = { name: string; role: string; summary: string }

const productCopy: Record<SiteLocale, Record<string, ProductCopy>> = {
  en: enMessages.projects.entries,
  es: esMessages.projects.entries,
}

/** His own products, read from the CV copy as-is; the site never edits it. */
export function siteProducts(locale: SiteLocale): ReadonlyArray<SiteProduct> {
  return profile.projects.flatMap((project) => {
    const copy = productCopy[locale][project.id]
    if (!copy || project.id === "portfolio") return []
    return [
      {
        id: copy.name.toLowerCase().replace(/\s+/g, ""),
        name: copy.name,
        kind: copy.role.split(" · ").slice(1).join(" · ") || copy.role,
        summary: copy.summary,
        ...("url" in project && project.url ? { href: project.url } : {}),
        stack: project.stack ?? [],
      },
    ]
  })
}
