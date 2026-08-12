import { useTranslations } from "next-intl"

import { SectionHeading } from "@/components/portfolio/section-heading"
import { profile } from "@/lib/profile"

function Education() {
  const t = useTranslations("education")
  const tEntries = useTranslations("education.entries")
  const tLanguages = useTranslations("education.languageEntries")

  return (
    <section
      id="education"
      className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-8 sm:py-20"
    >
      <SectionHeading index={t("indexLabel")} title={t("title")} />

      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <ol className="flex flex-col">
          {profile.education.map((entry, index) => {
            const title = tEntries(`${entry.id}.title`)
            const dates = tEntries(`${entry.id}.dates`)
            const location = entry.location
              ? tEntries.has(`${entry.id}.location`)
                ? tEntries(`${entry.id}.location`)
                : entry.location
              : undefined

            return (
              <li
                key={entry.id}
                className="grid grid-cols-[40px_1fr] gap-x-4 border-b border-border py-4 last:border-b-0"
              >
                <span className="pt-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-heading text-sm font-medium tracking-tight text-foreground sm:text-base">
                    {title}
                  </h3>
                  <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                    {entry.organization}
                    {location ? ` · ${location}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {dates}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>

        <div className="flex flex-col gap-4 rounded-xl border border-border p-5">
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            {t("languagesLabel")}
          </span>
          <ul className="flex flex-col divide-y divide-solid divide-border">
            {profile.languages.map((lang) => (
              <li
                key={lang.id}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span className="text-foreground">
                  {tLanguages(`${lang.id}.name`)}
                </span>
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  {tLanguages(`${lang.id}.level`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

export { Education }
