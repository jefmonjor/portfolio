import { PointerTilt } from "@/components/site/pointer-tilt"
import { cn } from "@/lib/utils"

const layers = [
  { label: "Core banking", modules: 1 },
  { label: "BaaS · Integrations", modules: 2 },
  { label: "Events", modules: 1 },
  { label: "Services · AI", modules: 3 },
  { label: "API", modules: 1 },
] as const

function ArchitectureStack({ className }: { className?: string }) {
  return (
    <PointerTilt maxDegrees={10} className={cn("stack-scene", className)}>
      <div aria-hidden className="stack-rig">
        {layers.map(({ label, modules }, layer) => (
          <div key={label} className="stack-plate" style={{ "--layer": layer }}>
            <span className="stack-modules">
              {Array.from({ length: modules }, (_, index) => (
                <span key={index} />
              ))}
            </span>
            <span className="stack-label">{label}</span>
          </div>
        ))}
        <span className="stack-signal" />
      </div>
    </PointerTilt>
  )
}

export { ArchitectureStack }
