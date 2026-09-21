import { type NextRequest } from "next/server"

import { resolveLocale } from "@/i18n/routing"
import { siteUrl } from "@/lib/profile"
import { loadCvLabels } from "@/server/cv/labels"
import { cvFilename, renderCvPdf } from "@/server/cv/render"
import { cvPdfVariantSchema } from "@/types/cv"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest): Promise<Response> {
  const locale = resolveLocale(request.nextUrl.searchParams.get("locale"))
  const variant = cvPdfVariantSchema.parse(
    request.nextUrl.searchParams.get("variant")
  )
  const labels = await loadCvLabels(locale)

  const buffer = await renderCvPdf(
    variant === "technical" ? { variant, labels, locale } : { variant, labels }
  )

  const suffix = variant === "technical" ? "Technical" : "General"
  const filename = cvFilename(suffix, locale)

  // Only the bare /cv.pdf is indexable. Every locale and variant combination
  // is the same CV again, so the parameterized URLs stay out of the index
  // instead of forming a cluster of near-duplicate files. The canonical one
  // says so in its headers: a PDF has no <head> to declare it, and without the
  // declaration the file competes with the page it was built from.
  const isCanonicalFile = request.nextUrl.search === ""

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "public, max-age=0, must-revalidate",
      ...(isCanonicalFile
        ? { Link: `<${siteUrl}/cv.pdf>; rel="canonical"` }
        : { "X-Robots-Tag": "noindex, follow" }),
    },
  })
}
