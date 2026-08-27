"use client"

import confetti from "canvas-confetti"
import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import {
  ArrowLeft02Icon,
  Download01Icon,
  FileValidationIcon,
  SparklesIcon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CV_TAILOR_OFFER_MAX_CHARS } from "@/types/cv-tailor"

type CvDownloadButtonProps = {
  readonly className?: string
}

type Step = "choose" | "offer"

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

function CvDownloadButton({ className }: CvDownloadButtonProps) {
  const t = useTranslations("hero.cta")
  const tModal = useTranslations("cvModal")
  const tToast = useTranslations("cvToast")
  const locale = useLocale()

  const [open, setOpen] = React.useState(false)
  const [step, setStep] = React.useState<Step>("choose")
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
    setStep("choose")
    setOffer("")
    setBusy(false)
  }

  function completeDownload(): void {
    fireConfetti()
    toast.success(tToast("title"), { description: tToast("description") })
    setOpen(false)
    resetDialog()
  }

  function downloadUrl(url: string): void {
    const link = document.createElement("a")
    link.href = url
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    link.click()
    completeDownload()
  }

  function downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
    completeDownload()
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
      if (response.status === 503) {
        toast.error(tModal("tailorUnavailable"))
        return
      }
      if (
        !response.ok ||
        response.headers.get("content-type") !== "application/pdf"
      ) {
        toast.error(tModal("tailorError"))
        return
      }

      const disposition = response.headers.get("content-disposition")
      const filename =
        disposition?.match(/filename="([^"]+)"/)?.[1] ??
        `Jefferson_Montesdeoca_CV_${locale.toUpperCase()}.pdf`
      const blob = await response.blob()
      if (requestRef.current !== controller) return
      downloadBlob(blob, filename)
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
    if (!next) resetDialog()
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
        <DialogContent showCloseButton className="gap-0 p-0 sm:max-w-lg">
          <DialogHeader className="gap-2 border-b border-border p-5">
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              <span className="inline-block size-1.5 bg-brand" />
              {tModal("title")}
            </div>
            <DialogTitle className="font-heading text-lg tracking-tight">
              {step === "choose" ? tModal("question") : tModal("tailor")}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2.5 p-5">
            {step === "choose" ? (
              <>
                <button
                  type="button"
                  className={optionClass}
                  onClick={() =>
                    downloadUrl(`/cv.pdf?locale=${locale}&variant=general`)
                  }
                >
                  <HugeiconsIcon
                    icon={UserIcon}
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">
                      {tModal("general")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {tModal("generalDesc")}
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  className={optionClass}
                  onClick={() =>
                    downloadUrl(`/cv.pdf?locale=${locale}&variant=technical`)
                  }
                >
                  <HugeiconsIcon
                    icon={FileValidationIcon}
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">
                      {tModal("technical")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {tModal("technicalDesc")}
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  className={optionClass}
                  onClick={() => setStep("offer")}
                >
                  <HugeiconsIcon
                    icon={SparklesIcon}
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">
                      {tModal("tailor")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {tModal("tailorDesc")}
                    </span>
                  </span>
                </button>
              </>
            ) : (
              <>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {tModal("tailorHelp")}
                </p>
                <label
                  htmlFor="cv-offer"
                  className="text-xs font-medium text-foreground"
                >
                  {tModal("offerLabel")}
                </label>
                <textarea
                  id="cv-offer"
                  value={offer}
                  onChange={(event) => setOffer(event.target.value)}
                  placeholder={tModal("offerPlaceholder")}
                  maxLength={CV_TAILOR_OFFER_MAX_CHARS}
                  rows={8}
                  disabled={busy}
                  className="w-full resize-y rounded-md border border-input bg-transparent p-2 text-xs leading-relaxed outline-none focus-visible:border-ring disabled:opacity-60"
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {offer.length.toLocaleString(locale)} /{" "}
                    {CV_TAILOR_OFFER_MAX_CHARS.toLocaleString(locale)}
                  </span>
                  <span className="text-right text-[10px] text-muted-foreground">
                    {tModal("privacy")}
                  </span>
                </div>
                <Button
                  size="sm"
                  disabled={offer.trim().length < 40 || busy}
                  onClick={() => void tailorAndDownload()}
                >
                  {busy ? tModal("generating") : tModal("generate")}
                </Button>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setStep("choose")}
                  className="mt-1 flex w-fit items-center gap-1.5 font-mono text-[10px] tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground disabled:opacity-60"
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
