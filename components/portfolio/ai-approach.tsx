import { useTranslations } from "next-intl"

import { SectionHeading } from "@/components/portfolio/section-heading"

const EVIDENCE_KEYS = [
  "dossier",
  "contracts",
  "limits",
  "deterministic",
  "gates",
] as const

// Open two-column list: a rule above each point, no box around them. An odd
// last point spans both columns so its rule runs the full width.
function spanClass(index: number, total: number): string {
  return index === total - 1 && total % 2 === 1 ? "md:col-span-2" : ""
}

function AiApproach() {
  const t = useTranslations("aiApproach")

  return (
    <section
      id="ai"
      className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-8 sm:py-20"
    >
      <SectionHeading title={t("title")} hint={t("hint")} />

      <ol className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
        {EVIDENCE_KEYS.map((key, index) => (
          <li
            key={key}
            className={[
              "flex min-w-0 flex-col gap-3 border-t border-border pt-4",
              spanClass(index, EVIDENCE_KEYS.length),
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-widest text-brand tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-heading text-base font-medium tracking-tight text-foreground sm:text-lg">
                {t(`entries.${key}.title`)}
              </h3>
            </div>
            <p className="max-w-[33rem] text-sm leading-relaxed text-muted-foreground">
              {t(`entries.${key}.body`)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export { AiApproach }
