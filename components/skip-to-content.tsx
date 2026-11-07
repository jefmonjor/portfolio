function SkipToContent({ label }: { label: string }) {
  return (
    <a href="#main" className="site-skip-link">
      {label}
    </a>
  )
}

export { SkipToContent }
