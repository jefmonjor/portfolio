import type { ExperienceGroup } from "@/content/site/types"

type ExperienceTimelineProps = {
  groups: ReadonlyArray<ExperienceGroup>
  renderDetail?: (group: ExperienceGroup) => React.ReactNode
}

function ExperienceTimeline({ groups, renderDetail }: ExperienceTimelineProps) {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="timeline-rail absolute top-2 bottom-2 left-[4px] w-px bg-stroke-soft-200"
      />
      <ol className="flex flex-col gap-10">
        {groups.map((group) => (
          <li key={group.id} className="relative pl-8">
            <span
              aria-hidden
              className="absolute top-1.5 left-0 size-[9px] rounded-full bg-bg-white-0 ring-2 ring-stroke-strong-950 ring-inset"
            />
            <p className="text-label-sm text-text-sub-600 tabular-nums">
              {group.period}
            </p>
            <h3 className="mt-1.5 font-heading text-title-h5 text-text-strong-950">
              {group.organization}
            </h3>
            <p className="text-label-md text-text-strong-950">{group.role}</p>
            <p className="mt-2 max-w-[40rem] text-paragraph-md text-text-sub-600">
              {group.summary}
            </p>
            {renderDetail?.(group)}
          </li>
        ))}
      </ol>
    </div>
  )
}

export { ExperienceTimeline }
