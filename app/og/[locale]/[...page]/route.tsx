import { getTranslations } from "next-intl/server"

import {
  findCaseStudy,
  getSiteContent,
  indexableSitePaths,
  isCaseStudySlug,
} from "@/content/site"
import { headlineText, type SitePath } from "@/content/site/types"
import {
  isLocale,
  isSiteLocale,
  routing,
  siteLocales,
  type Locale,
} from "@/i18n/routing"
import { profile } from "@/lib/profile"
import { renderOgCard, type OgCard } from "@/lib/seo/og-card"
import { ogImagePath, ogPageFromSegments } from "@/lib/seo/og-path"

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

function siteCard(
  locale: Parameters<typeof getSiteContent>[0],
  page: string
): OgCard | null {
  const content = getSiteContent(locale)
  const identity = { name: content.hero.name, role: content.hero.role }
  const slug = page.replace(/^\/work\//, "")

  if (page === "/")
    return {
      ...identity,
      eyebrow: content.hero.role,
      title: headlineText(content.hero.headline),
    }
  if (page.startsWith("/work/") && isCaseStudySlug(slug)) {
    const study = findCaseStudy(content, slug)
    return { ...identity, eyebrow: study.sector, title: study.title }
  }
  if (page === "/privacy") {
    return {
      ...identity,
      eyebrow: content.footer.privacy,
      title: content.meta.privacy.title,
    }
  }
  const sections = ["services", "work", "experience", "contact"] as const
  const section = sections.find((candidate) => page === `/${candidate}`)
  return section
    ? {
        ...identity,
        eyebrow: content.nav[section],
        title: content.meta[section].title,
      }
    : null
}

export async function GET(_request: Request, { params }: OgRouteContext) {
  const { locale, page: segments } = await params
  const page = ogPageFromSegments(segments)
  if (!isLocale(locale)) return new Response(null, { status: 404 })

  const card =
    page === "/cv"
      ? await cvCard(locale)
      : isSiteLocale(locale)
        ? siteCard(locale, page)
        : null
  return card ? renderOgCard(card) : new Response(null, { status: 404 })
}
