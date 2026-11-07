import Link from "next/link"

function BrandLink({ href, name }: { href: string; name: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-2.5 font-heading text-[1.0625rem] font-medium tracking-[-0.01em] text-foreground"
    >
      <span aria-hidden className="inline-block size-2 bg-brand" />
      {name}
    </Link>
  )
}

export { BrandLink }
