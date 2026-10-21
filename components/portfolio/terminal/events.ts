// Kept apart from terminal.tsx so the top bar and the command palette can
// open the terminal without pulling it into the first-load bundle.
export const TERMINAL_EVENT = "jefmonjor:terminal:open"

export function openTerminal(): void {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(TERMINAL_EVENT))
}

export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  )
}

export function isTerminalShortcut(event: KeyboardEvent): boolean {
  return (
    event.key === "`" &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.altKey &&
    !isEditableTarget(event.target)
  )
}
