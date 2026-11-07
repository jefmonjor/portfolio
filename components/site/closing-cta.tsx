import { ContactButton } from "@/components/site/contact-button"
import type { SiteContent } from "@/content/site/types"
import type { SiteLocale } from "@/i18n/routing"

type ClosingCtaProps = {
  locale: SiteLocale
  content: SiteContent
}

function ClosingCta({ locale, content }: ClosingCtaProps) {
  return (
    <section className="site-container mt-8 border-t border-border pt-14 md:pt-20">
      <p className="max-w-[30ch] font-heading text-[clamp(1.5rem,1.6vw+1.1rem,2.25rem)] leading-snug font-medium tracking-[-0.01em] text-foreground">
        {content.services.closing}
      </p>
      <ContactButton locale={locale} label={content.cta} className="mt-8" />
    </section>
  )
}

export { ClosingCta }
