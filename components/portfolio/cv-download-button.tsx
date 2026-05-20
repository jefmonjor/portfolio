"use client"

import confetti from "canvas-confetti"
import type { MouseEvent } from "react"
import { useLocale, useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import { Download01Icon } from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

type CvDownloadButtonProps = {
  readonly className?: string
}

function fireConfetti(origin: { x: number; y: number }): void {
  const defaults: confetti.Options = {
    spread: 70,
    ticks: 80,
    gravity: 1,
    decay: 0.93,
    startVelocity: 32,
    origin,
    colors: [
      "#ef4444",
      "#f97316",
      "#eab308",
      "#22c55e",
      "#06b6d4",
      "#3b82f6",
      "#a855f7",
      "#ec4899",
    ],
  }

  void confetti({ ...defaults, particleCount: 50, scalar: 0.9 })
  void confetti({
    ...defaults,
    particleCount: 24,
    scalar: 1.4,
    decay: 0.9,
    shapes: ["square"],
  })
}

function CvDownloadButton({ className }: CvDownloadButtonProps) {
  const t = useTranslations("hero.cta")
  const tToast = useTranslations("cvToast")
  const locale = useLocale()

  function onDownload(event: MouseEvent<HTMLAnchorElement>): void {
    const target = event.currentTarget
    const rect = target.getBoundingClientRect()
    const origin = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    }
    fireConfetti(origin)
    toast.success(tToast("title"), {
      description: tToast("description"),
    })
  }

  return (
    <Button asChild size="lg" variant="outline" className={className}>
      <a
        href={`/cv.pdf?locale=${locale}`}
        target="_blank"
        rel="noopener noreferrer"
        download
        onClick={onDownload}
      >
        <HugeiconsIcon
          icon={Download01Icon}
          className="size-3.5"
          strokeWidth={1.75}
          data-icon="inline-start"
        />
        {t("cv")}
      </a>
    </Button>
  )
}

export { CvDownloadButton }
