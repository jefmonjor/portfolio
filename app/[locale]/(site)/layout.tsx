import { Instrument_Serif, Inter } from "next/font/google"

import { SiteShell } from "@/components/site/site-shell"
import { StructuredDataScript } from "@/components/site/structured-data-script"
import { getCurrentJobTitle } from "@/content/site"
import { buildSiteStructuredData } from "@/lib/seo/structured-data"
import { resolveSitePage, type SitePageProps } from "@/lib/site-params"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
})

export default async function SiteLayout({
  children,
  params,
}: SitePageProps & { children: React.ReactNode }) {
  const { locale, content } = await resolveSitePage(params)

  return (
    <SiteShell
      fontVariable={`${inter.variable} ${instrumentSerif.variable}`}
      locale={locale}
      content={content}
    >
      {children}
      <StructuredDataScript
        data={buildSiteStructuredData({
          positioning: content.hero.role,
          currentJobTitle: getCurrentJobTitle(locale),
          description: content.meta.home.description,
        })}
      />
    </SiteShell>
  )
}
