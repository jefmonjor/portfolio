import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { BackgroundProvider } from "@/components/background-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { isLocale, localizedPath, routing, type Locale } from "@/i18n/routing"
import { absoluteUrl, profile } from "@/lib/profile"
import { ogImageSize } from "@/lib/seo/og-card"
import { ogImagePath } from "@/lib/seo/og-path"
import {
  alternateOpenGraphLocales,
  languageAlternates,
  openGraphLocale,
} from "@/lib/seo/alternates"
import { StructuredDataScript } from "@/components/site/structured-data-script"
import { buildCvStructuredData } from "@/lib/seo/structured-data"

type CvLayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

async function resolveCvLocale(params: CvLayoutProps["params"]) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return locale
}

export async function generateMetadata({
  params,
}: Omit<CvLayoutProps, "children">): Promise<Metadata> {
  const locale = await resolveCvLocale(params)
  const tMeta = await getTranslations({ locale, namespace: "metadata" })
  const title = tMeta("cvTitle", {
    shortName: profile.shortName,
    role: tMeta("role"),
  })
  const description = tMeta("description")
  const url = localizedPath(locale, "/cv")
  const image = { url: ogImagePath(locale, "/cv"), ...ogImageSize, alt: title }

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(routing.locales, "/cv"),
      types: {
        "text/markdown": `/cv.md?locale=${locale}`,
        "application/json": `/cv.json?locale=${locale}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "profile",
      siteName: profile.shortName,
      url,
      locale: openGraphLocale[locale],
      alternateLocale: alternateOpenGraphLocales(routing.locales, locale),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

async function cvStructuredData(locale: Locale) {
  const tMeta = await getTranslations({ locale, namespace: "metadata" })
  const tProjects = await getTranslations({
    locale,
    namespace: "projects.entries",
  })
  const publicProjects = profile.projects.flatMap((project) =>
    project.visibility === "public" && project.url
      ? [
          {
            id: project.id,
            name: tProjects(`${project.id}.name`),
            description: tProjects(`${project.id}.summary`),
            url: project.url,
            keywords: project.stack ?? [],
            ...(project.repo ? { codeRepository: project.repo } : {}),
          },
        ]
      : []
  )

  return buildCvStructuredData({
    locale,
    pageUrl: absoluteUrl(localizedPath(locale, "/cv")),
    title: tMeta("cvTitle", {
      shortName: profile.shortName,
      role: tMeta("role"),
    }),
    description: tMeta("description"),
    jobTitle: tMeta("role"),
    publicProjects,
  })
}

export default async function CvLayout({ children, params }: CvLayoutProps) {
  const locale = await resolveCvLocale(params)
  setRequestLocale(locale)
  const structuredData = await cvStructuredData(locale)

  return (
    <NextIntlClientProvider>
      <BackgroundProvider>
        <TooltipProvider>
          {children}
          <Toaster position="bottom-right" />
        </TooltipProvider>
      </BackgroundProvider>
      <StructuredDataScript data={structuredData} />
    </NextIntlClientProvider>
  )
}
