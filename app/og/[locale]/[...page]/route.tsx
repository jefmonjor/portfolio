import { getTranslations } from "next-intl/server"

import { getSiteContent, indexableSitePaths } from "@/content/site"
import {
  headlineText,
  type SiteContent,
  type SitePath,
} from "@/content/site/types"
import {
  isLocale,
  isSiteLocale,
  routing,
  siteLocales,
  type Locale,
} from "@/i18n/routing"
import { profile } from "@/lib/profile"
import { renderOgCard, type OgCard } from "@/lib/seo/og-card"
import { ogImagePath } from "@/lib/seo/og-path"

export const dynamic = "force-static"
export const dynamicParams = false

type OgRouteContext = {
  params: Promise<{ locale: string; page: string[] }>
}

function segmentsOf(locale: Locale, page: SitePath): string[] {
  return ogImagePath(locale, page).split("/").slice(3)
}

export function generateStaticParams() {
  const sitePages = siteLocales.flatMap((locale) =>
    indexableSitePaths.map((page) => ({
      locale,
      page: segmentsOf(locale, page),
    }))
  )
  const cvPages = routing.locales.map((locale) => ({
    locale,
    page: segmentsOf(locale, "/cv"),
  }))
  return [...sitePages, ...cvPages]
}

async function cvCard(locale: Locale): Promise<OgCard> {
  const tMeta = await getTranslations({ locale, namespace: "metadata" })
  return {
    name: profile.shortName,
    role: tMeta("role"),
    eyebrow: "CV",
    title: profile.name,
  }
}

function sitePageText(
  content: SiteContent,
  page: SitePath
): Pick<OgCard, "eyebrow" | "title"> | null {
  const study = content.work.cases.find(
    (entry) => `/work/${entry.slug}` === page
  )
  if (study) return { eyebrow: study.sector, title: study.title }

  switch (page) {
    case "/":
      return {
        eyebrow: content.hero.role,
        title: headlineText(content.hero.headline),
      }
    case "/services":
      return {
        eyebrow: content.nav.services,
        title: content.meta.services.title,
      }
    case "/work":
      return { eyebrow: content.nav.work, title: content.meta.work.title }
    case "/experience":
      return {
        eyebrow: content.nav.experience,
        title: content.meta.experience.title,
      }
    case "/contact":
      return { eyebrow: content.nav.contact, title: content.meta.contact.title }
    case "/privacy":
      return {
        eyebrow: content.footer.privacy,
        title: content.meta.privacy.title,
      }
    default:
      return null
  }
}

function publishedPage(locale: Locale, segments: ReadonlyArray<string>) {
  const requested = `/og/${locale}/${segments.join("/")}`
  const pages: ReadonlyArray<SitePath> = isSiteLocale(locale)
    ? [...indexableSitePaths, "/cv"]
    : ["/cv"]
  return pages.find((page) => ogImagePath(locale, page) === requested)
}

async function cardFor(locale: Locale, page: SitePath) {
  if (page === "/cv") return cvCard(locale)
  if (!isSiteLocale(locale)) return null
  const content = getSiteContent(locale)
  const text = sitePageText(content, page)
  return text
    ? { name: profile.shortName, role: content.hero.role, ...text }
    : null
}

export async function GET(_request: Request, { params }: OgRouteContext) {
  const { locale, page: segments } = await params
  const page = isLocale(locale) ? publishedPage(locale, segments) : undefined
  const card = page && isLocale(locale) ? await cardFor(locale, page) : null
  return card ? renderOgCard(card) : new Response(null, { status: 404 })
}
