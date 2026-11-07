import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const standaloneForDockerOnly =
  process.env.VERCEL === "1" ? undefined : "standalone"

const isDevelopment = process.env.NODE_ENV === "development"

const portfolioMovedToCv = [
  { source: "/en", destination: "/cv" },
  { source: "/ca", destination: "/ca/cv" },
]

export const cvPdfAliases = [
  { source: "/cv-en.pdf", destination: "/cv.pdf" },
  { source: "/cv-es.pdf", destination: "/cv.pdf?locale=es&variant=general" },
  { source: "/cv-ca.pdf", destination: "/cv.pdf?locale=ca&variant=general" },
]

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDevelopment ? " ws:" : ""}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ")

export const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: standaloneForDockerOnly,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },
  async redirects() {
    return [
      ...portfolioMovedToCv.map((rule) => ({ ...rule, statusCode: 301 })),
      ...cvPdfAliases.map((rule) => ({ ...rule, permanent: false })),
    ]
  },
}

export default withNextIntl(nextConfig)
