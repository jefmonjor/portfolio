import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import "../globals.css"
import { BackgroundInitScript } from "@/components/background-init-script"
import { ThemeProvider } from "@/components/theme-provider"
import { profile, siteUrl } from "@/lib/profile"
import { isLocale, routing } from "@/i18n/routing"

const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION
const bingSiteVerification = process.env.BING_SITE_VERIFICATION

function searchConsoleVerification(): Metadata["verification"] | undefined {
  if (!googleSiteVerification && !bingSiteVerification) return undefined
  return {
    ...(googleSiteVerification ? { google: googleSiteVerification } : {}),
    ...(bingSiteVerification
      ? { other: { "msvalidate.01": bingSiteVerification } }
      : {}),
  }
}

const verification = searchConsoleVerification()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: profile.shortName,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  publisher: profile.name,
  category: "technology",
  ...(verification ? { verification } : {}),
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0e121b" },
  ],
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
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
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className="antialiased"
    >
      <head>
        <BackgroundInitScript />
        <link rel="describedby" href="/llms.txt" />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
