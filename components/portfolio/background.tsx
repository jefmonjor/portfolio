function Background() {
  return (
    <div
      aria-hidden
      data-bg-root
      data-print-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        data-bg-variant="grid"
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_at_top,black_0%,transparent_70%)] opacity-60"
      />
      <div
        data-bg-variant="dots"
        className="absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_at_top,black_0%,transparent_75%)] opacity-70"
      />
      <div
        data-bg-variant="radial"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,var(--color-muted)_0%,transparent_70%)]"
      />
      <div
        data-bg-variant="noise"
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay dark:opacity-[0.12] dark:mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "160px 160px",
        }}
      />
    </div>
  )
}

export { Background }
