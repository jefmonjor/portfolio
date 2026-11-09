import { ArrowLink } from "@/components/site/arrow-link"
import type { SiteContent } from "@/content/site/types"
import { localizedPath, type SiteLocale } from "@/i18n/routing"

type HiringNoteProps = {
  locale: SiteLocale
  hiring: SiteContent["hiring"]
}

/** One line for recruiters, so the same site serves hiring and projects. */
function HiringNote({ locale, hiring }: HiringNoteProps) {
  return (
    <section aria-labelledby="hiring-title" className="site-container">
      <div
        data-reveal
        className="flex flex-col gap-3 border-y border-stroke-soft-200 py-6 lg:flex-row lg:items-baseline lg:gap-12"
      >
        <h2
          id="hiring-title"
          className="shrink-0 font-heading text-title-h5 text-text-strong-950"
        >
          {hiring.title}
        </h2>
        <p className="text-paragraph-md text-text-sub-600">{hiring.body}</p>
        <ArrowLink
          href={localizedPath(locale, "/cv")}
          prefetch={false}
          className="shrink-0 self-start lg:ml-auto lg:self-auto"
        >
          {hiring.cvLink}
        </ArrowLink>
      </div>
    </section>
  )
}

export { HiringNote }
