import { siteFontVariables } from "@/components/site/site-fonts"
import { SiteShell } from "@/components/site/site-shell"
import { resolveSitePage, type SitePageProps } from "@/lib/site-params"

export default async function LabLayout({
  children,
  params,
}: SitePageProps & { children: React.ReactNode }) {
  const { locale, content } = await resolveSitePage(params)

  return (
    <SiteShell
      fontVariable={siteFontVariables}
      locale={locale}
      content={content}
      railHome="/lab"
    >
      {children}
    </SiteShell>
  )
}
