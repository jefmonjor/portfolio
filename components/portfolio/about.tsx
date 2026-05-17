import { useTranslations } from "next-intl"

import { SectionHeading } from "@/components/portfolio/section-heading"
import { Badge } from "@/components/ui/badge"
import { profile } from "@/lib/profile"

function About() {
  const t = useTranslations("about")
  const tStatus = useTranslations("status")

  return (
    <section
      id="about"
      className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 sm:px-8 sm:py-20"
    >
      <SectionHeading
        index={t("indexLabel")}
        title={t("title")}
        hint={tStatus("detail")}
      />
      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <p className="max-w-2xl text-sm leading-relaxed text-foreground sm:text-base">
          {t("manifesto")}
        </p>
        <div className="flex flex-col gap-3">
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            {t("currentlyWorkingWith")}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {profile.focus.map((item) => (
              <Badge key={item} variant="outline" className="font-mono">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export { About }
