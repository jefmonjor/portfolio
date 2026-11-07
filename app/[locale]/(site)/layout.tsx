import { SiteFooter } from "@/components/site/site-footer"
import { ScrollReveal } from "@/components/site/scroll-reveal"
import { SiteHeader } from "@/components/site/site-header"
import { StructuredDataScript } from "@/components/site/structured-data-script"
import { getCurrentJobTitle } from "@/content/site"
import { buildSiteStructuredData } from "@/lib/seo/structured-data"
import { resolveSitePage, type SitePageProps } from "@/lib/site-params"

export default async function SiteLayout({
  children,
  params,
}: SitePageProps & { children: React.ReactNode }) {
  const { locale, content } = await resolveSitePage(params)

  return (
    <div className="site-atmosphere relative isolate flex min-h-svh flex-col bg-background text-foreground">
      <SiteHeader locale={locale} content={content} />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SiteFooter locale={locale} content={content} />
      <ScrollReveal />
      <StructuredDataScript
        data={buildSiteStructuredData({
          positioning: content.hero.role,
          currentJobTitle: getCurrentJobTitle(locale),
          description: content.meta.home.description,
        })}
      />
    </div>
  )
}
