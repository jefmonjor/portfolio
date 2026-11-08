type HeroAnnotationsProps = {
  labels: readonly [string, string, string, string, string]
}

const anchors = [
  { x: 1728, y: 276, labelX: 1790, labelY: 150 },
  { x: 2040, y: 360, labelX: 2060, labelY: 470 },
  { x: 1452, y: 456, labelX: 1360, labelY: 300 },
  { x: 1236, y: 516, labelX: 1290, labelY: 640 },
  { x: 1650, y: 1300, labelX: 1730, labelY: 1190 },
] as const

const signalRoute = anchors
  .map((anchor, index) => `${index === 0 ? "M" : "L"}${anchor.x} ${anchor.y}`)
  .join(" ")

const labelHeight = 52
const characterWidth = 15.5
const labelPadding = 26

function HeroAnnotations({ labels }: HeroAnnotationsProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 2400 1590"
      preserveAspectRatio="xMidYMid slice"
      className="hero-annotations"
    >
      <path d={signalRoute} pathLength={1} className="annotation-route" />
      {anchors.map((anchor, index) => {
        const label = labels[index] ?? ""
        const width = label.length * characterWidth + labelPadding * 2
        const labelCentreY = anchor.labelY + labelHeight / 2
        const leaderEndX =
          anchor.labelX > anchor.x ? anchor.labelX : anchor.labelX + width

        return (
          <g
            key={label}
            className="annotation"
            style={{ "--annotation": index }}
          >
            <path
              d={`M${anchor.x} ${anchor.y} L${leaderEndX} ${labelCentreY}`}
              pathLength={1}
              className="annotation-leader"
            />
            <circle
              cx={anchor.x}
              cy={anchor.y}
              r={14}
              className="annotation-halo"
            />
            <circle
              cx={anchor.x}
              cy={anchor.y}
              r={7}
              className="annotation-dot"
            />
            <rect
              x={anchor.labelX}
              y={anchor.labelY}
              width={width}
              height={labelHeight}
              rx={labelHeight / 2}
              className="annotation-pill"
            />
            <text
              x={anchor.labelX + width / 2}
              y={labelCentreY + 10}
              textAnchor="middle"
              className="annotation-label"
            >
              {label}
            </text>
          </g>
        )
      })}
      <circle r={9} className="annotation-signal">
        <animateMotion
          dur="6s"
          begin="1.6s"
          repeatCount="indefinite"
          path={signalRoute}
          calcMode="linear"
        />
      </circle>
    </svg>
  )
}

export { HeroAnnotations }
