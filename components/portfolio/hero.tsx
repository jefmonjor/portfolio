"use client"

import {
  ArrowDownIcon,
  Linkedin01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Fragment } from "react"
import { motion, useReducedMotion } from "motion/react"
import { useLocale, useTranslations } from "next-intl"

import { CvDownloadButton } from "@/components/portfolio/cv-download-button"
import { HeroBadge } from "@/components/portfolio/hero-badge"
import { LocalClock } from "@/components/portfolio/local-clock"
import { ScrambleText } from "@/components/portfolio/scramble-text"
import { Button } from "@/components/ui/button"
import { profile, profileTimeZone } from "@/lib/profile"

const ease = [0.16, 1, 0.3, 1] as const

const titleWords = profile.name.split(" ")

function Hero() {
  const reduce = useReducedMotion()
  const t = useTranslations("hero")
  const tSpecs = useTranslations("hero.specs")
  const locale = useLocale()

  const specRows: ReadonlyArray<{
    label: string
    value: React.ReactNode
  }> = [
    { label: tSpecs("location"), value: profile.location },
    {
      label: tSpecs("timezone"),
      value: (
        <span className="flex items-center gap-2">
          <span>{profile.timezone}</span>
          <span aria-hidden className="text-border">
            ·
          </span>
          <LocalClock
            timeZone={profileTimeZone}
            locale={locale}
            className="font-mono text-muted-foreground tabular-nums"
          />
        </span>
      ),
    },
    { label: tSpecs("focus"), value: profile.focus.join(" · ") },
    { label: tSpecs("since"), value: profile.since },
  ]

  const emailHref = "#contact"
  const linkedinHref =
    profile.socials.find((s) => s.kind === "linkedin")?.href ?? "#"

  return (
    <section
      id="top"
      className="relative mx-auto grid max-w-6xl gap-10 px-4 pt-12 pb-20 sm:px-8 sm:pt-16 sm:pb-24 lg:grid-cols-[1.4fr_1fr] lg:gap-16"
    >
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3 font-mono text-[11px] tracking-widest text-brand uppercase">
          <span className="inline-block h-px w-8 bg-brand/50" />
          {t("indexLabel")}
        </div>

        <h1 className="font-heading text-[clamp(2.5rem,5.5vw+1rem,5rem)] leading-[0.95] font-medium tracking-[-0.03em] text-foreground">
          <span className="sr-only">{profile.name}</span>
          {/* Inline flow (not flex) so text-wrap: balance can even out the
              line breaks on any viewport — no more dangling last words. */}
          <span aria-hidden className="block text-balance">
            {titleWords.map((word, index) => (
              <Fragment key={`${word}-${index}`}>
                <motion.span
                  className="inline-block"
                  initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.55,
                    ease,
                    delay: reduce ? 0 : 0.08 * index,
                  }}
                >
                  {word}
                </motion.span>
                {index < titleWords.length - 1 ? " " : null}
              </Fragment>
            ))}
          </span>
        </h1>

        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            ease,
            delay: reduce ? 0 : 0.08 * titleWords.length + 0.05,
          }}
          className="flex flex-col gap-4"
        >
          <p className="font-mono text-xs tracking-widest text-balance text-muted-foreground uppercase">
            <ScrambleText
              value={t("role")}
              className="text-foreground"
              delay={400}
              duration={700}
            />{" "}
            <span className="text-border">/</span> {profile.location}
          </p>
          <p className="max-w-xl text-sm leading-relaxed text-foreground sm:text-base">
            {t("tagline")}
          </p>
        </motion.div>

        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease,
            delay: reduce ? 0 : 0.08 * titleWords.length + 0.15,
          }}
          className="flex flex-wrap items-center gap-2"
        >
          <Button asChild size="lg">
            <a href={emailHref}>
              <HugeiconsIcon
                icon={Mail01Icon}
                className="size-3.5"
                strokeWidth={1.75}
                data-icon="inline-start"
              />
              {t("cta.contact")}
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={linkedinHref} target="_blank" rel="noopener noreferrer">
              <HugeiconsIcon
                icon={Linkedin01Icon}
                className="size-3.5"
                strokeWidth={1.75}
                data-icon="inline-start"
              />
              {t("cta.linkedin")}
            </a>
          </Button>
          <CvDownloadButton />
          <Button asChild size="lg" variant="ghost">
            <a href="#experience">
              <HugeiconsIcon
                icon={ArrowDownIcon}
                className="size-3.5"
                strokeWidth={1.75}
                data-icon="inline-start"
              />
              {t("cta.experience")}
            </a>
          </Button>
        </motion.div>

        <motion.dl
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease,
            delay: reduce ? 0 : 0.08 * titleWords.length + 0.25,
          }}
          className="mt-auto divide-y divide-dashed divide-border border border-dashed border-border sm:grid sm:grid-cols-2 sm:divide-y-0"
        >
          {specRows.map((row, index) => (
            <div
              key={row.label}
              className={`grid grid-cols-[88px_1fr] items-center gap-3 px-3 py-2.5 sm:border-dashed sm:border-border ${
                index % 2 === 0 ? "sm:border-r" : ""
              } ${index >= 2 ? "sm:border-t" : ""}`}
            >
              <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                {row.label}
              </dt>
              <dd className="truncate text-xs text-foreground">{row.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>

      <motion.aside
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: reduce ? 0 : 0.25 }}
        className="flex flex-col gap-5"
      >
        <HeroBadge role={t("role")} meta={profile.location} />
      </motion.aside>
    </section>
  )
}

export { Hero }
