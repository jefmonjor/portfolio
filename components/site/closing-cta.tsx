import { ContactButton } from "@/components/site/contact-button"
import type { SiteContent } from "@/content/site/types"
import type { SiteLocale } from "@/i18n/routing"

type ClosingCtaProps = {
  locale: SiteLocale
  content: SiteContent
}

function ClosingCta({ locale, content }: ClosingCtaProps) {
  return (
    <section className="site-container mt-16">
      <div className="site-card bg-bg-weak-50 px-6 py-10 md:px-12 md:py-14">
        <p className="max-w-[28ch] font-heading text-title-h3 text-text-strong-950">
          {content.services.closing}
        </p>
        <ContactButton locale={locale} label={content.cta} className="mt-8" />
      </div>
    </section>
  )
}

export { ClosingCta }
