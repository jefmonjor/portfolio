"use client"

type TiltFrameProps = {
  className?: string
  children: React.ReactNode
}

const maxTiltDeg = 3

function lean(event: React.PointerEvent<HTMLDivElement>) {
  if (event.pointerType !== "mouse") return
  const frame = event.currentTarget
  const box = frame.getBoundingClientRect()
  const across = (event.clientX - box.left) / box.width - 0.5
  const down = (event.clientY - box.top) / box.height - 0.5
  frame.style.setProperty(
    "--tilt-x",
    `${(-down * 2 * maxTiltDeg).toFixed(2)}deg`
  )
  frame.style.setProperty(
    "--tilt-y",
    `${(across * 2 * maxTiltDeg).toFixed(2)}deg`
  )
}

function settle(event: React.PointerEvent<HTMLDivElement>) {
  event.currentTarget.style.removeProperty("--tilt-x")
  event.currentTarget.style.removeProperty("--tilt-y")
}

/** Leans its content a few degrees towards the mouse; touch leaves it flat. */
function TiltFrame({ className, children }: TiltFrameProps) {
  return (
    <div className={className} onPointerMove={lean} onPointerLeave={settle}>
      {children}
    </div>
  )
}

export { TiltFrame }
