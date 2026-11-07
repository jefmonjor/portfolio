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
        className="timeline-rail absolute top-2 bottom-2 left-[3px] w-px bg-border"
      />
      <ol className="flex flex-col gap-10">
        {groups.map((group) => (
          <li key={group.id} className="enter-on-scroll relative pl-8">
            <span
              aria-hidden
              className="absolute top-[0.55rem] left-0 size-[7px] bg-brand"
            />
            <p className="text-sm text-muted-foreground tabular-nums">
              {group.period}
            </p>
            <h3 className="mt-1 font-heading text-[1.375rem] leading-snug font-medium tracking-[-0.01em] text-foreground">
              {group.organization}
            </h3>
            <p className="text-[0.9375rem] font-medium text-foreground">
              {group.role}
            </p>
            <p className="mt-2 max-w-[40rem] text-[1.0625rem] leading-relaxed text-muted-foreground">
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
