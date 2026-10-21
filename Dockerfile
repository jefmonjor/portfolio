# syntax=docker/dockerfile:1

# ----------------------------------------------------------------------------
# Base image: pinned Node + pnpm via corepack
# ----------------------------------------------------------------------------
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# ----------------------------------------------------------------------------
# Dependencies: install with cached pnpm store (full deps for build)
# ----------------------------------------------------------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ----------------------------------------------------------------------------
# Builder: compile the Next.js standalone output
# ----------------------------------------------------------------------------
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# ----------------------------------------------------------------------------
# Runner: minimal runtime image
# ----------------------------------------------------------------------------
FROM node:24-alpine AS runner
WORKDIR /app

# Pull the Alpine security patches published after the base image was built
RUN apk upgrade --no-cache

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as non-root for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy the standalone server, static assets and public files
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# The tRPC health procedure answers without touching OpenAI or the PDF renderer
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3000/api/trpc/health.status >/dev/null || exit 1

CMD ["node", "server.js"]
