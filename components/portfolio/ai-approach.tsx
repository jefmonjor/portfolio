import { useTranslations } from "next-intl"

import { SectionHeading } from "@/components/portfolio/section-heading"

const EVIDENCE_KEYS = [
  "dossier",
  "contracts",
  "limits",
  "deterministic",
  "gates",
] as const

// Two-column grid: an odd last card spans both columns, and only the last
// row drops its bottom border on md+.
function cellBorders(index: number, total: number): string {
  const isLast = index === total - 1
  const spansRow = isLast && total % 2 === 1
  const lastRowStart = total - (total % 2 === 1 ? 1 : 2)

  return [
    spansRow ? "md:col-span-2" : index % 2 === 0 ? "md:border-r" : "",
    isLast ? "" : "border-b",
    index >= lastRowStart ? "md:border-b-0" : "",
  ].join(" ")
}

function AiApproach() {
  const t = useTranslations("aiApproach")

  return (
    <section
      id="ai"
      className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-8 sm:py-20"
    >
      <SectionHeading
        index={t("indexLabel")}
        title={t("title")}
        hint={t("hint")}
      />

      <ol className="grid grid-cols-1 overflow-hidden rounded-xl border border-border md:grid-cols-2">
        {EVIDENCE_KEYS.map((key, index) => (
          <li
            key={key}
            className={[
              "flex min-w-0 flex-col gap-3 border-border p-5 sm:p-6",
              cellBorders(index, EVIDENCE_KEYS.length),
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] tracking-widest text-brand tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-heading text-base font-medium tracking-tight text-foreground sm:text-lg">
                {t(`entries.${key}.title`)}
              </h3>
            </div>
            <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
              {t(`entries.${key}.body`)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export { AiApproach }
