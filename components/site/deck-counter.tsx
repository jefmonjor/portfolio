import { twoDigits } from "@/lib/numbering"

function DeckCounter({ total }: { total: number }) {
  const positions = Array.from({ length: total }, (_, index) => index + 1)

  return (
    <div aria-hidden className="deck-counter mt-10 max-w-40 flex-col gap-3">
      <span className="flex items-baseline gap-2">
        <span className="deck-counter-window font-heading text-title-h2 text-text-strong-950 tabular-nums">
          <span className="deck-counter-strip">
            {positions.map((position) => (
              <span key={position}>{twoDigits(position)}</span>
            ))}
          </span>
        </span>
        <span className="text-label-sm text-text-sub-600 tabular-nums">
          / {twoDigits(total)}
        </span>
      </span>
      <span className="deck-progress" />
    </div>
  )
}

export { DeckCounter }
