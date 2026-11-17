import Link from "next/link"

type BrandLinkProps = {
  href: string
  name: string
  /** A small line under the name on phones, such as the role in the top bar; from 48rem the bar has no room for it. */
  subtitle?: string
}

function BrandLink({ href, name, subtitle }: BrandLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-11 gap-2.5 font-heading text-[1.0625rem] tracking-[-0.01em] text-text-strong-950 ${subtitle ? "items-start md:items-center" : "items-center"}`}
    >
      <span
        aria-hidden
        className={`inline-block size-2 shrink-0 bg-primary-base transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:rotate-90 group-focus-visible:rotate-90 motion-reduce:transition-none ${subtitle ? "mt-[0.5rem] md:mt-0" : ""}`}
      />
      {subtitle ? (
        <span className="flex flex-col">
          <span className="whitespace-nowrap">{name}</span>
          <span className="font-ui text-[0.8125rem] leading-4 tracking-normal text-text-sub-600 md:hidden">
            {subtitle}
          </span>
        </span>
      ) : (
        name
      )}
    </Link>
  )
}

export { BrandLink }
