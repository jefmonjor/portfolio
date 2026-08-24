"use client"

import confetti from "canvas-confetti"
import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeft02Icon,
  Download01Icon,
  SparklesIcon,
  UserIcon,
  Briefcase01Icon,
  FileValidationIcon,
} from "@hugeicons/core-free-icons"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  CV_TAILOR_OFFER_MAX_CHARS,
  cvTailorResponseSchema,
} from "@/types/cv-tailor"

type CvDownloadButtonProps = {
  readonly className?: string
}

function fireConfetti(): void {
  const defaults: confetti.Options = {
    spread: 70,
    ticks: 80,
    gravity: 1,
    decay: 0.93,
    startVelocity: 32,
    origin: { x: 0.5, y: 0.4 },
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

type Step = "purpose" | "offer"

function CvDownloadButton({ className }: CvDownloadButtonProps) {
  const t = useTranslations("hero.cta")
  const tModal = useTranslations("cvModal")
  const tToast = useTranslations("cvToast")
  const locale = useLocale()

  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState<Step>("purpose")
  const [offer, setOffer] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const requestRef = React.useRef<AbortController | null>(null)

  React.useEffect(
    () => () => {
      requestRef.current?.abort()
    },
    []
  )

  function resetDialog(): void {
    requestRef.current?.abort()
    requestRef.current = null
    setStep("purpose")
    setOffer("")
    setBusy(false)
  }

  function download(url: string): void {
    const a = document.createElement("a")
    a.href = url
    a.target = "_blank"
    a.rel = "noopener noreferrer"
    a.click()
    fireConfetti()
    toast.success(tToast("title"), { description: tToast("description") })
    setOpen(false)
    resetDialog()
  }

  async function tailorAndDownload(): Promise<void> {
    requestRef.current?.abort()
    const controller = new AbortController()
    requestRef.current = controller
    setBusy(true)

    try {
      const response = await fetch("/api/cv-tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offer, locale }),
        signal: controller.signal,
      })
      if (requestRef.current !== controller) return
      if (response.status === 429) {
        toast.error(tModal("tailorLimited"))
        return
      }
      if (!response.ok) {
        toast.error(tModal("tailorError"))
        return
      }
      const data = cvTailorResponseSchema.safeParse(await response.json())
      if (!data.success || requestRef.current !== controller) {
        if (requestRef.current === controller) {
          toast.error(tModal("tailorError"))
        }
        return
      }
      const params = new URLSearchParams({
        locale,
        variant: "ats",
        summary: data.data.summary,
        keywords: data.data.keywords.join("|"),
      })
      download(`/cv.pdf?${params.toString()}`)
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        toast.error(tModal("tailorError"))
      }
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null
        setBusy(false)
      }
    }
  }

  function onOpenChange(next: boolean): void {
    setOpen(next)
    if (!next) {
      resetDialog()
    }
  }

  const optionClass =
    "flex w-full items-start gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:border-foreground hover:bg-foreground/2.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/40"

  return (
    <>
      <Button
        size="lg"
        variant="outline"
        className={className}
        onClick={() => setOpen(true)}
      >
        <HugeiconsIcon
          icon={Download01Icon}
          className="size-3.5"
          strokeWidth={1.75}
          data-icon="inline-start"
        />
        {t("cv")}
      </Button>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton className="gap-0 p-0 sm:max-w-md">
          <DialogHeader className="gap-2 border-b border-border p-5">
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              <span className="inline-block size-1.5 bg-brand" />
              {tModal("title")}
            </div>
            <DialogTitle className="font-heading text-lg tracking-tight">
              {step === "purpose" ? tModal("question") : tModal("hiring")}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2.5 p-5">
            {step === "purpose" ? (
              <>
                <button
                  type="button"
                  className={optionClass}
                  onClick={() => download(`/cv.pdf?locale=${locale}`)}
                >
                  <HugeiconsIcon
                    icon={UserIcon}
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">
                      {tModal("info")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {tModal("infoDesc")}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  className={optionClass}
                  onClick={() => setStep("offer")}
                >
                  <HugeiconsIcon
                    icon={Briefcase01Icon}
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">
                      {tModal("hiring")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {tModal("hiringDesc")}
                    </span>
                  </span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={optionClass}
                  onClick={() =>
                    download(`/cv.pdf?locale=${locale}&variant=ats`)
                  }
                >
                  <HugeiconsIcon
                    icon={FileValidationIcon}
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">
                      {tModal("ats")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {tModal("atsDesc")}
                    </span>
                  </span>
                </button>

                <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <HugeiconsIcon
                      icon={SparklesIcon}
                      className="size-4 shrink-0 text-muted-foreground"
                      strokeWidth={1.5}
                    />
                    {tModal("tailor")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {tModal("tailorDesc")}
                  </span>
                  <textarea
                    value={offer}
                    onChange={(event) => setOffer(event.target.value)}
                    placeholder={tModal("offerPlaceholder")}
                    maxLength={CV_TAILOR_OFFER_MAX_CHARS}
                    rows={5}
                    className="w-full resize-none rounded-md border border-input bg-transparent p-2 text-xs leading-relaxed outline-none focus-visible:border-ring"
                  />
                  <Button
                    size="sm"
                    disabled={offer.trim().length < 40 || busy}
                    onClick={() => void tailorAndDownload()}
                  >
                    {busy ? tModal("generating") : tModal("generate")}
                  </Button>
                </div>

                <button
                  type="button"
                  onClick={() => setStep("purpose")}
                  className="mt-1 flex w-fit items-center gap-1.5 font-mono text-[10px] tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground"
                >
                  <HugeiconsIcon
                    icon={ArrowLeft02Icon}
                    className="size-3"
                    strokeWidth={1.75}
                  />
                  {tModal("back")}
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export { CvDownloadButton }
