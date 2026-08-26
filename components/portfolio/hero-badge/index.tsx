"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useReducedMotion } from "motion/react"

import { Button } from "@/components/ui/button"
import { profile } from "@/lib/profile"

const BadgeScene = dynamic(
  () => import("./badge-scene").then((mod) => mod.BadgeScene),
  {
    ssr: false,
    loading: () => null,
  },
)

export type HeroBadgeProps = {
  photoSrc?: string
  role: string
  meta?: string
  exploreLabel: string
  closeLabel: string
  unavailableLabel: string
}

export function HeroBadge({
  photoSrc = "/me.webp",
  role,
  meta,
  exploreLabel,
  closeLabel,
  unavailableLabel,
}: HeroBadgeProps) {
  const reduce = useReducedMotion()
  const [hardwareCapable, setHardwareCapable] = React.useState(false)
  const [show3d, setShow3d] = React.useState(false)
  const [failed, setFailed] = React.useState(false)
  const canExplore = hardwareCapable && !reduce && !failed

  React.useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)")
    const updateCapability = () => {
      const supported = desktop.matches && supportsWebGl()
      setHardwareCapable(supported)
      if (!supported) setShow3d(false)
    }

    const frame = window.requestAnimationFrame(updateCapability)
    desktop.addEventListener("change", updateCapability)
    return () => {
      window.cancelAnimationFrame(frame)
      desktop.removeEventListener("change", updateCapability)
    }
  }, [])

  function handleSceneError() {
    setFailed(true)
    setShow3d(false)
  }

  return (
    <div className="relative aspect-4/5 w-full min-w-0 select-none overflow-hidden rounded-xl border border-border bg-muted">
      <span
        aria-hidden
        className="absolute top-3 left-3 z-20 inline-block size-2 bg-foreground"
      />
      <span
        aria-hidden
        className="absolute right-3 bottom-3 z-20 inline-block size-2 bg-foreground"
      />

      <Image
        src={photoSrc}
        alt={profile.name}
        fill
        sizes="(min-width: 1024px) 26rem, (min-width: 640px) 70vw, calc(100vw - 2rem)"
        className="object-cover object-top grayscale"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-background via-background/5 to-transparent"
      />

      <div className="absolute right-5 bottom-5 left-5 z-10 flex min-w-0 flex-col gap-1.5">
        <span className="font-heading text-xl font-medium tracking-tight text-foreground sm:text-2xl">
          {profile.shortName}
        </span>
        <span className="max-w-full font-mono text-[10px] leading-relaxed tracking-widest text-muted-foreground uppercase">
          {role}
        </span>
        <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
          {meta ?? profile.location}
        </span>
      </div>

      {show3d ? (
        <div className="absolute inset-0 z-30 bg-background">
          <BadgeScene
            photoSrc={photoSrc}
            name={profile.shortName}
            role={role}
            meta={meta ?? profile.location}
            onError={handleSceneError}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="absolute right-4 bottom-4 bg-background/90 backdrop-blur"
            onClick={() => setShow3d(false)}
          >
            {closeLabel}
          </Button>
        </div>
      ) : canExplore ? (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="absolute top-4 right-4 z-20 bg-background/90 backdrop-blur"
          onClick={() => setShow3d(true)}
        >
          {exploreLabel}
        </Button>
      ) : null}

      {failed ? (
        <span className="sr-only" role="status">
          {unavailableLabel}
        </span>
      ) : null}
    </div>
  )
}

function supportsWebGl(): boolean {
  try {
    const canvas = document.createElement("canvas")
    const context =
      canvas.getContext("webgl2") ?? canvas.getContext("webgl")
    if (!context) return false

    const extension = context.getExtension("WEBGL_lose_context")
    extension?.loseContext()
    return true
  } catch {
    return false
  }
}
