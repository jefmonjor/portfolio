"use client"

import { Environment, Lightformer } from "@react-three/drei"
import {
  createRoot,
  events,
  extend,
  type RootState,
  type Size,
} from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import * as THREE from "three"

import { BadgeBand, type BadgeBandProps } from "./badge-band"

type BadgeSceneProps = Pick<
  BadgeBandProps,
  "photoSrc" | "name" | "role" | "meta"
>

export function BadgeScene(props: BadgeSceneProps) {
  const handleCreated = useCallback((state: RootState) => {
    state.events.connect?.(state.gl.domElement)
  }, [])

  return (
    <StableCanvas
      camera={{ position: [0, -1, 7.5], fov: 32 }}
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true }}
      onCreated={handleCreated}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[6, 8, 6]}
        intensity={1.8}
        castShadow={false}
      />
      <Physics
        interpolate
        gravity={[0, -40, 0]}
        timeStep={1 / 60}
        numSolverIterations={8}
        numInternalPgsIterations={2}
      >
        <BadgeBand {...props} />
      </Physics>
      <Environment background={false} blur={0.75}>
        <Lightformer
          intensity={2}
          color="white"
          position={[0, -1, 5]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[-1, -1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={3}
          color="white"
          position={[1, 1, 1]}
          rotation={[0, 0, Math.PI / 3]}
          scale={[100, 0.1, 1]}
        />
        <Lightformer
          intensity={10}
          color="white"
          position={[-10, 0, 14]}
          rotation={[0, Math.PI / 2, Math.PI / 3]}
          scale={[100, 10, 1]}
        />
      </Environment>
    </StableCanvas>
  )
}

type StableCanvasProps = {
  camera: { position: [number, number, number]; fov: number }
  children: ReactNode
  dpr: [number, number]
  gl: { alpha: boolean; antialias: boolean }
  onCreated: (state: RootState) => void
}

type R3FRoot = ReturnType<typeof createRoot<HTMLCanvasElement>>

function StableCanvas({
  camera,
  children,
  dpr,
  gl,
  onCreated,
}: StableCanvasProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useMemo(() => extend(THREE as any), [])

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<R3FRoot | null>(null)
  const unmountTimerRef = useRef<number | null>(null)
  const [size, setSize] = useState<Size | null>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateSize = () => {
      const rect = container.getBoundingClientRect()
      setSize({
        height: rect.height,
        left: rect.left,
        top: rect.top,
        width: rect.width,
      })
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(container)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (unmountTimerRef.current !== null) {
      window.clearTimeout(unmountTimerRef.current)
      unmountTimerRef.current = null
    }

    return () => {
      unmountTimerRef.current = window.setTimeout(() => {
        rootRef.current?.unmount()
        rootRef.current = null
        unmountTimerRef.current = null
      }, 500)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !size || size.width <= 0 || size.height <= 0) return

    rootRef.current ??= createRoot(canvas)
    let cancelled = false

    rootRef.current
      .configure({
        camera,
        dpr,
        events,
        gl,
        onCreated,
        size,
      })
      .then((root) => {
        if (cancelled) return
        root.render(<Suspense fallback={null}>{children}</Suspense>)
      })

    return () => {
      cancelled = true
    }
  }, [camera, children, dpr, gl, onCreated, size])

  return (
    <div ref={containerRef} className="h-full w-full overflow-hidden">
      <canvas ref={canvasRef} className="block" />
    </div>
  )
}
