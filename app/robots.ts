import type { MetadataRoute } from "next"

import { siteUrl } from "@/lib/profile"

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
