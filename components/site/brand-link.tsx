import Link from "next/link"

function BrandLink({ href, name }: { href: string; name: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-11 items-center gap-2.5 text-label-md text-text-strong-950"
    >
      <span
        aria-hidden
        className="inline-block size-2.5 rounded-[3px] bg-bg-strong-950 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:rotate-90 group-focus-visible:rotate-90 motion-reduce:transition-none"
      />
      {name}
    </Link>
  )
}

export { BrandLink }
