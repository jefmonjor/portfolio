"use client"

import type { Options as ConfettiOptions } from "canvas-confetti"
import * as React from "react"
import { useLocale, useTranslations } from "next-intl"
import {
  ArrowLeft02Icon,
  Download01Icon,
  FileValidationIcon,
  Loading03Icon,
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
import { cn } from "@/lib/utils"
import {
  CV_TAILOR_OFFER_MAX_CHARS,
  CV_TAILOR_OFFER_MIN_CHARS,
} from "@/types/limits"

const CV_OPTIONS = [
  { key: "general", icon: UserIcon },
  { key: "technical", icon: FileValidationIcon },
  { key: "tailor", icon: SparklesIcon },
] as const

type CvDownloadButtonProps = {
  readonly className?: string
}

type Step = "choose" | "offer"
type CvVariant = "general" | "technical"
type Pending = CvVariant | "tailor"

// Loaded on success only: the celebration is not worth shipping on first paint.
async function fireConfetti(): Promise<void> {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  const { default: confetti } = await import("canvas-confetti")
  const defaults: ConfettiOptions = {
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
  const [pending, setPending] = React.useState<Pending | null>(null)
  const busy = pending !== null
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
    setPending(null)
  }

  function completeDownload(): void {
    void fireConfetti().catch(() => undefined)
    toast.success(tToast("title"), { description: tToast("description") })
    setOpen(false)
    resetDialog()
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

  function filenameFrom(response: Response, fallback: string): string {
    const disposition = response.headers.get("content-disposition")
    return disposition?.match(/filename="([^"]+)"/)?.[1] ?? fallback
  }

  function isPdf(response: Response): boolean {
    return (
      response.headers.get("content-type")?.startsWith("application/pdf") ??
      false
    )
  }

  // Starts a request that the dialog owns: closing it, or starting another
  // download, aborts the previous one so a late response never lands twice.
  function beginRequest(kind: Pending): AbortController {
    requestRef.current?.abort()
    const controller = new AbortController()
    requestRef.current = controller
    setPending(kind)
    return controller
  }

  function endRequest(controller: AbortController): void {
    if (requestRef.current !== controller) return
    requestRef.current = null
    setPending(null)
  }

  // The general and technical CVs used to open through a detached
  // `target="_blank"` link. Safari and most mobile browsers treat that as a
  // popup and drop it silently, while the dialog still closed with a success
  // toast. Fetching the file and saving it as a blob is the same path the
  // tailored CV already takes, and it works from every browser.
  async function downloadVariant(variant: CvVariant): Promise<void> {
    if (busy) return
    const url = `/cv.pdf?locale=${locale}&variant=${variant}`
    const controller = beginRequest(variant)

    try {
      const response = await fetch(url, { signal: controller.signal })
      if (requestRef.current !== controller) return
      if (!response.ok || !isPdf(response)) throw new Error("not a pdf")

      const blob = await response.blob()
      if (requestRef.current !== controller) return
      downloadBlob(
        blob,
        filenameFrom(
          response,
          `Jefferson_Montesdeoca_CV_${locale.toUpperCase()}.pdf`
        )
      )
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      toast.error(tModal("downloadError"), {
        action: {
          label: tModal("openDirect"),
          onClick: () => window.open(url, "_blank", "noopener"),
        },
      })
    } finally {
      endRequest(controller)
    }
  }

  async function tailorAndDownload(): Promise<void> {
    if (busy) return
    const controller = beginRequest("tailor")

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
      if (!response.ok || !isPdf(response)) {
        toast.error(tModal("tailorError"))
        return
      }

      const blob = await response.blob()
      if (requestRef.current !== controller) return
      downloadBlob(
        blob,
        filenameFrom(
          response,
          `Jefferson_Montesdeoca_CV_${locale.toUpperCase()}.pdf`
        )
      )
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        toast.error(tModal("tailorError"))
      }
    } finally {
      endRequest(controller)
    }
  }

  function selectOption(option: Pending): void {
    if (option === "tailor") setStep("offer")
    else void downloadVariant(option)
  }

  function onOpenChange(next: boolean): void {
    setOpen(next)
    if (!next) resetDialog()
  }

  const optionClass =
    "flex w-full items-start gap-3 rounded-lg border border-border p-3 text-left transition-[color,background-color,border-color,transform,opacity] duration-150 ease-out hover:border-foreground hover:bg-foreground/2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60 aria-busy:opacity-100"

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
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
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
                {CV_OPTIONS.map((option) => {
                  const loading = pending === option.key
                  return (
                    <button
                      key={option.key}
                      type="button"
                      className={optionClass}
                      disabled={busy}
                      aria-busy={loading}
                      onClick={() => selectOption(option.key)}
                    >
                      <HugeiconsIcon
                        icon={loading ? Loading03Icon : option.icon}
                        className={cn(
                          "mt-0.5 size-4 shrink-0 text-muted-foreground",
                          loading && "animate-spin motion-reduce:animate-none"
                        )}
                        strokeWidth={1.5}
                      />
                      <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="text-sm font-medium text-foreground">
                          {tModal(option.key)}
                        </span>
                        <span className="text-xs text-pretty text-muted-foreground">
                          {loading
                            ? tModal("preparing")
                            : tModal(`${option.key}Desc`)}
                        </span>
                      </span>
                    </button>
                  )
                })}
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
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {offer.length.toLocaleString(locale)} /{" "}
                    {CV_TAILOR_OFFER_MAX_CHARS.toLocaleString(locale)}
                  </span>
                  <span className="text-right text-[11px] text-muted-foreground">
                    {tModal("privacy")}
                  </span>
                </div>
                <Button
                  size="sm"
                  disabled={
                    offer.trim().length < CV_TAILOR_OFFER_MIN_CHARS || busy
                  }
                  onClick={() => void tailorAndDownload()}
                >
                  {busy ? tModal("generating") : tModal("generate")}
                </Button>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setStep("choose")}
                  className="mt-1 flex w-fit items-center gap-1.5 font-mono text-[11px] tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground disabled:opacity-60"
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
