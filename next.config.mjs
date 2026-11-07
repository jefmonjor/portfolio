import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const standaloneForDockerOnly =
  process.env.VERCEL === "1" ? undefined : "standalone"

const portfolioMovedToCv = [
  { source: "/en", destination: "/cv" },
  { source: "/ca", destination: "/ca/cv" },
]

const cvPdfByLanguage = ["en", "es", "ca"].map((locale) => ({
  source: `/cv-${locale}.pdf`,
  destination: `/cv.pdf?locale=${locale}`,
}))

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: standaloneForDockerOnly,
  async redirects() {
    return portfolioMovedToCv.map((rule) => ({ ...rule, statusCode: 301 }))
  },
  async rewrites() {
    return cvPdfByLanguage
  },
}

export default withNextIntl(nextConfig)
