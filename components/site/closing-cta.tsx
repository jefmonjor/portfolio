import { ContactButton } from "@/components/site/contact-button"
import type { SiteContent } from "@/content/site/types"
import type { SiteLocale } from "@/i18n/routing"

type ClosingCtaProps = {
  locale: SiteLocale
  content: SiteContent
}

function ClosingCta({ locale, content }: ClosingCtaProps) {
  return (
    <section className="site-container mt-10">
      <div className="surface-brand brand-panel px-6 py-12 md:px-12 md:py-16">
        <p className="max-w-[26ch] font-heading text-title-h3 text-text-strong-950">
          {content.services.closing}
        </p>
        <ContactButton
          locale={locale}
          label={content.cta}
          className="mt-8 min-h-14 px-6"
        />
      </div>
    </section>
  )
}

export { ClosingCta }
