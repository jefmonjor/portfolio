import { type NextRequest } from "next/server"

import { resolveLocale } from "@/i18n/routing"
import { loadCvLabels } from "@/server/cv/labels"
import { buildCvMarkdown } from "@/server/cv/markdown"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest): Promise<Response> {
  const locale = resolveLocale(request.nextUrl.searchParams.get("locale"))
  const labels = await loadCvLabels(locale)

  return new Response(buildCvMarkdown(labels, locale), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  })
}
