import { useTranslations } from "next-intl"

import { SectionHeading } from "@/components/portfolio/section-heading"
import { TechBadge } from "@/components/portfolio/tech-badge"
import { parseStringArray } from "@/lib/i18n-values"
import { profile } from "@/lib/profile"

function Skills() {
  const t = useTranslations("skills")
  const tGroups = useTranslations("skills.groups")

  const practiceItems = parseStringArray(t.raw("practiceItems"))

  const totalCount = profile.skills.reduce(
    (acc, group) =>
      acc +
      (group.id === "practice" ? practiceItems.length : group.items.length),
    0
  )

  return (
    <section
      id="skills"
      className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-8 sm:py-20"
    >
      <SectionHeading
        title={t("title")}
        hint={t("hint", { count: totalCount, groups: profile.skills.length })}
      />

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {profile.skills.map((group) => {
          const items = group.id === "practice" ? practiceItems : group.items
          return (
            <div
              key={group.id}
              className="flex flex-col gap-3 border-t border-border pt-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                  {tGroups(group.id)}
                </span>
                <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                  {String(items.length).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <TechBadge
                    key={item}
                    label={item}
                    className="whitespace-normal"
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export { Skills }
