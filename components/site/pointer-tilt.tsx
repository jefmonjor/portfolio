"use client"

import { useRef } from "react"

type PointerTiltProps = {
  className?: string
  maxDegrees?: number
  children: React.ReactNode
}

function PointerTilt({
  className = "",
  maxDegrees = 6,
  children,
}: PointerTiltProps) {
  const surface = useRef<HTMLDivElement>(null)

  function followPointer(event: React.PointerEvent<HTMLDivElement>) {
    const element = surface.current
    if (!element || event.pointerType !== "mouse") return
    const bounds = element.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    element.style.setProperty("--pointer-x", `${x * 100}%`)
    element.style.setProperty("--pointer-y", `${y * 100}%`)
    element.style.setProperty("--tilt-x", `${(0.5 - y) * maxDegrees}deg`)
    element.style.setProperty("--tilt-y", `${(x - 0.5) * maxDegrees}deg`)
  }

  function settle() {
    surface.current?.style.setProperty("--tilt-x", "0deg")
    surface.current?.style.setProperty("--tilt-y", "0deg")
  }

  return (
    <div
      ref={surface}
      onPointerMove={followPointer}
      onPointerLeave={settle}
      className={className}
    >
      {children}
    </div>
  )
}

export { PointerTilt }
