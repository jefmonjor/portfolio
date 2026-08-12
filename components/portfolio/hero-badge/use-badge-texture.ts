"use client"

import { useEffect, useState } from "react"
import * as THREE from "three"

export type BadgeTextureInput = {
  photoSrc: string
  name: string
  role: string
  meta?: string
}

const TEXTURE_WIDTH = 1024
const TEXTURE_HEIGHT = 1536
const PADDING = 90

export function useBadgeTexture(
  input: BadgeTextureInput
): THREE.CanvasTexture | null {
  const { photoSrc, name, role, meta } = input
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    let cancelled = false
    let created: THREE.CanvasTexture | null = null

    const image = new window.Image()
    image.decoding = "async"
    image.src = photoSrc

    function paint() {
      if (cancelled) return
      const canvas = document.createElement("canvas")
      canvas.width = TEXTURE_WIDTH
      canvas.height = TEXTURE_HEIGHT
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      paintBackground(ctx)
      paintPhoto(ctx, image)
      paintCornerMarks(ctx)
      paintMetaStrip(ctx)
      paintIdentity(ctx, name, role)
      if (meta) paintFootnote(ctx, meta)
      paintSideLabel(ctx)

      const tex = new THREE.CanvasTexture(canvas)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 8
      tex.needsUpdate = true
      created = tex
      setTexture(tex)
    }

    if (image.complete && image.naturalWidth > 0) paint()
    else image.addEventListener("load", paint, { once: true })

    return () => {
      cancelled = true
      image.removeEventListener("load", paint)
      created?.dispose()
    }
  }, [photoSrc, name, role, meta])

  return texture
}

function paintBackground(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, 0, TEXTURE_HEIGHT)
  gradient.addColorStop(0, "#0d0d0d")
  gradient.addColorStop(1, "#000000")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT)
}

function paintPhoto(ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
  const photoTop = PADDING + 40
  const photoWidth = TEXTURE_WIDTH - PADDING * 2
  const photoHeight = TEXTURE_HEIGHT * 0.6

  const sourceRatio = image.width / image.height
  const targetRatio = photoWidth / photoHeight

  let sx = 0
  let sy = 0
  let sw = image.width
  let sh = image.height

  if (sourceRatio > targetRatio) {
    sw = image.height * targetRatio
    sx = (image.width - sw) / 2
  } else {
    sh = image.width / targetRatio
    sy = (image.height - sh) / 2
  }

  ctx.save()
  ctx.beginPath()
  ctx.rect(PADDING, photoTop, photoWidth, photoHeight)
  ctx.clip()
  ctx.filter = "grayscale(100%) contrast(108%) brightness(96%)"
  ctx.drawImage(
    image,
    sx,
    sy,
    sw,
    sh,
    PADDING,
    photoTop,
    photoWidth,
    photoHeight
  )
  ctx.filter = "none"

  const overlay = ctx.createLinearGradient(
    0,
    photoTop,
    0,
    photoTop + photoHeight
  )
  overlay.addColorStop(0, "rgba(0,0,0,0)")
  overlay.addColorStop(0.7, "rgba(0,0,0,0)")
  overlay.addColorStop(1, "rgba(0,0,0,0.55)")
  ctx.fillStyle = overlay
  ctx.fillRect(PADDING, photoTop, photoWidth, photoHeight)
  ctx.restore()
}

function paintCornerMarks(ctx: CanvasRenderingContext2D) {
  const photoTop = PADDING + 40
  const photoWidth = TEXTURE_WIDTH - PADDING * 2
  const photoHeight = TEXTURE_HEIGHT * 0.6
  const arm = 56
  const x0 = PADDING
  const y0 = photoTop
  const x1 = PADDING + photoWidth
  const y1 = photoTop + photoHeight

  ctx.strokeStyle = "rgba(255,255,255,0.55)"
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(x0, y0 + arm)
  ctx.lineTo(x0, y0)
  ctx.lineTo(x0 + arm, y0)
  ctx.moveTo(x1 - arm, y0)
  ctx.lineTo(x1, y0)
  ctx.lineTo(x1, y0 + arm)
  ctx.moveTo(x0, y1 - arm)
  ctx.lineTo(x0, y1)
  ctx.lineTo(x0 + arm, y1)
  ctx.moveTo(x1 - arm, y1)
  ctx.lineTo(x1, y1)
  ctx.lineTo(x1, y1 - arm)
  ctx.stroke()
}

function paintMetaStrip(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "rgba(255,255,255,0.45)"
  ctx.font = "600 24px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillText("24 / EDITION", PADDING, PADDING)
  const right = "IN PERSON · 2026"
  const rightWidth = ctx.measureText(right).width
  ctx.fillText(right, TEXTURE_WIDTH - PADDING - rightWidth, PADDING)
}

function paintIdentity(
  ctx: CanvasRenderingContext2D,
  name: string,
  role: string
) {
  const photoBottom = PADDING + 40 + TEXTURE_HEIGHT * 0.6
  const labelY = photoBottom + 90

  ctx.fillStyle = "rgba(255,255,255,0.5)"
  ctx.font = "600 26px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillText("ATTENDEE", PADDING, labelY)

  ctx.fillStyle = "#ffffff"
  ctx.font =
    "700 78px ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"

  const lines = wrapText(ctx, name.toUpperCase(), TEXTURE_WIDTH - PADDING * 2)
  let cursor = labelY + 80
  for (const line of lines) {
    ctx.fillText(line, PADDING, cursor)
    cursor += 88
  }

  ctx.fillStyle = "rgba(255,255,255,0.7)"
  ctx.font =
    "500 30px ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
  ctx.fillText(role.toUpperCase(), PADDING, cursor + 16)
}

function paintFootnote(ctx: CanvasRenderingContext2D, meta: string) {
  ctx.fillStyle = "rgba(255,255,255,0.35)"
  ctx.font = "500 22px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillText(meta.toUpperCase(), PADDING, TEXTURE_HEIGHT - PADDING)
}

function paintSideLabel(ctx: CanvasRenderingContext2D) {
  ctx.save()
  ctx.translate(TEXTURE_WIDTH - 46, PADDING)
  ctx.rotate(Math.PI / 2)
  ctx.fillStyle = "rgba(255,255,255,0.32)"
  ctx.font = "500 22px ui-monospace, SFMono-Regular, Menlo, monospace"
  ctx.fillText("PORTFOLIO · SOLUTIONS ARCHITECT · 2026", 0, 0)
  ctx.restore()
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ")
  const lines: string[] = []
  let current = ""

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines
}
