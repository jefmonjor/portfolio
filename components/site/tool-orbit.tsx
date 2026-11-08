import { toolRings } from "@/components/site/tool-rings.generated"

type ToolOrbitProps = {
  label: string
  center: string
}

function ToolOrbit({ label, center }: ToolOrbitProps) {
  return (
    <figure className="orbit">
      <figcaption className="sr-only">{label}</figcaption>
      <div aria-hidden className="orbit-core">
        <span>{center}</span>
      </div>
      {toolRings.map((ring, ringIndex) => (
        <ul
          key={ringIndex}
          className="orbit-ring"
          style={{ "--ring": ringIndex, "--count": ring.length }}
        >
          {ring.map((tool, index) => (
            <li
              key={tool.title}
              className="orbit-tool"
              style={{
                "--index": index,
                "--brand": tool.ink ? undefined : tool.hex,
              }}
            >
              <span className="orbit-tile">
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path d={tool.path} />
                </svg>
                <span className="orbit-name">{tool.title}</span>
              </span>
            </li>
          ))}
        </ul>
      ))}
    </figure>
  )
}

export { ToolOrbit }
