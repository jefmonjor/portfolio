import type { Metadata, Viewport } from "next"
import { Figtree, Geist_Mono } from "next/font/google"
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
import { profile } from "@/lib/profile"
import { isLocale, routing, type Locale } from "@/i18n/routing"
import { parseStringArray } from "@/lib/i18n-values"

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const openGraphLocale: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
}

const fallbackMetadataBase = new URL("https://mdbep.dev")

function getMetadataBase(): URL {
  const value = process.env.NEXT_PUBLIC_APP_URL
  if (!value) return fallbackMetadataBase

  try {
    return new URL(value)
  } catch {
    return fallbackMetadataBase
  }
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
  const keywordsExtra = parseStringArray(tMeta.raw("keywordsExtra"))

  return {
    metadataBase: getMetadataBase(),
    title,
    description,
    applicationName: tMeta("applicationName", { shortName: profile.shortName }),
    authors: [{ name: profile.name }],
    keywords: [...profile.focus, ...keywordsExtra, tMeta("role")],
    openGraph: {
      title,
      description,
      type: "profile",
      locale: openGraphLocale[locale],
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

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        figtree.variable
      )}
    >
      <head>
        <BackgroundInitScript />
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
