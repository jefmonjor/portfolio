import { ScrollReveal } from "@/components/site/scroll-reveal"
import { SiteConsole } from "@/components/site/site-console"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import type { SiteContent } from "@/content/site/types"
import type { SiteLocale } from "@/i18n/routing"
import { buildTerminalData } from "@/lib/site-console"

type SiteShellProps = {
  fontVariable: string
  locale: SiteLocale
  content: SiteContent
  children: React.ReactNode
}

function SiteShell({
  fontVariable,
  locale,
  content,
  children,
}: SiteShellProps) {
  return (
    <div
      className={`underlay ${fontVariable} relative isolate flex min-h-svh flex-col bg-bg-white-0 font-heading text-text-strong-950`}
    >
      <SiteHeader locale={locale} content={content} />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SiteFooter locale={locale} content={content} />
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
