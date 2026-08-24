import { ImageResponse } from "next/og"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

import { isLocale } from "@/i18n/routing"
import { profile } from "@/lib/profile"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = `${profile.shortName} — portfolio`

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const tMeta = await getTranslations({ locale, namespace: "metadata" })
  const tStatus = await getTranslations({ locale, namespace: "status" })
  const tHero = await getTranslations({ locale, namespace: "hero" })

  const role = tMeta("role")
  const description = tMeta("description")
  const status = tStatus("label")

  const bg = "#0a0a0a"
  const fg = "#f5f5f5"
  const muted = "#8a8a8a"
  const border = "#262626"
  const accent = fg

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: bg,
        color: fg,
        padding: 64,
        fontFamily: "sans-serif",
        backgroundImage: `linear-gradient(to right, ${border} 1px, transparent 1px), linear-gradient(to bottom, ${border} 1px, transparent 1px)`,
        backgroundSize: "56px 56px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 20,
          letterSpacing: 4,
          color: muted,
          textTransform: "uppercase",
          fontFamily: "monospace",
        }}
      >
        <div style={{ width: 10, height: 10, backgroundColor: accent }} />
        <span>{profile.shortName}</span>
        <span style={{ color: border }}>/</span>
        <span>{tHero("indexLabel")}</span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "auto",
          gap: 24,
        }}
      >
        <div
          style={{
            fontSize: 96,
            lineHeight: 1,
            fontWeight: 500,
            letterSpacing: -2,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            color: muted,
            fontFamily: "monospace",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: fg }}>{role}</span>
          <span style={{ color: accent }}>/</span>
          <span>{profile.location}</span>
        </div>
        <div
          style={{
            fontSize: 28,
            color: fg,
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          {description}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 48,
          paddingTop: 24,
          borderTop: `1px dashed ${border}`,
          fontFamily: "monospace",
          fontSize: 18,
          color: muted,
          letterSpacing: 3,
          textTransform: "uppercase",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 8,
              height: 8,
              backgroundColor: accent,
              borderRadius: 999,
            }}
          />
          <span style={{ color: accent }}>{status}</span>
        </div>
        <span>{profile.focus.slice(0, 4).join(" · ")}</span>
      </div>
    </div>,
    size
  )
}
