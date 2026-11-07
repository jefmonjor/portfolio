import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const ogImageSize = { width: 1200, height: 630 }

const ogThemes = {
  site: {
    font: "Inter",
    files: { 500: "site/Inter-Medium.ttf", 600: "site/Inter-SemiBold.ttf" },
    palette: {
      background: "#0d0c0b",
      ink: "#f2efea",
      muted: "#a39b91",
      rule: "#2a2622",
      mark: "#e9a760",
      eyebrow: "#e9a760",
    },
  },
  cv: {
    font: "Figtree",
    files: { 500: "cv/Figtree-Medium.ttf", 600: "cv/Figtree-SemiBold.ttf" },
    palette: {
      background: "#0d0c0b",
      ink: "#f2efea",
      muted: "#a39b91",
      rule: "#2a2622",
      mark: "#e9a760",
      eyebrow: "#e9a760",
    },
  },
} as const

const longTitleCharacters = 80

export type OgCard = {
  theme: keyof typeof ogThemes
  name: string
  role: string
  eyebrow: string
  title: string
}

function fontFile(path: string) {
  return readFile(join(process.cwd(), "public/fonts", path))
}

export async function renderOgCard({
  theme,
  name,
  role,
  eyebrow,
  title,
}: OgCard) {
  const { font, files, palette } = ogThemes[theme]
  const [medium, semiBold] = await Promise.all([
    fontFile(files[500]),
    fontFile(files[600]),
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
        fontFamily: font,
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28 }}
      >
        <div style={{ width: 14, height: 14, backgroundColor: palette.mark }} />
        <span>{name}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <span style={{ fontSize: 28, color: palette.eyebrow }}>{eyebrow}</span>
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
      headers: {
        "Cache-Control":
          "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400",
      },
      fonts: [
        { name: font, data: medium, weight: 500, style: "normal" },
        { name: font, data: semiBold, weight: 600, style: "normal" },
      ],
    }
  )
}
