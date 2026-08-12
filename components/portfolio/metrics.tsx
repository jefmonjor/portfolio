import { useTranslations } from "next-intl"

const METRIC_KEYS = ["vms", "cobol", "components", "years"] as const

function Metrics() {
  const t = useTranslations("metrics")

  return (
    <section
      aria-label={t("ariaLabel")}
      className="mx-auto max-w-6xl px-4 pb-4 sm:px-8"
    >
      <div className="grid grid-cols-2 border border-border lg:grid-cols-4">
        {METRIC_KEYS.map((key, index) => (
          <div
            key={key}
            className={
              "flex flex-col gap-2 border-border p-5 sm:p-6 " +
              (index % 2 === 1 ? "border-l " : "") +
              (index > 1 ? "border-t " : "") +
              "lg:border-t-0 " +
              (index > 0 ? "lg:border-l" : "")
            }
          >
            <span className="font-mono text-3xl font-bold tracking-tight text-foreground tabular-nums sm:text-4xl">
              {t(`entries.${key}.value`)}
            </span>
            <span className="font-mono text-[10px] leading-relaxed tracking-widest text-muted-foreground uppercase">
              {t(`entries.${key}.label`)}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        {t("caption")}
      </p>
    </section>
  )
}

export { Metrics }
