"use client"

import * as React from "react"

import {
  BACKGROUND_STORAGE_KEY,
  BACKGROUND_VARIANTS,
  DEFAULT_BACKGROUND,
  isBackgroundVariant,
  type BackgroundVariant,
} from "@/lib/background"

type BackgroundContextValue = {
  variant: BackgroundVariant
  setVariant: (next: BackgroundVariant) => void
}

const BackgroundContext = React.createContext<BackgroundContextValue | null>(
  null
)

const BACKGROUND_CHANGE_EVENT = "jefmonjor:bg-change"

function readVariantFromDom(): BackgroundVariant {
  if (typeof document === "undefined") return DEFAULT_BACKGROUND
  const fromAttr = document.documentElement.dataset.bg
  if (isBackgroundVariant(fromAttr)) return fromAttr
  return DEFAULT_BACKGROUND
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(BACKGROUND_CHANGE_EVENT, onChange)
  return () => window.removeEventListener(BACKGROUND_CHANGE_EVENT, onChange)
}

function getServerSnapshot(): BackgroundVariant {
  return DEFAULT_BACKGROUND
}

function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const variant = React.useSyncExternalStore(
    subscribe,
    readVariantFromDom,
    getServerSnapshot
  )

  const setVariant = React.useCallback((next: BackgroundVariant) => {
    document.documentElement.dataset.bg = next
    try {
      window.localStorage.setItem(BACKGROUND_STORAGE_KEY, next)
    } catch {
      // localStorage may be unavailable (private mode, quota); ignore.
    }
    window.dispatchEvent(new Event(BACKGROUND_CHANGE_EVENT))
  }, [])

  const value = React.useMemo(
    () => ({ variant, setVariant }),
    [variant, setVariant]
  )

  return (
    <BackgroundContext.Provider value={value}>
      {children}
    </BackgroundContext.Provider>
  )
}

function useBackground(): BackgroundContextValue {
  const ctx = React.useContext(BackgroundContext)
  if (!ctx) {
    throw new Error("useBackground must be used within a BackgroundProvider")
  }
  return ctx
}

const BACKGROUND_INIT_SCRIPT = `(() => {
  try {
    var stored = window.localStorage.getItem(${JSON.stringify(BACKGROUND_STORAGE_KEY)});
    var allowed = ${JSON.stringify(BACKGROUND_VARIANTS)};
    if (stored && allowed.indexOf(stored) !== -1) {
      document.documentElement.dataset.bg = stored;
    } else {
      document.documentElement.dataset.bg = ${JSON.stringify(DEFAULT_BACKGROUND)};
    }
  } catch (e) {
    document.documentElement.dataset.bg = ${JSON.stringify(DEFAULT_BACKGROUND)};
  }
})();`

function BackgroundInitScript() {
  return (
    <script
      // Runs before hydration to prevent flicker between variants.
      dangerouslySetInnerHTML={{ __html: BACKGROUND_INIT_SCRIPT }}
    />
  )
}

export { BackgroundProvider, BackgroundInitScript, useBackground }
