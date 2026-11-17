import { ScrollReveal } from "@/components/site/scroll-reveal"
import { SiteConsole } from "@/components/site/site-console"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { SiteRail } from "@/components/site/site-rail"
import type { SiteContent } from "@/content/site/types"
import type { SiteLocale } from "@/i18n/routing"
import { buildTerminalData } from "@/lib/site-console"

type SiteShellProps = {
  fontVariable: string
  locale: SiteLocale
  content: SiteContent
  children: React.ReactNode
}

/** From 75rem the rail carries the navigation; below it, the top bar does. */
function SiteShell({
  fontVariable,
  locale,
  content,
  children,
}: SiteShellProps) {
  return (
    <div
      className={`underlay ${fontVariable} site-ground relative isolate min-h-svh font-heading text-text-strong-950 wide:grid wide:grid-cols-[18rem_minmax(0,1fr)]`}
    >
      <SiteRail locale={locale} content={content} />
      <div className="flex min-h-svh min-w-0 flex-col">
        <SiteHeader locale={locale} content={content} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter locale={locale} content={content} />
      </div>
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
