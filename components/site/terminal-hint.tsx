"use client"

import { useEffect, useState } from "react"

import { openTerminal } from "@/components/site/console-events"
import { useIsHydrated } from "@/hooks/use-is-hydrated"

const demoCommands = ["whoami", "projects", "help"] as const
const restingCommand = demoCommands[demoCommands.length - 1] ?? ""
const longestCommand = Math.max(...demoCommands.map((c) => c.length))

const startDelayMs = 900
const typeMs = 70
const holdMs = 850
const eraseMs = 35

type Keystroke = { text: string; after: number }

/** Types each command, holds it, erases it, and rests on the last one. */
function keystrokes(): Keystroke[] {
  return demoCommands.flatMap((command, commandIndex) => {
    const typed = Array.from(command, (_, i) => ({
      text: command.slice(0, i + 1),
      after: typeMs,
    }))
    if (commandIndex === demoCommands.length - 1) return typed
    const erased = Array.from(command, (_, i) => ({
      text: command.slice(0, command.length - i - 1),
      after: eraseMs,
    }))
    const held = typed.map((stroke, i) =>
      i === typed.length - 1 ? { ...stroke, after: holdMs } : stroke
    )
    return [...held, ...erased]
  })
}

// Once per session, like the rest of the hero intro, and never with reduced motion.
function shouldType(): boolean {
  return (
    typeof document !== "undefined" &&
    document.documentElement.dataset.intro !== "played" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

function TerminalHint({ label }: { label: string }) {
  const isHydrated = useIsHydrated()
  const [willType] = useState(shouldType)
  const [command, setCommand] = useState(willType ? "" : restingCommand)
  const [typing, setTyping] = useState(willType)

  useEffect(() => {
    if (!willType) return
    const timers: number[] = []
    let elapsed = startDelayMs
    for (const stroke of keystrokes()) {
      timers.push(window.setTimeout(() => setCommand(stroke.text), elapsed))
      elapsed += stroke.after
    }
    timers.push(window.setTimeout(() => setTyping(false), elapsed))
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [willType])

  if (!isHydrated) return null

  return (
    <button
      type="button"
      onClick={openTerminal}
      data-typing={typing || undefined}
      className="terminal-hint"
    >
      <span
        aria-hidden
        className="terminal-hint-line"
        style={{ "--command-width": `${longestCommand}ch` }}
      >
        <span className="text-primary-base">&gt;</span>
        <span className="terminal-hint-command">
          {command}
          <span className="terminal-hint-caret" />
        </span>
      </span>
      <span className="terminal-hint-label">{label}</span>
    </button>
  )
}

export { TerminalHint }
