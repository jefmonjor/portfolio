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
      <ol className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
        {approach.pillars.map((pillar) => (
          <li
            key={pillar.title}
            className="border-t border-stroke-soft-200 pt-6"
          >
            <h3 className="font-heading text-title-h5 text-text-strong-950">
              {pillar.title}
            </h3>
            <p className="mt-2 text-paragraph-md text-text-sub-600">
              {pillar.body}
            </p>
          </li>
        ))}
      </ol>
    </SiteSection>
  )
}

export { ApproachSection }
