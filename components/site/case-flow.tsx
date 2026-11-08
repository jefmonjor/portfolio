import type { DiagramNode } from "@/content/site/types"
import { cn } from "@/lib/utils"

type CaseFlowProps = {
  nodes: ReadonlyArray<DiagramNode>
  className?: string
}

function CaseFlow({ nodes, className }: CaseFlowProps) {
  return (
    <ol
      aria-hidden
      className={cn(
        "case-flow flex-col items-start rounded-16 bg-bg-weak-50 p-4 ring-1 ring-stroke-soft-200 ring-inset",
        className
      )}
    >
      <span className="case-flow-track">
        <span className="case-flow-packet" />
      </span>
      {nodes.map((node) => (
        <li key={node.label}>
          <span className="inline-flex min-h-7 items-center rounded-6 bg-bg-white-0 px-2 py-1 text-label-xs text-text-sub-600 ring-1 ring-stroke-soft-200 ring-inset">
            <span className="trim">{node.label}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}

export { CaseFlow }
