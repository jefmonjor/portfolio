import { useTranslations } from "next-intl"

import { portfolioUpdatedAt, profile } from "@/lib/profile"

function Footer() {
  const t = useTranslations("footer")
  const tHero = useTranslations("hero")

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          <span className="inline-block size-1.5 bg-foreground" />
          <span>{profile.shortName}</span>
          <span className="text-border">/</span>
          <span>{tHero("role")}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          <span>{t("lastUpdated", { date: portfolioUpdatedAt })}</span>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
