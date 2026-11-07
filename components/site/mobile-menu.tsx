"use client"

import { Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

type MobileMenuProps = {
  label: string
  children: React.ReactNode
}

function useCloseWhenTouchingOutside(
  menuRef: React.RefObject<HTMLDetailsElement | null>
) {
  useEffect(() => {
    function closeIfOutside(event: PointerEvent) {
      const menu = menuRef.current
      if (!menu?.open || !(event.target instanceof Node)) return
      if (!menu.contains(event.target)) menu.removeAttribute("open")
    }
    document.addEventListener("pointerdown", closeIfOutside)
    return () => document.removeEventListener("pointerdown", closeIfOutside)
  }, [menuRef])
}

function useCloseWhenRouteChanges(
  menuRef: React.RefObject<HTMLDetailsElement | null>,
  pathname: string
) {
  const shownPathname = useRef(pathname)

  useEffect(() => {
    if (shownPathname.current === pathname) return
    shownPathname.current = pathname
    menuRef.current?.removeAttribute("open")
  }, [menuRef, pathname])
}

function MobileMenu({ label, children }: MobileMenuProps) {
  const menuRef = useRef<HTMLDetailsElement>(null)
  const pathname = usePathname()

  useCloseWhenRouteChanges(menuRef, pathname)

  useCloseWhenTouchingOutside(menuRef)

  function closeAfterChoosingLink(event: React.MouseEvent<HTMLDetailsElement>) {
    if (event.target instanceof Element && event.target.closest("a")) {
      menuRef.current?.removeAttribute("open")
    }
  }

  function closeWhenFocusLeaves(event: React.FocusEvent<HTMLDetailsElement>) {
    const next = event.relatedTarget
    if (next instanceof Node && !menuRef.current?.contains(next)) {
      menuRef.current?.removeAttribute("open")
    }
  }

  function closeOnEscape(event: React.KeyboardEvent<HTMLDetailsElement>) {
    if (event.key !== "Escape" || !menuRef.current?.open) return
    menuRef.current.removeAttribute("open")
    menuRef.current.querySelector("summary")?.focus()
  }

  return (
    <details
      ref={menuRef}
      onKeyDown={closeOnEscape}
      onClick={closeAfterChoosingLink}
      onBlur={closeWhenFocusLeaves}
      className="group md:hidden"
    >
      <summary className="site-press -mr-2 flex size-11 cursor-pointer list-none items-center justify-center text-foreground [&::-webkit-details-marker]:hidden">
        <span className="sr-only">{label}</span>
        <HugeiconsIcon
          icon={Menu01Icon}
          className="size-5 group-open:hidden"
          strokeWidth={1.5}
        />
        <HugeiconsIcon
          icon={Cancel01Icon}
          className="hidden size-5 group-open:block"
          strokeWidth={1.5}
        />
      </summary>
      <div className="site-menu-panel absolute inset-x-0 top-full border-b border-border bg-background shadow-[0_12px_24px_-16px_oklch(0.2_0.02_55/0.35)]">
        {children}
      </div>
    </details>
  )
}

export { MobileMenu }
