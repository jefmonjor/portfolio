"use client"

import { useTheme } from "next-themes"
import { useCallback } from "react"

type Theme = "light" | "dark"

function themeShownNow(resolvedTheme: string | undefined): Theme {
  if (resolvedTheme === "dark" || resolvedTheme === "light")
    return resolvedTheme
  return document.documentElement.classList.contains("dark") ? "dark" : "light"
}

export function useThemeToggle(): () => void {
  const { resolvedTheme, setTheme } = useTheme()
  return useCallback(
    () => setTheme(themeShownNow(resolvedTheme) === "dark" ? "light" : "dark"),
    [resolvedTheme, setTheme]
  )
}
