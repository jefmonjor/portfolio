import { getExperienceEntry } from "@/content/site"
import type { ExperienceGroup } from "@/content/site/types"
import type { SiteLocale } from "@/i18n/routing"
import { profile } from "@/lib/profile"

type ExperienceDetailProps = {
  locale: SiteLocale
  group: ExperienceGroup
  presentLabel: string
}

function organizationOf(entryId: string): string {
  return (
    profile.experience.find((entry) => entry.id === entryId)?.organization ?? ""
  )
}

function ExperienceDetail({
  locale,
  group,
  presentLabel,
}: ExperienceDetailProps) {
  return (
    <div className="mt-4 flex flex-col gap-4">
      {group.entries.map((entryId) => {
        const entry = getExperienceEntry(locale, entryId)
        const end = entry.end === "present" ? presentLabel : entry.end

        return (
          <div key={entryId} className="flex flex-col gap-1">
            {group.entries.length > 1 ? (
              <p className="text-label-md text-text-strong-950">
                <span>{organizationOf(entryId)}</span>
                <span className="text-text-sub-600"> · {entry.role}</span>
              </p>
            ) : null}
            <p className="text-label-sm text-text-sub-600 tabular-nums">
              {entry.start} — {end} · {entry.location}
            </p>
          </div>
        )
      })}
      <ul className="flex flex-col gap-2 text-paragraph-md text-text-strong-950">
        {group.highlights.map((highlight) => (
          <li key={highlight} className="flex gap-3">
            <span
              aria-hidden
              className="mt-[0.6875rem] inline-block size-1 shrink-0 rounded-full bg-icon-soft-400"
            />
            {highlight}
          </li>
        ))}
      </ul>
    </div>
  )
}

export { ExperienceDetail }
