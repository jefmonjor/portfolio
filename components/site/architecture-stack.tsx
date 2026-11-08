import { PointerTilt } from "@/components/site/pointer-tilt"
import { cn } from "@/lib/utils"

const modulesPerLayer = [1, 2, 1, 3, 1] as const

type ArchitectureStackProps = {
  layers: ReadonlyArray<string>
  className?: string
}

function ArchitectureStack({ layers, className }: ArchitectureStackProps) {
  return (
    <PointerTilt maxDegrees={10} className={cn("stack-scene", className)}>
      <div aria-hidden className="stack-rig">
        {layers.map((label, layer) => (
          <div key={label} className="stack-plate" style={{ "--layer": layer }}>
            <span className="stack-modules">
              {Array.from(
                { length: modulesPerLayer[layer] ?? 1 },
                (_, index) => (
                  <span key={index} />
                )
              )}
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
