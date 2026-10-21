import type { MetadataRoute } from "next"

import { siteUrl } from "@/lib/profile"

// Named so the intent is explicit, not inherited from "*": this profile wants
// to be read and cited by AI search engines, assistants and sourcing agents.
// Each one gets the same rule as everyone else.
export const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "MistralAI-User",
  "meta-externalagent",
  "CCBot",
] as const

const publicRule = { allow: "/", disallow: "/api/" }

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", ...publicRule },
      { userAgent: [...aiCrawlers], ...publicRule },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
