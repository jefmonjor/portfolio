import * as paths from "@/lib/tech-icons.generated"
import { profile } from "@/lib/profile"
import {
  TECH_ICON_FALLBACK_ID,
  techIconId,
  techIconSymbolId,
  type TechIconId,
} from "@/lib/tech-icons"

const GENERIC_CODE_GLYPH_PATH =
  "M8.7 15.9 4.8 12l3.9-3.9-1.4-1.4L2 12l5.3 5.3 1.4-1.4zm6.6 0 3.9-3.9-3.9-3.9 1.4-1.4L22 12l-5.3 5.3-1.4-1.4z"

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
          <path d={GENERIC_CODE_GLYPH_PATH} />
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
