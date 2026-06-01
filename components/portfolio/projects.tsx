"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import { useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"

import { ProjectDialog } from "@/components/portfolio/project-dialog"
import { SectionHeading } from "@/components/portfolio/section-heading"
import { Badge } from "@/components/ui/badge"
import { profile } from "@/lib/profile"
import type { ProjectEntry } from "@/types/profile"

const ease = [0.16, 1, 0.3, 1] as const

function hostFromUrl(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "")
  } catch {
    return url
  }
}

function Projects() {
  const reduce = useReducedMotion()
  const t = useTranslations("projects")
  const tEntries = useTranslations("projects.entries")
  const entries = profile.projects
  const [active, setActive] = React.useState<ProjectEntry | null>(null)

  return (
    <section
      id="projects"
      className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-8 sm:py-20"
    >
      <SectionHeading
        index={t("indexLabel")}
        title={t("title")}
        hint={t("hint", { count: entries.length })}
      />

      <ul className="grid grid-cols-1 gap-0 border border-dashed border-border sm:grid-cols-2">
        {entries.map((entry, index) => {
          const name = tEntries(`${entry.id}.name`)
          const summary = tEntries(`${entry.id}.summary`)
          const host = entry.url ? hostFromUrl(entry.url) : null

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
              className={[
                "group relative flex flex-col gap-4 border-dashed border-border p-5 transition-colors hover:bg-foreground/2.5 focus-within:bg-foreground/2.5 sm:p-6",
                index % 2 === 0 ? "sm:border-r" : "",
                "border-b last:border-b-0 sm:[&:nth-last-child(2):nth-child(odd)]:border-b-0",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => setActive(entry)}
                aria-label={t("openDetail", { name })}
                className="absolute inset-0 z-0 rounded-none outline-none focus-visible:ring-1 focus-visible:ring-foreground/40"
              />

              <div className="pointer-events-none relative z-10 flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h3 className="font-heading text-base font-medium tracking-tight text-foreground sm:text-lg">
                    {name}
                  </h3>
                  {entry.url && host ? (
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      className="pointer-events-auto inline-flex w-fit items-center gap-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
                    >
                      <span>{host}</span>
                      <HugeiconsIcon
                        icon={ArrowUpRight01Icon}
                        className="size-3"
                        strokeWidth={1.75}
                      />
                    </a>
                  ) : (
                    <span className="font-mono text-[10px] tracking-widest text-muted-foreground/70 uppercase">
                      {t("privateLabel")}
                    </span>
                  )}
                </div>
                <span
                  aria-hidden
                  className="mt-1 inline-block size-3.5 shrink-0 border border-foreground/60 bg-background transition-colors group-hover:bg-foreground"
                />
              </div>

              {summary ? (
                <p className="pointer-events-none relative z-10 max-w-prose text-xs leading-relaxed text-foreground sm:text-sm">
                  {summary}
                </p>
              ) : null}

              {entry.stack && entry.stack.length > 0 ? (
                <div className="pointer-events-none relative z-10 flex flex-wrap gap-1.5 pt-1">
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

              <span className="pointer-events-none relative z-10 mt-auto inline-flex items-center gap-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                {t("detail.viewDetails")}
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  className="size-3"
                  strokeWidth={1.75}
                />
              </span>
            </motion.li>
          )
        })}
      </ul>

      <ProjectDialog
        project={active}
        open={active !== null}
        onOpenChange={(next) => {
          if (!next) setActive(null)
        }}
      />
    </section>
  )
}

export { Projects }
