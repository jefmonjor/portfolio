import { Bricolage_Grotesque, Source_Sans_3 } from "next/font/google"

const text = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-text",
  display: "swap",
})

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display",
  display: "swap",
})

export const siteFontVariables = `${text.variable} ${display.variable}`
