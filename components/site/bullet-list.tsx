function BulletList({ items }: { items: ReadonlyArray<string> }) {
  return (
    <ul className="flex flex-col gap-2.5 text-[1.0625rem] leading-relaxed text-foreground">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            aria-hidden
            className="mt-[0.7em] inline-block size-1.5 shrink-0 bg-brand"
          />
          {item}
        </li>
      ))}
    </ul>
  )
}

export { BulletList }
