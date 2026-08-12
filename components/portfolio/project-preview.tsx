"use client"

import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

const INTERVAL_MS = 3200

type ProjectPreviewProps = {
  images: ReadonlyArray<string>
  alt: string
  className?: string
  /** Larger rendering (dialog) loads higher-res candidates. */
  sizes?: string
}

/**
 * Looping screenshot preview: crossfades through the project's captures
 * while visible. Static first frame under reduced motion or with a single
 * image.
 */
function ProjectPreview({
  images,
  alt,
  className,
  sizes = "(min-width: 640px) 50vw, 100vw",
}: ProjectPreviewProps) {
  const [current, setCurrent] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (images.length < 2) return
    const container = containerRef.current
    if (!container) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let timer: number | null = null
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && timer === null) {
          timer = window.setInterval(() => {
            setCurrent((value) => (value + 1) % images.length)
          }, INTERVAL_MS)
        } else if (!entry.isIntersecting && timer !== null) {
          window.clearInterval(timer)
          timer = null
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(container)
    return () => {
      observer.disconnect()
      if (timer !== null) window.clearInterval(timer)
    }
  }, [images.length])

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-video w-full overflow-hidden bg-muted",
        className
      )}
    >
      {images.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={index === 0 ? alt : ""}
          fill
          sizes={sizes}
          priority={false}
          className={cn(
            "object-cover object-top transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            index === current ? "opacity-100" : "opacity-0"
          )}
        />
      ))}
      {images.length > 1 ? (
        <span className="absolute right-2 bottom-2 border border-border/60 bg-background/80 px-1.5 py-0.5 font-mono text-[9px] tracking-widest text-muted-foreground backdrop-blur-sm">
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(images.length).padStart(2, "0")}
        </span>
      ) : null}
    </div>
  )
}

export { ProjectPreview }
