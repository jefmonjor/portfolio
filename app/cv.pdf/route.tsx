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

const EDGE_CACHED_UNTIL_NEXT_DEPLOY =
  "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800"

const renderedForThisDeploy = new Map<string, Promise<Uint8Array>>()

function renderOnce(
  locale: Locale,
  variant: CvPdfVariantName
): Promise<Uint8Array> {
  const key = `${locale}:${variant}`
  const cached = renderedForThisDeploy.get(key)
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
  renderedForThisDeploy.set(key, pending)
  const forgetFailedRender = () => renderedForThisDeploy.delete(key)
  pending.catch(forgetFailedRender)
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

  const isCanonicalFile = request.nextUrl.search === ""

  return new Response(buffer.slice(), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": EDGE_CACHED_UNTIL_NEXT_DEPLOY,
      ...(isCanonicalFile
        ? { Link: `<${siteUrl}/cv.pdf>; rel="canonical"` }
        : { "X-Robots-Tag": "noindex, follow" }),
    },
  })
}
