"use client"

import * as React from "react"

import { profile } from "@/lib/profile"

const SIGNATURE = `
  ┌──────────────────────────────────────────────┐
  │   if you're reading this, we should talk.    │
  └──────────────────────────────────────────────┘
`

function ConsoleSignature() {
  const printed = React.useRef(false)

  React.useEffect(() => {
    if (printed.current) return
    printed.current = true

    const email =
      profile.socials.find((s) => s.kind === "email")?.handle ??
      profile.socials.find((s) => s.kind === "email")?.href
    const linkedin = profile.socials.find((s) => s.kind === "linkedin")?.href

    const title = `%c${profile.shortName}`
    const titleStyle =
      "font: 700 28px/1 ui-sans-serif, system-ui; padding: 8px 0;"
    const labelStyle = "font: 700 11px/1 ui-monospace, monospace; color: #888;"
    const valueStyle = "font: 400 11px/1.4 ui-monospace, monospace;"

    console.log(title, titleStyle)
    console.log("%cSIGNATURE", labelStyle)
    console.log(`%c${SIGNATURE}`, valueStyle)
    if (email) console.log("%cEMAIL%c " + email, labelStyle, valueStyle)
    if (linkedin) console.log("%cLINKEDIN%c " + linkedin, labelStyle, valueStyle)
  }, [])

  return null
}

export { ConsoleSignature }
