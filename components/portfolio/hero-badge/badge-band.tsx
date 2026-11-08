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

const FACE_CAMERA_STIFFNESS = 0.25
const FACE_CAMERA_SPIN_DAMPING = 0.12

const CARD_HALF_W = 1
const CARD_HALF_H = 1.4
const CARD_HALF_D = 0.015

const RING_CENTER_ABOVE_CARD_TOP = 0.14
const RING_RADIUS = 0.11
const RING_TUBE = 0.022
const RING_CENTER_Y = CARD_HALF_H + RING_CENTER_ABOVE_CARD_TOP
const FABRIC_FOLD_Y = RING_CENTER_Y + RING_RADIUS
const NO_Z_FIGHTING_GAP_ABOVE_FOLD = 0.12
const CRIMP_Y = FABRIC_FOLD_Y + NO_Z_FIGHTING_GAP_ABOVE_FOLD
const NO_Z_FIGHTING_GAP_ABOVE_CRIMP = 0.04
const BAND_ATTACH_Y = CRIMP_Y + NO_Z_FIGHTING_GAP_ABOVE_CRIMP
const ROPE_SEGMENTS = 3
const ANCHOR_Y = ROPE_SEGMENT_LENGTH * ROPE_SEGMENTS + BAND_ATTACH_Y

const CARD_END_TAPER_SHARE = 0.06
const TAPERED_TIP_WIDTH = 0.3

function widthTaperingIntoCrimp(progressFromCard: number): number {
  return progressFromCard < CARD_END_TAPER_SHARE
    ? TAPERED_TIP_WIDTH +
        (progressFromCard / CARD_END_TAPER_SHARE) * (1 - TAPERED_TIP_WIDTH)
    : 1
}

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
    [0, BAND_ATTACH_Y, 0],
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
      const rot = card.current.rotation()
      cardQuat.set(rot.x, rot.y, rot.z, rot.w)
      cardForward.set(0, 0, 1).applyQuaternion(cardQuat)
      const yawAwayFromCamera = Math.atan2(cardForward.x, cardForward.z)
      const spin = card.current.angvel().y
      const towardCamera =
        -FACE_CAMERA_STIFFNESS * yawAwayFromCamera -
        FACE_CAMERA_SPIN_DAMPING * spin
      card.current.applyTorqueImpulse(
        { x: 0, y: towardCamera * delta, z: 0 },
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
      band.current.geometry.setPoints(
        curve.getPoints(ROPE_DETAIL),
        widthTaperingIntoCrimp
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
          <CardTopEyelet />
          <HookRing />
          <LanyardFoldOverRing />
          <CrimpAboveRing />
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

function CardTopEyelet() {
  return (
    <mesh position={[0, CARD_HALF_H + 0.04, 0]}>
      <cylinderGeometry args={[0.05, 0.05, 0.18, 18]} />
      <meshStandardMaterial color="#9a9a9a" metalness={0.9} roughness={0.3} />
    </mesh>
  )
}

function HookRing() {
  return (
    <mesh position={[0, RING_CENTER_Y, 0]}>
      <torusGeometry args={[RING_RADIUS, RING_TUBE, 12, 32]} />
      <meshStandardMaterial color="#c4c4c4" metalness={0.95} roughness={0.25} />
    </mesh>
  )
}

function LanyardFoldOverRing() {
  return (
    <mesh position={[0, FABRIC_FOLD_Y, 0]} rotation={[0, Math.PI / 2, 0]}>
      <torusGeometry args={[0.055, 0.022, 12, 28]} />
      <meshPhysicalMaterial
        color="#0a0a0a"
        roughness={0.7}
        metalness={0.04}
        clearcoat={0.25}
        clearcoatRoughness={0.4}
      />
    </mesh>
  )
}

function CrimpAboveRing() {
  return (
    <mesh position={[0, CRIMP_Y, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.038, 0.038, 0.14, 16]} />
      <meshStandardMaterial color="#c4c4c4" metalness={0.95} roughness={0.22} />
    </mesh>
  )
}
