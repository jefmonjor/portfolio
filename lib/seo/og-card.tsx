import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const ogImageSize = { width: 1200, height: 630 }

const palette = {
  background: "#0d0c0b",
  ink: "#f2efea",
  muted: "#a39b91",
  rule: "#2a2622",
  brand: "#e9a760",
}

const longTitleCharacters = 80

export type OgCard = {
  name: string
  role: string
  eyebrow: string
  title: string
}

function figtree(weight: "Medium" | "SemiBold") {
  return readFile(join(process.cwd(), `public/fonts/cv/Figtree-${weight}.ttf`))
}

export async function renderOgCard({ name, role, eyebrow, title }: OgCard) {
  const [medium, semiBold] = await Promise.all([
    figtree("Medium"),
    figtree("SemiBold"),
  ])

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        backgroundColor: palette.background,
        color: palette.ink,
        fontFamily: "Figtree",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28 }}
      >
        <div
          style={{ width: 14, height: 14, backgroundColor: palette.brand }}
        />
        <span>{name}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <span style={{ fontSize: 28, color: palette.brand }}>{eyebrow}</span>
        <span
          style={{
            fontSize: title.length > longTitleCharacters ? 56 : 68,
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: -1.5,
            maxWidth: 1000,
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 24,
          borderTop: `1px solid ${palette.rule}`,
          fontSize: 24,
          color: palette.muted,
        }}
      >
        <span>{role}</span>
        <span>jefmonjor.dev</span>
      </div>
    </div>,
    {
      ...ogImageSize,
      fonts: [
        { name: "Figtree", data: medium, weight: 500, style: "normal" },
        { name: "Figtree", data: semiBold, weight: 600, style: "normal" },
      ],
    }
  )
}
