import { buildLlmsFull } from "@/lib/seo/llms"
import { loadCvLabels } from "@/server/cv/labels"
import { buildCvMarkdown } from "@/server/cv/markdown"

export const dynamic = "force-static"

// The summary plus the complete English CV in one document, for engines that
// read a single file instead of following links. Built from the same labels as
// /cv.md and the PDFs, so it can never disagree with them.
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
