export const OPEN_TERMINAL_EVENT = "site-console:open-terminal"

export function openTerminal() {
  window.dispatchEvent(new Event(OPEN_TERMINAL_EVENT))
}
