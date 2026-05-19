"use client"

import {
  ArrowDownIcon,
  Linkedin01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion, useReducedMotion } from "motion/react"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"

import { CvDownloadButton } from "@/components/portfolio/cv-download-button"
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
            className="font-mono tabular-nums text-muted-foreground"
          />
        </span>
      ),
    },
    { label: tSpecs("focus"), value: profile.focus.join(" · ") },
    { label: tSpecs("since"), value: profile.since },
  ]

  const emailHref =
    profile.socials.find((s) => s.kind === "email")?.href ?? "#contact"
  const linkedinHref =
    profile.socials.find((s) => s.kind === "linkedin")?.href ?? "#"

  return (
    <section
      id="top"
      className="relative mx-auto grid max-w-6xl gap-10 px-4 pt-12 pb-20 sm:px-8 sm:pt-16 sm:pb-24 lg:grid-cols-[1.4fr_1fr] lg:gap-16"
    >
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
          <span className="inline-block h-px w-8 bg-border" />
          {t("indexLabel")}
        </div>

        <h1 className="font-heading text-4xl leading-[0.95] font-medium tracking-tight text-foreground sm:text-6xl lg:text-[5rem]">
          <span className="sr-only">{profile.name}</span>
          <span aria-hidden className="flex flex-wrap gap-x-3 gap-y-1">
            {titleWords.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
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
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
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
      </div>

      <motion.aside
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: reduce ? 0 : 0.25 }}
        className="flex flex-col gap-5"
      >
        <div className="relative">
          <span
            aria-hidden
            className="absolute -top-2 -left-2 inline-block size-2 bg-foreground"
          />
          <span
            aria-hidden
            className="absolute -right-2 -bottom-2 inline-block size-2 bg-foreground"
          />
          <div className="relative aspect-square max-h-80 w-full overflow-hidden ring-1 ring-foreground/15">
            <Image
              src="/me.webp"
              alt={profile.name}
              fill
              priority
              className="object-cover"
              unoptimized
            />
            <span
              aria-hidden
              className="absolute top-0 left-0 size-6 border-t border-l border-foreground/40"
            />
            <span
              aria-hidden
              className="absolute top-0 right-0 size-6 border-t border-r border-foreground/40"
            />
            <span
              aria-hidden
              className="absolute bottom-0 left-0 size-6 border-b border-l border-foreground/40"
            />
            <span
              aria-hidden
              className="absolute right-0 bottom-0 size-6 border-r border-b border-foreground/40"
            />
          </div>
        </div>

        <dl className="divide-y divide-dashed divide-border border border-dashed border-border">
          {specRows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[88px_1fr] items-center gap-3 px-3 py-2"
            >
              <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                {row.label}
              </dt>
              <dd className="truncate text-xs text-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>
      </motion.aside>
    </section>
  )
}

export { Hero }
