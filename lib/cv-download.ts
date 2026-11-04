// One download path for every surface that hands out a CV: the chooser in
// the hero, the assistant's buttons and the terminal's `cv` command. The
// general and technical variants come from GET /cv.pdf; the tailored one is
// rendered by POST /api/cv-tailor from a pasted offer. Fetching the file and
// saving it as a blob works from every browser; a detached `target="_blank"`
// link is dropped as a popup by Safari and most mobile browsers.

export type CvVariant = "general" | "technical"

export type CvDownloadError = "rate_limited" | "unavailable" | "failed"

export type CvDownloadResult =
  | { readonly ok: true; readonly filename: string }
  | { readonly ok: false; readonly error: CvDownloadError }

export function cvPdfUrl(locale: string, variant: CvVariant): string {
  return `/cv.pdf?locale=${locale}&variant=${variant}`
}

function isPdf(response: Response): boolean {
  return (
    response.headers.get("content-type")?.startsWith("application/pdf") ?? false
  )
}

function filenameFrom(response: Response, locale: string): string {
  const disposition = response.headers.get("content-disposition")
  return (
    disposition?.match(/filename="([^"]+)"/)?.[1] ??
    `Jefferson_Montesdeoca_CV_${locale.toUpperCase()}.pdf`
  )
}

function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

async function save(
  response: Response,
  locale: string
): Promise<CvDownloadResult> {
  if (response.status === 429) return { ok: false, error: "rate_limited" }
  if (response.status === 503) return { ok: false, error: "unavailable" }
  if (!response.ok || !isPdf(response)) return { ok: false, error: "failed" }
  const filename = filenameFrom(response, locale)
  saveBlob(await response.blob(), filename)
  return { ok: true, filename }
}

// Aborts propagate as the DOMException the caller already handles.
export async function downloadCv(
  variant: CvVariant,
  locale: string,
  signal?: AbortSignal
): Promise<CvDownloadResult> {
  const response = await fetch(cvPdfUrl(locale, variant), { signal })
  return save(response, locale)
}

export async function downloadTailoredCv(
  offer: string,
  locale: string,
  signal?: AbortSignal
): Promise<CvDownloadResult> {
  const response = await fetch("/api/cv-tailor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ offer, locale }),
    signal,
  })
  return save(response, locale)
}
