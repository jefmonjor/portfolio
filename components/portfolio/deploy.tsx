import { useTranslations } from "next-intl"

const PLATFORM_KEYS = ["vps", "vercel", "gcloud"] as const

function Deploy() {
  const t = useTranslations("deploy")

  return (
    <section
      aria-label={t("ariaLabel")}
      className="mx-auto max-w-6xl px-4 pb-16 sm:px-8"
    >
      <div className="mb-3 flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        <span className="inline-block size-1.5 bg-brand" />
        <span>{t("title")}</span>
      </div>
      <div className="grid overflow-hidden rounded-xl border border-border md:grid-cols-3">
        {PLATFORM_KEYS.map((key, index) => (
          <div
            key={key}
            className={
              "flex flex-col gap-2 border-border p-5 sm:p-6 " +
              (index > 0 ? "border-t md:border-t-0 md:border-l" : "")
            }
          >
            <span className="font-mono text-xs font-bold tracking-widest text-foreground uppercase">
              {t(`platforms.${key}.name`)}
            </span>
            <span className="text-sm leading-relaxed text-muted-foreground">
              {t(`platforms.${key}.detail`)}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        {t("servicesLabel")} · {t("services")}
      </p>
    </section>
  )
}

export { Deploy }
