import { useSyncExternalStore } from "react"

function subscribeToNothing(): () => void {
  return () => {}
}

export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  )
}
