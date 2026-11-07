import { cn } from "@/lib/utils"

type DiagramNode = {
  label: string
  x: number
  y: number
  accent?: boolean
}

const nodeSize = { width: 120, height: 42 }

const nodes = {
  api: { label: "API", x: 140, y: 12 },
  baas: { label: "BaaS", x: 8, y: 128 },
  events: { label: "Events", x: 140, y: 128 },
  ai: { label: "AI service", x: 272, y: 128 },
  core: { label: "Core banking", x: 140, y: 244, accent: true },
} satisfies Record<string, DiagramNode>

type NodeId = keyof typeof nodes

const connections: ReadonlyArray<readonly [NodeId, NodeId]> = [
  ["api", "baas"],
  ["api", "events"],
  ["api", "ai"],
  ["baas", "core"],
  ["events", "core"],
]

function centre(id: NodeId) {
  const node = nodes[id]
  return { x: node.x + nodeSize.width / 2, y: node.y + nodeSize.height / 2 }
}

function connectionPath(from: NodeId, to: NodeId): string {
  const start = centre(from)
  const end = centre(to)
  const startY = start.y + nodeSize.height / 2
  const endY = end.y - nodeSize.height / 2
  const middleY = (startY + endY) / 2
  return `M${start.x} ${startY} V${middleY} H${end.x} V${endY}`
}

const pulseRoute = `M${centre("api").x} ${nodes.api.y + nodeSize.height} V${nodes.core.y}`

function HeroDiagram({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 298"
      className={cn("hero-diagram h-auto text-foreground", className)}
    >
      {connections.map(([from, to], index) => (
        <path
          key={`${from}-${to}`}
          d={connectionPath(from, to)}
          pathLength={1}
          className="diagram-line fill-none stroke-foreground/25"
          strokeWidth={1}
          style={{ animationDelay: `${300 + index * 90}ms` }}
        />
      ))}
      {Object.entries(nodes).map(([id, node]) => (
        <g key={id}>
          <rect
            x={node.x}
            y={node.y}
            width={nodeSize.width}
            height={nodeSize.height}
            className={cn(
              "fill-background",
              "accent" in node
                ? "fill-brand/10 stroke-brand"
                : "stroke-foreground/30"
            )}
            strokeWidth={1}
          />
          <text
            x={node.x + nodeSize.width / 2}
            y={node.y + nodeSize.height / 2 + 4.5}
            textAnchor="middle"
            className={cn(
              "text-[13px] font-medium",
              "accent" in node ? "fill-foreground" : "fill-muted-foreground"
            )}
          >
            {node.label}
          </text>
        </g>
      ))}
      <circle r={3.5} className="diagram-pulse fill-brand">
        <animateMotion
          dur="4s"
          repeatCount="indefinite"
          path={pulseRoute}
          keyPoints="0;1;1"
          keyTimes="0;0.4;1"
          calcMode="linear"
        />
        <animate
          attributeName="opacity"
          dur="4s"
          repeatCount="indefinite"
          values="0;1;1;0;0"
          keyTimes="0;0.05;0.35;0.4;1"
        />
      </circle>
    </svg>
  )
}

export { HeroDiagram }
