import { ScrollReveal } from "@/components/site/scroll-reveal"
import { SiteConsole } from "@/components/site/site-console"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { SiteRail } from "@/components/site/site-rail"
import type { SiteContent } from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"
import { buildTerminalData } from "@/lib/site-console"

type SiteShellProps = {
  fontVariable: string
  locale: SiteLocale
  content: SiteContent
  /** Path of the page the rail calls home; with it, wide screens get the rail instead of the top bar. */
  railHome?: `/${string}`
  children: React.ReactNode
}

function SiteShell({
  fontVariable,
  locale,
  content,
  railHome,
  children,
}: SiteShellProps) {
  const page = (
    <>
      <SiteHeader
        locale={locale}
        content={content}
        className={railHome ? "wide:hidden" : undefined}
      />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SiteFooter locale={locale} content={content} />
    </>
  )

  return (
    <div
      className={`underlay ${fontVariable} relative isolate min-h-svh font-heading text-text-strong-950 ${
        railHome
          ? "site-ground wide:grid wide:grid-cols-[18rem_minmax(0,1fr)]"
          : "flex flex-col bg-bg-white-0"
      }`}
    >
      {railHome ? (
        <>
          <SiteRail
            locale={locale}
            content={content}
            homeHref={localizedPath(locale, railHome)}
          />
          <div className="flex min-h-svh min-w-0 flex-col">{page}</div>
        </>
      ) : (
        page
      )}
      <ScrollReveal />
      <SiteConsole
        locale={locale}
        copy={content.console}
        emailSubject={content.contact.email.subject}
        terminal={buildTerminalData(locale, content)}
      />
    </div>
  )
}

export { SiteShell }
