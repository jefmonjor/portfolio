import type { Metadata, Viewport } from "next"
import { Figtree, Geist, Geist_Mono } from "next/font/google"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"

import "../globals.css"
import {
  BackgroundInitScript,
  BackgroundProvider,
} from "@/components/background-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { TRPCProvider } from "@/lib/trpc/provider"
import { cn } from "@/lib/utils"
import { profile, siteUrl } from "@/lib/profile"
import {
  buildProfileStructuredData,
  serializeStructuredData,
} from "@/lib/seo/structured-data"
import { isLocale, routing, type Locale } from "@/i18n/routing"

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
})

// Display face for headings — Vercel-school grotesk, pairs with Geist Mono.
const fontDisplay = Geist({
  subsets: ["latin"],
  variable: "--font-display",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const openGraphLocale: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  ca: "ca_ES",
}

const metadataBase = new URL(siteUrl)

const alternateLanguages: Record<string, string> = {
  en: "/en",
  es: "/es",
  ca: "/ca",
  "x-default": "/",
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const tMeta = await getTranslations({ locale, namespace: "metadata" })
  const title = tMeta("titleTemplate", {
    shortName: profile.shortName,
    role: tMeta("role"),
  })
  const description = tMeta("description")

  return {
    metadataBase,
    title,
    description,
    applicationName: tMeta("applicationName", { shortName: profile.shortName }),
    authors: [{ name: profile.name }],
    creator: profile.name,
    publisher: profile.name,
    category: "technology",
    alternates: {
      canonical: `/${locale}`,
      languages: alternateLanguages,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: "profile",
      siteName: `${profile.shortName} — Portfolio`,
      url: `/${locale}`,
      locale: openGraphLocale[locale],
      alternateLocale: routing.locales
        .filter((candidate) => candidate !== locale)
        .map((candidate) => openGraphLocale[candidate]),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  setRequestLocale(locale)

  const tMeta = await getTranslations({ locale, namespace: "metadata" })
  const targetRole = tMeta("role")
  const currentJobTitle = tMeta("currentJobTitle")
  const tProjects = await getTranslations({
    locale,
    namespace: "projects.entries",
  })
  const description = tMeta("description")
  const publicProjects = profile.projects.flatMap((project) => {
    if (project.visibility !== "public" || !project.url) return []

    return [
      {
        id: project.id,
        name: tProjects(`${project.id}.name`),
        description: tProjects(`${project.id}.summary`),
        url: project.url,
        keywords: project.stack ?? [],
        ...(project.repo ? { codeRepository: project.repo } : {}),
      },
    ]
  })
  const structuredData = buildProfileStructuredData({
    locale,
    currentJobTitle,
    publicProjects,
    description,
    title: tMeta("titleTemplate", {
      shortName: profile.shortName,
      role: targetRole,
    }),
  })

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        fontDisplay.variable,
        "font-sans",
        figtree.variable
      )}
    >
      <head>
        <BackgroundInitScript />
        <link rel="describedby" href="/llms.txt" />
        {/* Points crawlers and sourcing agents at the plain-text CV; a PDF
            is the last thing they can read. */}
        <link
          rel="alternate"
          type="text/markdown"
          href={`/cv.md?locale=${locale}`}
          title="CV"
        />
        <link
          rel="alternate"
          type="application/json"
          href={`/cv.json?locale=${locale}`}
          title="CV (MAC)"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeStructuredData(structuredData),
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider>
          <ThemeProvider>
            <BackgroundProvider>
              <TooltipProvider>
                <TRPCProvider>{children}</TRPCProvider>
                <Toaster position="bottom-right" />
              </TooltipProvider>
            </BackgroundProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
