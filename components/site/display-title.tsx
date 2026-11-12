import { headlineText, type Headline } from "@/content/site/types"

type DisplayTitleProps = {
  title: string | Headline
  /** Each letter comes into focus in turn when its section is revealed. */
  letters?: boolean
}

type Glyph = { char: string; order: number | null }
type TitlePart = { glyphs: Glyph[]; emphasis: boolean }

function partsOf(title: string | Headline) {
  if (typeof title === "string") return [{ text: title, emphasis: false }]
  return title.map((part) =>
    typeof part === "string"
      ? { text: part, emphasis: false }
      : { text: part.emphasis, emphasis: true }
  )
}

/** Numbers the visible letters across the whole title; spaces stay plain. */
function splitIntoGlyphs(title: string | Headline): {
  parts: TitlePart[]
  letterCount: number
} {
  const parts: TitlePart[] = []
  let letterCount = 0
  for (const { text, emphasis } of partsOf(title)) {
    const glyphs = Array.from(text).map((char) =>
      char.trim() ? { char, order: letterCount++ } : { char, order: null }
    )
    parts.push({ glyphs, emphasis })
  }
  return { parts, letterCount }
}

function SplitLetters({ title }: { title: string | Headline }) {
  const { parts, letterCount } = splitIntoGlyphs(title)

  return (
    <span aria-hidden style={{ "--letters": letterCount }}>
      {parts.map((part, partIndex) => {
        const glyphs = part.glyphs.map(({ char, order }, glyphIndex) =>
          order === null ? (
            char
          ) : (
            <span
              key={glyphIndex}
              className="title-letter"
              style={{ "--letter": order }}
            >
              {char}
            </span>
          )
        )
        return part.emphasis ? (
          <em key={partIndex} className="display-accent">
            {glyphs}
          </em>
        ) : (
          <span key={partIndex}>{glyphs}</span>
        )
      })}
    </span>
  )
}

function DisplayTitle({ title, letters = false }: DisplayTitleProps) {
  if (letters) return <SplitLetters title={title} />
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

function titleLabel(title: string | Headline): string {
  return typeof title === "string" ? title : headlineText(title)
}

export { DisplayTitle, titleLabel }
