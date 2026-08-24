import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 16.3 does not emit the root NFT manifest when Vercel's build adapter
  // is active, while the standalone finalizer still tries to read it. Vercel
  // does not use the standalone bundle; keep it only for the Docker deployment.
  output: process.env.VERCEL === "1" ? undefined : "standalone",
}

export default withNextIntl(nextConfig)
