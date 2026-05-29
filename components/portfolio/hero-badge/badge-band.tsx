"use client"

import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber"
import {
  BallCollider,
  CuboidCollider,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from "@react-three/rapier"
import type { MeshLineGeometry, MeshLineMaterial } from "meshline"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"

import "./meshline"
import { useBadgeTexture } from "./use-badge-texture"

export type BadgeBandProps = {
  photoSrc: string
  name: string
  role: string
  meta?: string
  maxSpeed?: number
  minSpeed?: number
}

const segmentProps = {
  type: "dynamic",
  canSleep: true,
  colliders: false,
  angularDamping: 4,
  linearDamping: 4,
} satisfies RigidBodyProps

const ROPE_SEGMENT_LENGTH = 1
const ROPE_DETAIL = 32
const ROPE_WIDTH = 0.45

// Soft "spring" that biases the card to rest facing the camera without locking
// any axis — it can still be spun/swung freely, it just no longer settles
// edge-on. FACE_STIFFNESS is the restoring strength, FACE_DAMPING resists spin.
const FACE_STIFFNESS = 0.25
const FACE_DAMPING = 0.12

const CARD_HALF_W = 1
const CARD_HALF_H = 1.4
const CARD_HALF_D = 0.015

// Hook ring hardware that sits above the card's top edge. The pieces are
// stacked with clean gaps so their surfaces never sit near-coplanar — that
// (plus attaching the band above all of them) avoids z-fighting flicker as
// the card sways.
const HOOK_OFFSET = 0.14 // ring center above the card's top edge
const RING_RADIUS = 0.11
const RING_TUBE = 0.022
const RING_CENTER_Y = CARD_HALF_H + HOOK_OFFSET
const FOLD_Y = RING_CENTER_Y + RING_RADIUS // fabric folded over the ring's top
const CRIMP_Y = FOLD_Y + 0.12 // metal crimp clamps the fold, with a gap above it
// The band attaches above the crimp so the moving ribbon never overlaps — and
// flickers over — the hardware hanging below it.
const CARD_HANG_OFFSET = CRIMP_Y + 0.04
// Place the anchor so the card rests centered (card center at y = 0).
const ANCHOR_Y = ROPE_SEGMENT_LENGTH * 3 + CARD_HANG_OFFSET

export function BadgeBand({
  photoSrc,
  name,
  role,
  meta,
  maxSpeed = 50,
  minSpeed = 10,
}: BadgeBandProps) {
  const band = useRef<THREE.Mesh<MeshLineGeometry>>(null!)
  const fixed = useRef<RapierRigidBody>(null!)
  const j1 = useRef<RapierRigidBody>(null!)
  const j2 = useRef<RapierRigidBody>(null!)
  const j3 = useRef<RapierRigidBody>(null!)
  const card = useRef<RapierRigidBody>(null!)

  const j1Lerped = useRef(new THREE.Vector3())
  const j2Lerped = useRef(new THREE.Vector3())
  const lerpInitialised = useRef(false)

  const vec = useMemo(() => new THREE.Vector3(), [])
  const dir = useMemo(() => new THREE.Vector3(), [])
  const lerpTarget = useMemo(() => new THREE.Vector3(), [])
  const cardQuat = useMemo(() => new THREE.Quaternion(), [])
  const cardForward = useMemo(() => new THREE.Vector3(), [])

  const [dragged, setDragged] = useState<THREE.Vector3 | null>(null)
  const [hovered, setHovered] = useState(false)

  const { size, camera } = useThree()
  const texture = useBadgeTexture({ photoSrc, name, role, meta })

  const materialArgs = useMemo<ConstructorParameters<typeof MeshLineMaterial>>(
    () => [
      {
        resolution: new THREE.Vector2(
          Math.max(size.width, 1),
          Math.max(size.height, 1)
        ),
        lineWidth: ROPE_WIDTH,
        color: new THREE.Color("#0a0a0a"),
        sizeAttenuation: 1,
      },
    ],
    [size.width, size.height]
  )

  const curve = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ])
    c.curveType = "chordal"
    return c
  }, [])

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ROPE_SEGMENT_LENGTH])
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, CARD_HANG_OFFSET, 0],
  ])

  useEffect(() => {
    if (!hovered) return
    document.body.style.cursor = dragged ? "grabbing" : "grab"
    return () => {
      document.body.style.cursor = "auto"
    }
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (
      !fixed.current ||
      !j1.current ||
      !j2.current ||
      !j3.current ||
      !card.current ||
      !band.current
    ) {
      return
    }

    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(camera)
      dir.copy(vec).sub(camera.position).normalize()
      vec.add(dir.multiplyScalar(camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp())
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: 0,
      })
    } else {
      // Nudge the card back toward facing the camera. yaw is its rotation about
      // the vertical axis (0 = facing front); a PD torque pulls it to 0 while
      // leaving the axis fully free to spin if dragged.
      const rot = card.current.rotation()
      cardQuat.set(rot.x, rot.y, rot.z, rot.w)
      cardForward.set(0, 0, 1).applyQuaternion(cardQuat)
      const yaw = Math.atan2(cardForward.x, cardForward.z)
      const spin = card.current.angvel().y
      card.current.applyTorqueImpulse(
        {
          x: 0,
          y: (-FACE_STIFFNESS * yaw - FACE_DAMPING * spin) * delta,
          z: 0,
        },
        true
      )
    }

    const j1Pos = j1.current.translation()
    const j2Pos = j2.current.translation()
    if (!lerpInitialised.current) {
      j1Lerped.current.set(j1Pos.x, j1Pos.y, j1Pos.z)
      j2Lerped.current.set(j2Pos.x, j2Pos.y, j2Pos.z)
      lerpInitialised.current = true
    }

    const lerpSpeed = (lerped: THREE.Vector3, target: THREE.Vector3Like) => {
      const distance = Math.max(
        0.1,
        Math.min(
          1,
          lerped.distanceTo(lerpTarget.set(target.x, target.y, target.z))
        )
      )
      return delta * (minSpeed + distance * (maxSpeed - minSpeed))
    }

    j1Lerped.current.lerp(
      vec.set(j1Pos.x, j1Pos.y, j1Pos.z),
      lerpSpeed(j1Lerped.current, j1Pos)
    )
    j2Lerped.current.lerp(
      vec.set(j2Pos.x, j2Pos.y, j2Pos.z),
      lerpSpeed(j2Lerped.current, j2Pos)
    )

    const j3Pos = j3.current.translation()
    const fixedPos = fixed.current.translation()
    curve.points[0].set(j3Pos.x, j3Pos.y, j3Pos.z)
    curve.points[1].copy(j2Lerped.current)
    curve.points[2].copy(j1Lerped.current)
    curve.points[3].set(fixedPos.x, fixedPos.y, fixedPos.z)

    if (curve.points.every((p) => Number.isFinite(p.x + p.y + p.z))) {
      // p = 0 is the card end of the ribbon. Taper the last few percent so it
      // feeds into the crimp as a narrow tip instead of ending in a wide flat
      // edge that curls and flickers over the hardware as the card sways.
      band.current.geometry.setPoints(curve.getPoints(ROPE_DETAIL), (p) =>
        p < 0.06 ? 0.3 + (p / 0.06) * 0.7 : 1
      )
    }
  })

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    if (!card.current) return
    const target = event.target as Element | null
    target?.setPointerCapture?.(event.pointerId)
    const cardPos = card.current.translation()
    setDragged(
      new THREE.Vector3()
        .copy(event.point)
        .sub(new THREE.Vector3(cardPos.x, cardPos.y, cardPos.z))
    )
  }

  function handlePointerUp(event: ThreeEvent<PointerEvent>) {
    const target = event.target as Element | null
    target?.releasePointerCapture?.(event.pointerId)
    setDragged(null)
  }

  return (
    <>
      <RigidBody ref={fixed} position={[0, ANCHOR_Y, 0]} type="fixed" />
      <RigidBody position={[0.5, ANCHOR_Y, 0]} ref={j1} {...segmentProps}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody position={[1, ANCHOR_Y, 0]} ref={j2} {...segmentProps}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody position={[1.5, ANCHOR_Y, 0]} ref={j3} {...segmentProps}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      <RigidBody
        position={[2, ANCHOR_Y, 0]}
        ref={card}
        {...segmentProps}
        angularDamping={4}
        linearDamping={4}
        type={dragged ? "kinematicPosition" : "dynamic"}
      >
        <CuboidCollider args={[CARD_HALF_W, CARD_HALF_H, CARD_HALF_D]} />
        <group
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <mesh castShadow>
            <boxGeometry
              args={[CARD_HALF_W * 2, CARD_HALF_H * 2, CARD_HALF_D * 2]}
            />
            <meshPhysicalMaterial
              attach="material-0"
              color="#0a0a0a"
              roughness={0.55}
              metalness={0.35}
            />
            <meshPhysicalMaterial
              attach="material-1"
              color="#0a0a0a"
              roughness={0.55}
              metalness={0.35}
            />
            <meshPhysicalMaterial
              attach="material-2"
              color="#0a0a0a"
              roughness={0.55}
              metalness={0.35}
            />
            <meshPhysicalMaterial
              attach="material-3"
              color="#0a0a0a"
              roughness={0.55}
              metalness={0.35}
            />
            <meshPhysicalMaterial
              attach="material-4"
              color="#0a0a0a"
              clearcoat={0.35}
              clearcoatRoughness={0.35}
              roughness={0.62}
              metalness={0.03}
            />
            <meshPhysicalMaterial
              attach="material-5"
              color="#050505"
              clearcoat={0.35}
              clearcoatRoughness={0.35}
              roughness={0.62}
              metalness={0.03}
            />
          </mesh>
          <mesh position={[0, 0, CARD_HALF_D + 0.002]}>
            <planeGeometry args={[CARD_HALF_W * 2, CARD_HALF_H * 2]} />
            <meshPhysicalMaterial
              key={texture?.uuid ?? "front-empty"}
              map={texture ?? undefined}
              emissiveMap={texture ?? undefined}
              emissive={texture ? "#ffffff" : "#000000"}
              emissiveIntensity={0.35}
              color={texture ? "#ffffff" : "#111111"}
              clearcoat={1}
              clearcoatRoughness={0.15}
              roughness={0.45}
              metalness={0.25}
              toneMapped={false}
            />
          </mesh>
          <mesh
            position={[0, 0, -CARD_HALF_D - 0.002]}
            rotation={[0, Math.PI, 0]}
          >
            <planeGeometry args={[CARD_HALF_W * 2, CARD_HALF_H * 2]} />
            <meshPhysicalMaterial
              key={texture?.uuid ?? "back-empty"}
              map={texture ?? undefined}
              emissiveMap={texture ?? undefined}
              emissive={texture ? "#ffffff" : "#000000"}
              emissiveIntensity={0.35}
              color={texture ? "#ffffff" : "#111111"}
              clearcoat={1}
              clearcoatRoughness={0.15}
              roughness={0.45}
              metalness={0.25}
              toneMapped={false}
            />
          </mesh>
          {/* Metal eyelet set into the card's top edge */}
          <mesh position={[0, CARD_HALF_H + 0.04, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.18, 18]} />
            <meshStandardMaterial
              color="#9a9a9a"
              metalness={0.9}
              roughness={0.3}
            />
          </mesh>
          {/* Hook ring */}
          <mesh position={[0, RING_CENTER_Y, 0]}>
            <torusGeometry args={[RING_RADIUS, RING_TUBE, 12, 32]} />
            <meshStandardMaterial
              color="#c4c4c4"
              metalness={0.95}
              roughness={0.25}
            />
          </mesh>
          {/* Lanyard fabric folded over the top of the ring */}
          <mesh position={[0, FOLD_Y, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.055, 0.022, 12, 28]} />
            <meshPhysicalMaterial
              color="#0a0a0a"
              roughness={0.7}
              metalness={0.04}
              clearcoat={0.25}
              clearcoatRoughness={0.4}
            />
          </mesh>
          {/* Metal crimp clamping the doubled fabric just above the ring */}
          <mesh position={[0, CRIMP_Y, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.038, 0.038, 0.14, 16]} />
            <meshStandardMaterial
              color="#c4c4c4"
              metalness={0.95}
              roughness={0.22}
            />
          </mesh>
        </group>
      </RigidBody>
      <mesh ref={band} frustumCulled={false}>
        <meshLineGeometry />
        <meshLineMaterial
          args={materialArgs}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}
