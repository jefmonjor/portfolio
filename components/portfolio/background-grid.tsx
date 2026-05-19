function BackgroundGrid() {
  return (
    <div
      aria-hidden
      data-print-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_at_top,black_0%,transparent_70%)] opacity-60"
    />
  )
}

export { BackgroundGrid }
