import { cn } from "@/lib/utils"

type MarqueeProps = {
  items: ReadonlyArray<string>
  className?: string
}

function Marquee({ items, className }: MarqueeProps) {
  const loop = [...items, ...items]

  return (
    <div data-print-hidden className="mx-auto max-w-6xl px-4 sm:px-8">
      <div
        aria-hidden
        className={cn(
          "relative overflow-hidden border-y border-border bg-muted/30",
          className
        )}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-background to-transparent" />
        <div className="flex w-max animate-marquee gap-10 py-2.5 font-mono text-[11px] tracking-widest text-muted-foreground uppercase motion-reduce:animate-none">
          {loop.map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-10">
              {item}
              <span className="text-border">/</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export { Marquee }
