"use client"

import dynamic from "next/dynamic"

import { profile } from "@/lib/profile"

const BadgeScene = dynamic(
  () => import("./badge-scene").then((mod) => mod.BadgeScene),
  {
    ssr: false,
    loading: () => <BadgePlaceholder />,
  },
)

export type HeroBadgeProps = {
  photoSrc?: string
  role: string
  meta?: string
}

export function HeroBadge({
  photoSrc = "/me.webp",
  role,
  meta,
}: HeroBadgeProps) {
  return (
    <div className="relative h-115 w-full select-none sm:h-130">
      <span
        aria-hidden
        className="absolute -top-2 -left-2 inline-block size-2 bg-foreground"
      />
      <span
        aria-hidden
        className="absolute -right-2 -bottom-2 inline-block size-2 bg-foreground"
      />
      <BadgeScene
        photoSrc={photoSrc}
        name={profile.shortName}
        role={role}
        meta={meta ?? profile.location}
      />
    </div>
  )
}

function BadgePlaceholder() {
  return (
    <div
      aria-hidden
      className="h-full w-full animate-pulse bg-foreground/5 ring-1 ring-foreground/10"
    />
  )
}
