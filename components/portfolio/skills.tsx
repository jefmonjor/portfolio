import { useTranslations } from "next-intl"

import { SectionHeading } from "@/components/portfolio/section-heading"
import { Badge } from "@/components/ui/badge"
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
        index={t("indexLabel")}
        title={t("title")}
        hint={t("hint", { count: totalCount, groups: profile.skills.length })}
      />

      <div className="grid grid-cols-1 gap-0 border border-dashed border-border sm:grid-cols-2 lg:grid-cols-3">
        {profile.skills.map((group, index) => {
          const items = group.id === "practice" ? practiceItems : group.items
          return (
            <div
              key={group.id}
              className={[
                "flex flex-col gap-3 border-dashed border-border p-4 sm:p-5",
                index % 2 === 0 ? "sm:border-r" : "lg:border-r",
                "border-b last:border-b-0 lg:border-r [&:nth-child(3n)]:lg:border-r-0",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  {tGroups(group.id)}
                </span>
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground/60 uppercase">
                  {String(items.length).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <Badge
                    key={item}
                    variant="outline"
                    className="h-auto max-w-full font-mono text-[10px] whitespace-normal"
                  >
                    {item}
                  </Badge>
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
