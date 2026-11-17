import { ContactButton } from "@/components/site/contact-button"
import {
  HeadlineLineNumbers,
  HeadlineLines,
  IntroOncePerSession,
} from "@/components/site/hero-headline"
import type { SiteContent } from "@/content/site/types"
import type { SiteLocale } from "@/i18n/routing"
import { profile } from "@/lib/profile"

type WallIntroProps = {
  locale: SiteLocale
  content: SiteContent
}

/** One sentence and a short lead; below wide screens it also carries what the rail shows. */
function WallIntro({ locale, content }: WallIntroProps) {
  const { hero, credentials } = content

  return (
    <section aria-labelledby="hero-title" className="wall-intro">
      <IntroOncePerSession />
      <h1 id="hero-title" className="wall-title font-heading">
        <span className="sr-only">
          {profile.shortName}, {hero.role}.{" "}
        </span>
        <HeadlineLines headline={hero.headline} />
      </h1>
      <p className="hero-reveal mt-4 max-w-[41rem] text-paragraph-md text-text-sub-600 [--step:6] md:text-paragraph-lg">
        {content.wall.lead}
      </p>
      <div className="hero-reveal mt-7 flex flex-col gap-5 [--step:7] wide:hidden">
        <ContactButton
          locale={locale}
          label={hero.cta}
          className="min-h-14 px-6 sm:self-start"
        />
        <div className="flex flex-col gap-1.5 text-paragraph-sm text-text-sub-600">
          <p className="text-label-md text-text-strong-950">{hero.role}</p>
          <p className="status-line text-balance">{hero.engagement}</p>
          <p>
            {credentials.label}{" "}
            {new Intl.ListFormat(locale, { type: "conjunction" }).format(
              credentials.companies
            )}
          </p>
        </div>
      </div>
      <HeadlineLineNumbers headlineId="hero-title" />
    </section>
  )
}

export { WallIntro }
