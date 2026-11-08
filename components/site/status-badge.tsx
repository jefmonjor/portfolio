function StatusBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex min-h-7 items-center gap-2 rounded-full bg-state-success-lighter px-2.5 py-1.5 text-label-xs text-state-success-dark ring-1 ring-state-success-light ring-inset">
      <span aria-hidden className="status-dot" />
      <span className="trim">{children}</span>
    </span>
  )
}

export { StatusBadge }
