"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon, GithubIcon } from "@hugeicons/core-free-icons"

import { ProjectPreview } from "@/components/portfolio/project-preview"
import { TechBadge } from "@/components/portfolio/tech-badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { parseStringArray } from "@/lib/i18n-values"
import type { ProjectEntry } from "@/types/profile"

function hostFromUrl(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "")
  } catch {
    return url
  }
}

type ProjectDialogProps = {
  project: ProjectEntry | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ProjectDialog({ project, open, onOpenChange }: ProjectDialogProps) {
  const t = useTranslations("projects")
  const tEntries = useTranslations("projects.entries")

  if (!project) return null

  const name = tEntries(`${project.id}.name`)
  const summary = tEntries(`${project.id}.summary`)
  const role = tEntries(`${project.id}.role`)
  const highlights = parseStringArray(tEntries.raw(`${project.id}.highlights`))
  const host = project.url ? hostFromUrl(project.url) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[85svh] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        <DialogHeader className="gap-3 border-b border-dashed border-border p-5 sm:p-6">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            <span className="inline-block size-1.5 bg-brand" />
            {project.year ? (
              <span>{project.year}</span>
            ) : (
              <span>{t("detail.label")}</span>
            )}
            {role ? (
              <>
                <span aria-hidden className="text-border">
                  /
                </span>
                <span>{role}</span>
              </>
            ) : null}
          </div>
          <DialogTitle className="font-heading text-2xl tracking-tight sm:text-3xl">
            {name}
          </DialogTitle>
          {host ? (
            <DialogDescription className="font-mono text-[11px] tracking-wide">
              {host}
            </DialogDescription>
          ) : (
            <DialogDescription className="font-mono text-[10px] tracking-widest uppercase">
              {t("privateLabel")}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-5 text-foreground sm:p-6">
          {project.images && project.images.length > 0 ? (
            <ProjectPreview
              images={project.images}
              alt={name}
              sizes="(min-width: 640px) 36rem, 100vw"
              className="border border-dashed border-border"
            />
          ) : null}

          <section className="flex flex-col gap-2">
            <h3 className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              {t("detail.overview")}
            </h3>
            <p className="text-sm leading-relaxed">{summary}</p>
          </section>

          {highlights && highlights.length > 0 ? (
            <section className="flex flex-col gap-2">
              <h3 className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                {t("detail.highlights")}
              </h3>
              <ul className="flex flex-col gap-1.5">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2.5 text-sm leading-relaxed"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 inline-block size-1.5 shrink-0 bg-foreground/50"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {project.stack && project.stack.length > 0 ? (
            <section className="flex flex-col gap-2">
              <h3 className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                {t("detail.stack")}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <TechBadge key={tech} label={tech} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        {project.url || project.repo ? (
          <div className="flex flex-wrap gap-2 border-t border-dashed border-border p-5 sm:p-6">
            {project.url ? (
              <Button asChild size="sm">
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    className="size-3.5"
                    strokeWidth={1.75}
                    data-icon="inline-start"
                  />
                  {t("detail.visit")}
                </a>
              </Button>
            ) : null}
            {project.repo ? (
              <Button asChild size="sm" variant="outline">
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <HugeiconsIcon
                    icon={GithubIcon}
                    className="size-3.5"
                    strokeWidth={1.75}
                    data-icon="inline-start"
                  />
                  {t("detail.repo")}
                </a>
              </Button>
            ) : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export { ProjectDialog }
