function BulletList({ items }: { items: ReadonlyArray<string> }) {
  return (
    <ul className="flex flex-col gap-2.5 text-paragraph-md text-text-strong-950">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            aria-hidden
            className="mt-[0.625rem] inline-block size-1.5 shrink-0 rounded-full bg-icon-soft-400"
          />
          {item}
        </li>
      ))}
    </ul>
  )
}

export { BulletList }
