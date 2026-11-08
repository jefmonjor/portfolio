import { Fraunces, Geist, Geist_Mono } from "next/font/google"

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" })

const display = Fraunces({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-display",
  display: "swap",
})

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  preload: false,
})

const rootFontVariables = `:root{--font-sans:${sans.style.fontFamily};--font-display:${display.style.fontFamily};--font-mono:${mono.style.fontFamily}}`

// Dialogs and toasts portal to <body>, outside any wrapper this layout could
// put a font class on, so the variables have to live on :root.
function CvFonts() {
  return <style dangerouslySetInnerHTML={{ __html: rootFontVariables }} />
}

export { CvFonts }
