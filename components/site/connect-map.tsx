import type { SiteContent } from "@/content/site/types"

type ConnectMapProps = {
  nodes: SiteContent["connect"]["nodes"]
}

const node = { width: 112, height: 40 }
const sourceX = 4
const outputX = 324
const core = { x: 164, y: 138, width: 112, height: 64 }
const ai = { x: 164, y: 30, width: 112, height: 40 }
const sourceCentres = [50, 130, 210, 290] as const
const outputCentres = [100, 170, 240] as const

function sourceLink(index: number): string {
  const from = sourceCentres[index] ?? 0
  const to = core.y + 8 + index * 16
  const start = sourceX + node.width
  const bend = (start + core.x) / 2
  return `M${start} ${from} C${bend} ${from}, ${bend} ${to}, ${core.x} ${to}`
}

function outputLink(index: number): string {
  const to = outputCentres[index] ?? 0
  const from = core.y + 20 + index * 12
  const start = core.x + core.width
  const bend = (start + outputX) / 2
  return `M${start} ${from} C${bend} ${from}, ${bend} ${to}, ${outputX} ${to}`
}

const aiLink = `M${ai.x + ai.width / 2} ${ai.y + ai.height} V${core.y}`

function Box({
  x,
  y,
  width,
  height,
  label,
  detail,
  highlight = false,
  className,
}: {
  x: number
  y: number
  width: number
  height: number
  label: string
  detail?: string
  highlight?: boolean
  className: string
}) {
  const centreX = x + width / 2
  const centreY = y + height / 2

  return (
    <g className={className}>
      <rect x={x} y={y} width={width} height={height} rx={10} />
      {highlight ? (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={10}
          className="connect-highlight"
        />
      ) : null}
      <text
        x={centreX}
        y={detail ? centreY - 3 : centreY + 4.5}
        textAnchor="middle"
        className="connect-label"
      >
        {label}
      </text>
      {detail ? (
        <text
          x={centreX}
          y={centreY + 14}
          textAnchor="middle"
          className="connect-detail"
        >
          {detail}
        </text>
      ) : null}
    </g>
  )
}

function Packet({
  route,
  begin,
  className,
  bounce = false,
}: {
  route: string
  begin: string
  className: string
  bounce?: boolean
}) {
  return (
    <circle r={3.5} className={className}>
      <animateMotion
        dur={bounce ? "3s" : "2.4s"}
        begin={begin}
        repeatCount="indefinite"
        path={route}
        keyPoints={bounce ? "0;1;0" : "0;1"}
        keyTimes={bounce ? "0;0.5;1" : "0;1"}
        calcMode="linear"
      />
    </circle>
  )
}

function ConnectMap({ nodes }: ConnectMapProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 440 340"
      className="connect-map h-auto w-full"
    >
      {nodes.sources.map((_, index) => (
        <path
          key={`source-${index}`}
          d={sourceLink(index)}
          pathLength={1}
          className="connect-link connect-link-in"
        />
      ))}
      {nodes.outputs.map((_, index) => (
        <path
          key={`output-${index}`}
          d={outputLink(index)}
          pathLength={1}
          className="connect-link connect-link-out"
        />
      ))}
      <path
        d={aiLink}
        pathLength={1}
        className="connect-link connect-link-ai"
      />

      {nodes.sources.map((label, index) => (
        <Box
          key={label}
          x={sourceX}
          y={(sourceCentres[index] ?? 0) - node.height / 2}
          width={node.width}
          height={node.height}
          label={label}
          className="connect-node connect-source"
        />
      ))}
      <Box
        {...ai}
        label={nodes.ai}
        highlight
        className="connect-node connect-ai"
      />
      <Box
        {...core}
        label={nodes.core}
        detail={nodes.coreDetail}
        highlight
        className="connect-node connect-core"
      />
      {nodes.outputs.map((label, index) => (
        <Box
          key={label}
          x={outputX}
          y={(outputCentres[index] ?? 0) - node.height / 2}
          width={node.width}
          height={node.height}
          label={label}
          highlight
          className="connect-node connect-output"
        />
      ))}

      {nodes.sources.map((label, index) => (
        <Packet
          key={`packet-in-${label}`}
          route={sourceLink(index)}
          begin={`${index * 0.6}s`}
          className="connect-packet connect-packet-in"
        />
      ))}
      <Packet
        route={aiLink}
        begin="0.3s"
        bounce
        className="connect-packet connect-packet-ai"
      />
      {nodes.outputs.map((label, index) => (
        <Packet
          key={`packet-out-${label}`}
          route={outputLink(index)}
          begin={`${0.9 + index * 0.7}s`}
          className="connect-packet connect-packet-out"
        />
      ))}
    </svg>
  )
}

export { ConnectMap }
