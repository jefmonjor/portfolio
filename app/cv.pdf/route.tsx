import { type NextRequest } from "next/server"

import { resolveLocale } from "@/i18n/routing"
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

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  })
}
