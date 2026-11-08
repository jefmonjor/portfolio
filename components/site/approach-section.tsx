import { SiteSection } from "@/components/site/site-section"
import type { SiteContent } from "@/content/site/types"

type ApproachSectionProps = {
  content: SiteContent
}

function ApproachSection({ content }: ApproachSectionProps) {
  const { approach } = content

  return (
    <SiteSection
      id="approach"
      title={content.display.approach}
      intro={approach.intro}
    >
      <ol className="pipeline">
        {approach.pipeline.map((stage) => (
          <li
            key={stage.step}
            className={
              stage.human ? "pipeline-stage is-human" : "pipeline-stage"
            }
          >
            <span className="pipeline-step">{stage.step}</span>
            <span className="pipeline-by">{stage.by}</span>
          </li>
        ))}
      </ol>
      <h3 className="mt-12 font-heading text-title-h4 text-text-strong-950">
        {approach.principlesTitle}
      </h3>
      <ul className="mt-8 grid gap-x-12 gap-y-10 md:grid-cols-2">
        {approach.principles.map((principle, index) => (
          <li
            key={principle.title}
            className={`border-t border-stroke-soft-200 pt-6 ${index === 0 ? "md:col-span-2" : ""}`}
          >
            <h4
              className={`font-heading text-text-strong-950 ${index === 0 ? "text-title-h4" : "text-title-h5"}`}
            >
              {principle.title}
            </h4>
            <p
              className={`mt-2 text-text-sub-600 ${index === 0 ? "max-w-[46rem] text-paragraph-lg" : "text-paragraph-md"}`}
            >
              {principle.body}
            </p>
          </li>
        ))}
      </ul>
    </SiteSection>
  )
}

export { ApproachSection }
