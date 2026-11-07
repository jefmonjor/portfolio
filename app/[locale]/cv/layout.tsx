import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"

import { BackgroundProvider } from "@/components/background-provider"
import { CvFonts } from "@/components/portfolio/cv-fonts"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { isLocale, localizedPath, routing, type Locale } from "@/i18n/routing"
import { absoluteUrl, profile } from "@/lib/profile"
import { pageMetadata } from "@/lib/seo/site-metadata"
import { StructuredDataScript } from "@/components/site/structured-data-script"
import { buildCvStructuredData } from "@/lib/seo/structured-data"

type CvLayoutProps = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

function cvTitle(
  tMeta: Awaited<ReturnType<typeof getTranslations<"metadata">>>
) {
  return tMeta("cvTitle", { shortName: profile.shortName, role: tMeta("role") })
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
  const metadata = pageMetadata({
    locale,
    path: "/cv",
    meta: { title: cvTitle(tMeta), description: tMeta("description") },
    locales: routing.locales,
    type: "profile",
  })

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      types: {
        "text/markdown": `/cv.md?locale=${locale}`,
        "application/json": `/cv.json?locale=${locale}`,
      },
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
    title: cvTitle(tMeta),
    description: tMeta("description"),
    positioning: tMeta("role"),
    currentJobTitle: tMeta("currentJobTitle"),
    publicProjects,
  })
}

export default async function CvLayout({ children, params }: CvLayoutProps) {
  const locale = await resolveCvLocale(params)
  setRequestLocale(locale)
  const structuredData = await cvStructuredData(locale)

  return (
    <NextIntlClientProvider>
      <CvFonts />
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
