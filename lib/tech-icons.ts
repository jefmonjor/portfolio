import {
  siAnthropic,
  siApachecassandra,
  siApachehadoop,
  siAstro,
  siBackblaze,
  siBootstrap,
  siBrevo,
  siClaude,
  siCloudflare,
  siDocker,
  siFastapi,
  siFlutter,
  siGithubactions,
  siGooglecloud,
  siGooglegemini,
  siHibernate,
  siJenkins,
  siKeycloak,
  siKubernetes,
  siMapbox,
  siMedusa,
  siModelcontextprotocol,
  siMysql,
  siNeon,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siPostgresql,
  siPwa,
  siPython,
  siReact,
  siRedhatopenshift,
  siRedis,
  siShadcnui,
  siSpring,
  siSpringboot,
  siStripe,
  siSupabase,
  siTailwindcss,
  siTrpc,
  siTypescript,
  siUpstash,
  siVercel,
  siZod,
  type SimpleIcon,
} from "simple-icons"

// Tools without an icon here (trademark removals in simple-icons, or too
// niche) simply render as text-only badges — that's intentional.
const ICONS: Record<string, SimpleIcon> = {
  java: siOpenjdk,
  typescript: siTypescript,
  python: siPython,
  "spring boot": siSpringboot,
  spring: siSpring,
  hibernate: siHibernate,
  "node.js": siNodedotjs,
  fastapi: siFastapi,
  react: siReact,
  "next.js": siNextdotjs,
  "tailwind css": siTailwindcss,
  "shadcn/ui": siShadcnui,
  bootstrap: siBootstrap,
  postgresql: siPostgresql,
  mysql: siMysql,
  supabase: siSupabase,
  neon: siNeon,
  redis: siRedis,
  "upstash redis": siUpstash,
  backblaze: siBackblaze,
  "backblaze b2": siBackblaze,
  cassandra: siApachecassandra,
  hadoop: siApachehadoop,
  docker: siDocker,
  kubernetes: siKubernetes,
  openshift: siRedhatopenshift,
  vercel: siVercel,
  "vercel ai sdk": siVercel,
  "google cloud": siGooglecloud,
  "google cloud run": siGooglecloud,
  "cloud run": siGooglecloud,
  "cloud build": siGooglecloud,
  "github actions": siGithubactions,
  brevo: siBrevo,
  jenkins: siJenkins,
  keycloak: siKeycloak,
  claude: siClaude,
  "claude code": siClaude,
  "claude api": siClaude,
  anthropic: siAnthropic,
  gemini: siGooglegemini,
  "gemini code assist": siGooglegemini,
  "mcp workflows": siModelcontextprotocol,
  mcp: siModelcontextprotocol,
  flutter: siFlutter,
  stripe: siStripe,
  mapbox: siMapbox,
  pwa: siPwa,
  turnstile: siCloudflare,
  medusajs: siMedusa,
  astro: siAstro,
  trpc: siTrpc,
  zod: siZod,
}

// "Java (8 → 21)" → "java" · "Redis · Upstash" → "redis" · "Spring Boot 3"
// → "spring boot". Falls back through progressively simpler forms.
function normalize(label: string): string[] {
  const base = label.toLowerCase().split("(")[0].trim()
  const candidates = [base]
  if (base.includes("·")) {
    candidates.push(base.split("·")[0].trim())
  }
  const noVersion = base.replace(/\s+[\d.]+$/, "").trim()
  if (noVersion !== base) candidates.push(noVersion)
  return candidates
}

export function techIcon(label: string): SimpleIcon | null {
  for (const key of normalize(label)) {
    const icon = ICONS[key]
    if (icon) return icon
  }
  return null
}
