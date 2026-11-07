import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { ViewTransition } from "react"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { StructuredDataScript } from "@/components/site/structured-data-script"
import { getSiteContent } from "@/content/site"
import { isSiteLocale } from "@/i18n/routing"
import { buildSiteStructuredData } from "@/lib/seo/structured-data"

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isSiteLocale(locale)) notFound()
  setRequestLocale(locale)
  const content = getSiteContent(locale)

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader locale={locale} content={content} />
      <ViewTransition>
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
      </ViewTransition>
      <SiteFooter locale={locale} content={content} />
      <StructuredDataScript
        data={buildSiteStructuredData({
          jobTitle: content.hero.role,
          description: content.meta.home.description,
        })}
      />
    </div>
  )
}
