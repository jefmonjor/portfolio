import { buildLlmsFull } from "@/lib/seo/llms"
import { loadCvLabels } from "@/server/cv/labels"
import { buildCvMarkdown } from "@/server/cv/markdown"

export const dynamic = "force-static"

export async function GET(): Promise<Response> {
  const labels = await loadCvLabels("en")

  return new Response(buildLlmsFull(buildCvMarkdown(labels, "en")), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex, follow",
    },
  })
}
