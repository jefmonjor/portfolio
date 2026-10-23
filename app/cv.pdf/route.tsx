import { type NextRequest } from "next/server"

import { resolveLocale, type Locale } from "@/i18n/routing"
import { checkPdfLimit, requestIp } from "@/lib/assistant/rate-limit"
import { cvPdfPath, type CvPdfVariantName } from "@/lib/cv-pdf"
import { siteUrl } from "@/lib/profile"
import { loadCvLabels } from "@/server/cv/labels"
import { cvFilename, renderCvPdf } from "@/server/cv/render"
import { cvPdfVariantSchema } from "@/types/cv"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Six possible files, and they only change with a deploy (which also starts
// new processes). Rendering one takes about a second of CPU, so each process
// renders each file once and serves the bytes from memory afterwards.
const rendered = new Map<string, Promise<Uint8Array>>()

function renderOnce(
  locale: Locale,
  variant: CvPdfVariantName
): Promise<Uint8Array> {
  const key = `${locale}:${variant}`
  const cached = rendered.get(key)
  if (cached) return cached

  const pending = loadCvLabels(locale)
    .then((labels) =>
      renderCvPdf(
        variant === "technical"
          ? { variant, labels, locale }
          : { variant, labels }
      )
    )
    .then((buffer) => new Uint8Array(buffer))
  rendered.set(key, pending)
  // A failed render must not be served from the cache forever.
  pending.catch(() => rendered.delete(key))
  return pending
}

async function limitedMessage(locale: Locale): Promise<string> {
  const messages = (await import(`@/messages/${locale}.json`)).default as {
    cvModal: { pdfLimited: string }
  }
  return messages.cvModal.pdfLimited
}

export async function GET(request: NextRequest): Promise<Response> {
  const params = request.nextUrl.searchParams
  const locale = resolveLocale(params.get("locale"))
  const variant = cvPdfVariantSchema.parse(params.get("variant"))

  // Unknown keys, repeated keys, legacy or invalid values and a different key
  // order all describe one of the same six files. Answering them with a
  // redirect keeps a random query string from forcing a render and from
  // multiplying the copies the CDN keeps.
  const canonical = cvPdfPath(locale, variant)
  if (`/cv.pdf${request.nextUrl.search}` !== canonical) {
    return new Response(null, {
      status: 308,
      headers: { Location: canonical },
    })
  }

  if ((await checkPdfLimit(requestIp(request))) !== "ok") {
    return new Response(await limitedMessage(locale), {
      status: 429,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Retry-After": "60",
        "Cache-Control": "no-store",
      },
    })
  }

  const buffer = await renderOnce(locale, variant)

  const suffix = variant === "technical" ? "Technical" : "General"
  const filename = cvFilename(suffix, locale)

  // Only the bare /cv.pdf is indexable. Every locale and variant combination
  // is the same CV again, so the parameterized URLs stay out of the index
  // instead of forming a cluster of near-duplicate files. The canonical one
  // says so in its headers: a PDF has no <head> to declare it, and without the
  // declaration the file competes with the page it was built from.
  const isCanonicalFile = request.nextUrl.search === ""

  return new Response(buffer.slice(), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      // The result only changes on deploy (which purges the CDN). The edge
      // keeps one copy per file so the download button answers from cache;
      // browsers still revalidate so a stale copy never outlives a deploy on
      // their side.
      "Cache-Control":
        "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      ...(isCanonicalFile
        ? { Link: `<${siteUrl}/cv.pdf>; rel="canonical"` }
        : { "X-Robots-Tag": "noindex, follow" }),
    },
  })
}
