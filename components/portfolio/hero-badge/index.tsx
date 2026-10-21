"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { profile } from "@/lib/profile"
import { cn } from "@/lib/utils"

const loadBadgeScene = () =>
  import("./badge-scene").then((mod) => mod.BadgeScene)

const BadgeScene = dynamic(loadBadgeScene, {
  ssr: false,
  loading: () => null,
})

// The 3D card spends most of its start-up fetching three.js and compiling the
// Rapier physics WASM (~2 MB). Both are warmed ahead of the click — on intent
// (hover/focus) and, on fast desktop connections, once the page is idle — so
// opening it only has to build the scene. Rapier's `init()` is idempotent:
// the scene's own call returns the module this one already compiled.
let warmup: Promise<unknown> | null = null

function warmBadgeScene(): void {
  warmup ??= Promise.all([
    loadBadgeScene(),
    import("@dimforge/rapier3d-compat").then((rapier) => rapier.init()),
  ]).catch(() => {
    warmup = null
  })
}

type NetworkInformationLike = {
  saveData?: boolean
  effectiveType?: string
}

function prefersIdleWarmup(): boolean {
  const connection = (
    navigator as Navigator & { connection?: NetworkInformationLike }
  ).connection
  if (!connection) return true
  return !connection.saveData && connection.effectiveType === "4g"
}

export type HeroBadgeProps = {
  photoSrc?: string
  role: string
  meta?: string
  exploreLabel: string
  closeLabel: string
  loadingLabel: string
  unavailableLabel: string
}

export function HeroBadge({
  photoSrc = "/me.webp",
  role,
  meta,
  exploreLabel,
  closeLabel,
  loadingLabel,
  unavailableLabel,
}: HeroBadgeProps) {
  const [hardwareCapable, setHardwareCapable] = React.useState(false)
  const [show3d, setShow3d] = React.useState(false)
  const [ready, setReady] = React.useState(false)
  const [failed, setFailed] = React.useState(false)
  const canExplore = hardwareCapable && !failed

  React.useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)")
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateCapability = () => {
      const supported = desktop.matches && !motion.matches && supportsWebGl()
      setHardwareCapable(supported)
      if (!supported) setShow3d(false)
    }

    const frame = window.requestAnimationFrame(updateCapability)
    desktop.addEventListener("change", updateCapability)
    motion.addEventListener("change", updateCapability)
    return () => {
      window.cancelAnimationFrame(frame)
      desktop.removeEventListener("change", updateCapability)
      motion.removeEventListener("change", updateCapability)
    }
  }, [])

  React.useEffect(() => {
    if (!canExplore || !prefersIdleWarmup()) return
    // Late enough that the page's own scripts and images have settled.
    const timer = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(warmBadgeScene, { timeout: 4000 })
      } else {
        warmBadgeScene()
      }
    }, 3500)
    return () => window.clearTimeout(timer)
  }, [canExplore])

  const handleSceneError = React.useCallback(() => {
    setFailed(true)
    setShow3d(false)
    setReady(false)
  }, [])

  const handleSceneReady = React.useCallback(() => setReady(true), [])

  function open3d(): void {
    warmBadgeScene()
    setReady(false)
    setShow3d(true)
  }

  function close3d(): void {
    setShow3d(false)
    setReady(false)
  }

  return (
    <div className="relative aspect-4/5 w-full min-w-0 overflow-hidden rounded-xl border border-border bg-muted select-none">
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
        <div className="absolute inset-0 z-30">
          {/* The photo stays visible until the first frame is drawn, so
              opening the 3D view never flashes an empty panel. */}
          <div
            className={cn(
              "absolute inset-0 bg-background transition-opacity duration-300 ease-out",
              ready ? "opacity-100" : "opacity-0"
            )}
          >
            <BadgeScene
              photoSrc={photoSrc}
              name={profile.shortName}
              role={role}
              meta={meta ?? profile.location}
              onError={handleSceneError}
              onReady={handleSceneReady}
            />
          </div>
          {ready ? null : (
            <span
              role="status"
              className="absolute top-4 right-4 flex items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-1.5 font-mono text-[10px] tracking-widest text-muted-foreground uppercase backdrop-blur"
            >
              <span
                aria-hidden
                className="inline-block size-1.5 animate-pulse bg-brand motion-reduce:animate-none"
              />
              {loadingLabel}
            </span>
          )}
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="absolute right-4 bottom-4 bg-background/90 backdrop-blur"
            onClick={close3d}
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
          onPointerEnter={warmBadgeScene}
          onFocus={warmBadgeScene}
          onClick={open3d}
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
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl")
    if (!context) return false

    const extension = context.getExtension("WEBGL_lose_context")
    extension?.loseContext()
    return true
  } catch {
    return false
  }
}
