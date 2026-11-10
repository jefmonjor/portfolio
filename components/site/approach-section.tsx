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
      <ul className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {approach.principles.map((principle) => (
          <li
            key={principle.title}
            className="border-t border-stroke-soft-200 pt-5"
          >
            <h3 className="font-heading text-title-h5 text-text-strong-950">
              {principle.title}
            </h3>
            <p className="mt-2 text-paragraph-sm text-text-sub-600">
              {principle.body}
            </p>
          </li>
        ))}
      </ul>
    </SiteSection>
  )
}

export { ApproachSection }
