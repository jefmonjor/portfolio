import { Bricolage_Grotesque, Source_Sans_3 } from "next/font/google"

import { SiteShell } from "@/components/site/site-shell"
import { StructuredDataScript } from "@/components/site/structured-data-script"
import { getCurrentJobTitle } from "@/content/site"
import { localizedPath } from "@/i18n/routing"
import { siteUrl } from "@/lib/profile"
import { buildSiteStructuredData } from "@/lib/seo/structured-data"
import { resolveSitePage, type SitePageProps } from "@/lib/site-params"

const text = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-text",
  display: "swap",
})

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
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
      fontVariable={`${text.variable} ${display.variable}`}
      locale={locale}
      content={content}
    >
      {children}
      <StructuredDataScript
        data={buildSiteStructuredData({
          positioning: content.hero.role,
          currentJobTitle: getCurrentJobTitle(locale),
          description: content.meta.home.description,
          services: content.services.items.map((service) => ({
            name: service.name,
            description: service.summary,
            url: `${siteUrl}${localizedPath(locale, "/services")}#${service.id}`,
          })),
        })}
      />
    </SiteShell>
  )
}
