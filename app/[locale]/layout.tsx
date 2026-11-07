import type { Metadata, Viewport } from "next"
import { Figtree, Fraunces, Geist_Mono } from "next/font/google"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"

import "../globals.css"
import { BackgroundInitScript } from "@/components/background-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { profile, siteUrl } from "@/lib/profile"
import { isLocale, routing } from "@/i18n/routing"

const fontSans = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz"],
  display: "optional",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  preload: false,
})

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
  robots: { index: true, follow: true },
  ...(verification ? { verification } : {}),
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#130e0b" },
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
      suppressHydrationWarning
      className={cn(
        "font-sans antialiased",
        fontSans.variable,
        fontDisplay.variable,
        fontMono.variable
      )}
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
