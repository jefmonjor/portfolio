import type { Headline } from "@/content/site/types"

function DisplayTitle({ title }: { title: string | Headline }) {
  if (typeof title === "string") return title

  return title.map((part, index) =>
    typeof part === "string" ? (
      part
    ) : (
      <em key={index} className="display-accent">
        {part.emphasis}
      </em>
    )
  )
}

export { DisplayTitle }
