import * as paths from "@/lib/tech-icons.generated"
import { profile } from "@/lib/profile"
import { techIconId, type TechIconId } from "@/lib/tech-icons"

export const TECH_ICON_FALLBACK_ID = "ti-fallback"

// Generic code glyph for tools with no brand icon (trademark removals in
// simple-icons, concepts like "Microservices") so every badge reads the same.
const FALLBACK_PATH =
  "M8.7 15.9 4.8 12l3.9-3.9-1.4-1.4L2 12l5.3 5.3 1.4-1.4zm6.6 0 3.9-3.9-3.9-3.9 1.4-1.4L22 12l-5.3 5.3-1.4-1.4z"

export function techIconSymbolId(id: TechIconId): string {
  return `ti-${id}`
}

function usedIconIds(): TechIconId[] {
  const labels = [
    ...profile.skills.flatMap((group) => group.items),
    ...profile.experience.flatMap((entry) => entry.stack ?? []),
    ...profile.projects.flatMap((entry) => entry.stack ?? []),
  ]
  const ids = new Set<TechIconId>()
  for (const label of labels) {
    const id = techIconId(label)
    if (id) ids.add(id)
  }
  return [...ids]
}

// Every tech badge used to inline its full brand path: ~150 KB of SVG in the
// HTML, sent twice (markup and RSC payload). Each glyph is now defined once
// here and badges reference it with <use>, which also works inside portals
// such as the project dialog because the ids are document-wide.
function TechIconSprite() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      className="pointer-events-none absolute size-0 overflow-hidden"
    >
      <defs>
        <symbol id={TECH_ICON_FALLBACK_ID} viewBox="0 0 24 24">
          <path d={FALLBACK_PATH} />
        </symbol>
        {usedIconIds().map((id) => (
          <symbol key={id} id={techIconSymbolId(id)} viewBox="0 0 24 24">
            <path d={paths[id].path} />
          </symbol>
        ))}
      </defs>
    </svg>
  )
}

export { TechIconSprite }
