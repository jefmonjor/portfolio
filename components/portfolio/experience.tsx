"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { useTranslations } from "next-intl"

import { SectionHeading } from "@/components/portfolio/section-heading"
import { Badge } from "@/components/ui/badge"
import { profile } from "@/lib/profile"

const ease = [0.16, 1, 0.3, 1] as const

function Experience() {
  const reduce = useReducedMotion()
  const t = useTranslations("experience")
  const tEntries = useTranslations("experience.entries")
  const tCommon = useTranslations("common")
  const entries = profile.experience

  return (
    <section
      id="experience"
      className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-8 sm:py-20"
    >
      <SectionHeading
        index={t("indexLabel")}
        title={t("title")}
        hint={t("hint", { count: entries.length })}
      />

      <ol className="relative grid grid-cols-1 gap-0">
        <span
          aria-hidden
          className="absolute top-0 bottom-0 left-[7px] w-px bg-border sm:left-[calc(7rem-1px)]"
        />
        {entries.map((entry, index) => {
          const role = tEntries(`${entry.id}.role`)
          const location = tEntries(`${entry.id}.location`)
          const start = tEntries(`${entry.id}.start`)
          const endValue = tEntries(`${entry.id}.end`)
          const end = endValue === "present" ? tCommon("present") : endValue
          const summary = tEntries(`${entry.id}.summary`)
          const highlights = tEntries.raw(
            `${entry.id}.highlights`
          ) as ReadonlyArray<string>

          return (
            <motion.li
              key={entry.id}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.45,
                ease,
                delay: reduce ? 0 : Math.min(index * 0.05, 0.25),
              }}
              className="group relative grid grid-cols-[20px_1fr] gap-x-4 border-b border-dashed border-border py-5 last:border-b-0 sm:grid-cols-[7rem_1fr]"
            >
              <div className="relative flex items-start pt-1 sm:pt-1.5">
                <span
                  aria-hidden
                  className="absolute left-0 inline-block size-3.5 -translate-y-[1px] border border-foreground/60 bg-background transition-colors group-hover:bg-foreground sm:left-[calc(7rem-1.4rem)]"
                />
                <span className="hidden font-mono text-[11px] tracking-widest text-muted-foreground uppercase sm:inline-block">
                  {start}
                  <span className="block text-[10px] text-muted-foreground/70">
                    → {end}
                  </span>
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase sm:hidden">
                    {start} → {end}
                  </span>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-heading text-base font-medium tracking-tight text-foreground sm:text-lg">
                      {role}
                    </h3>
                    <span className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">
                      {entry.organization}
                    </span>
                  </div>
                  <p className="font-mono text-[10px] tracking-widest text-muted-foreground/80 uppercase">
                    {location}
                  </p>
                </div>

                {summary ? (
                  <p className="max-w-2xl text-xs leading-relaxed text-foreground sm:text-sm">
                    {summary}
                  </p>
                ) : null}

                {highlights && highlights.length > 0 ? (
                  <ul className="flex flex-col gap-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {highlights.map((hl) => (
                      <li key={hl} className="flex gap-2">
                        <span
                          aria-hidden
                          className="mt-[7px] inline-block size-1 shrink-0 bg-foreground/40"
                        />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {entry.stack && entry.stack.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {entry.stack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="font-mono text-[10px]"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.li>
          )
        })}
      </ol>
    </section>
  )
}

export { Experience }
