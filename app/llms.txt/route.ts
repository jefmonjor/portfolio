import { llmsSummary } from "@/lib/seo/llms"

export const dynamic = "force-static"

export function GET(): Response {
  return new Response(llmsSummary, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Type": "text/markdown; charset=utf-8",
      // A pointer file for retrieval agents, not a search result: it only
      // repeats links the localized pages already carry.
      "X-Robots-Tag": "noindex, follow",
    },
  })
}
