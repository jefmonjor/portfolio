type TagListProps = {
  items: ReadonlyArray<string>
  label?: string
}

function TagList({ items, label }: TagListProps) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label={label}>
      {items.map((item) => (
        <li
          key={item}
          className="inline-flex min-h-6 items-center rounded-6 bg-bg-weak-50 px-2 py-1 text-label-xs text-text-sub-600 ring-1 ring-stroke-soft-200 ring-inset"
        >
          <span className="trim">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export { TagList }
