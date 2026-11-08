"use client"

import { Cancel01Icon, Menu01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { usePathname } from "next/navigation"
import { useRef } from "react"

const menuId = "site-menu"

type MobileMenuProps = {
  label: string
  children: React.ReactNode
}

function MobileMenu({ label, children }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  function hideAfterChoosingLink(event: React.MouseEvent<HTMLDivElement>) {
    if (
      event.target instanceof Element &&
      event.target.closest("a, [data-closes-menu]")
    ) {
      panelRef.current?.hidePopover()
    }
  }

  function hideWhenFocusLeaves(event: React.FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget
    const staysInMenu =
      next instanceof Element &&
      (panelRef.current?.contains(next) ||
        next.closest(`[popovertarget="${menuId}"]`))
    if (next && !staysInMenu) panelRef.current?.hidePopover()
  }

  return (
    <>
      <button
        type="button"
        popoverTarget={menuId}
        className="site-press -mr-2 flex size-11 items-center justify-center rounded-10 text-icon-strong-950 md:hidden"
      >
        <span className="sr-only">{label}</span>
        <HugeiconsIcon
          icon={Menu01Icon}
          className="menu-icon-open size-5"
          strokeWidth={1.5}
        />
        <HugeiconsIcon
          icon={Cancel01Icon}
          className="menu-icon-close size-5"
          strokeWidth={1.5}
        />
      </button>
      <div
        key={pathname}
        id={menuId}
        ref={panelRef}
        popover="auto"
        onClick={hideAfterChoosingLink}
        onBlur={hideWhenFocusLeaves}
        className="site-menu-panel fixed inset-x-0 top-16 bottom-0 m-0 h-auto w-full max-w-none overflow-y-auto overscroll-contain border-0 border-t border-stroke-soft-200 bg-bg-white-0 p-0 text-text-strong-950 md:hidden"
      >
        {children}
      </div>
    </>
  )
}

export { MobileMenu }
