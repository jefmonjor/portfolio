import type { DiagramNode } from "@/content/site/types"

export const diagramLimits = {
  nodes: 6,
  labelCharacters: 24,
  detailCharacters: 34,
} as const

const canvasWidth = 320
const box = { x: 20, width: 280, height: 56 }
const connectorLength = 28
const padding = 8

function boxTop(index: number): number {
  return padding + index * (box.height + connectorLength)
}

type ArchitectureDiagramProps = {
  id: string
  title: string
  nodes: ReadonlyArray<DiagramNode>
}

function ArchitectureDiagram({ id, title, nodes }: ArchitectureDiagramProps) {
  const canvasHeight = boxTop(nodes.length) - connectorLength + padding
  const arrowId = `${id}-arrow`
  const description = nodes
    .map((node) => `${node.label} (${node.detail})`)
    .join(" → ")
  const centre = box.x + box.width / 2

  return (
    <figure className="site-card mx-auto w-full max-w-[30rem] bg-bg-weak-50 p-5 sm:p-6">
      <svg
        role="img"
        aria-labelledby={`${id}-title ${id}-description`}
        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
        className="h-auto w-full"
      >
        <title id={`${id}-title`}>{title}</title>
        <desc id={`${id}-description`}>{description}</desc>
        <defs>
          <marker
            id={arrowId}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" className="fill-icon-soft-400" />
          </marker>
        </defs>
        {nodes.map((node, index) => {
          const top = boxTop(index)
          const isLast = index === nodes.length - 1

          return (
            <g key={node.label}>
              <rect
                x={box.x}
                y={top}
                width={box.width}
                height={box.height}
                rx={10}
                className="fill-bg-white-0 stroke-stroke-soft-200"
                strokeWidth={1}
              />
              <text
                x={box.x + 16}
                y={top + 24}
                className="fill-text-strong-950 text-[14px] font-medium"
              >
                {node.label}
              </text>
              <text
                x={box.x + 16}
                y={top + 42}
                className="fill-text-sub-600 text-[11.5px]"
              >
                {node.detail}
              </text>
              {isLast ? null : (
                <line
                  x1={centre}
                  y1={top + box.height}
                  x2={centre}
                  y2={top + box.height + connectorLength - 2}
                  className="stroke-stroke-sub-300"
                  strokeWidth={1}
                  markerEnd={`url(#${arrowId})`}
                />
              )}
            </g>
          )
        })}
      </svg>
      <figcaption className="mt-4 text-center text-label-sm text-text-sub-600">
        {title}
      </figcaption>
    </figure>
  )
}

export { ArchitectureDiagram }
