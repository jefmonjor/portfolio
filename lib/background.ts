export const BACKGROUND_VARIANTS = [
  "grid",
  "dots",
  "radial",
  "noise",
] as const

export type BackgroundVariant = (typeof BACKGROUND_VARIANTS)[number]

export const DEFAULT_BACKGROUND: BackgroundVariant = "radial"

export const BACKGROUND_STORAGE_KEY = "jefmonjor:bg"

export function isBackgroundVariant(value: unknown): value is BackgroundVariant {
  return (
    typeof value === "string" &&
    (BACKGROUND_VARIANTS as readonly string[]).includes(value)
  )
}
