'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlpFilterDrawerProps {
  open: boolean
  onClose: () => void
  resultCount: number
  activeCount: number
  onClearAll: () => void
  children: ReactNode
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

/** Bottom sheet de filtros do mobile — contrato completo de modal (scroll-lock,
 *  Esc, foco preso no painel, foco restaurado ao trigger ao fechar). */
export function PlpFilterDrawer({
  open,
  onClose,
  resultCount,
  activeCount,
  onClearAll,
  children,
}: PlpFilterDrawerProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<Element | null>(null)

  useEffect(() => {
    if (!open) return

    triggerRef.current = document.activeElement
    closeBtnRef.current?.focus()

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !sheetRef.current) return

      const focusables = sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <div
        className="absolute inset-0 bg-nxi1/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="plp-filter-drawer-title"
        className="plp-sheet absolute inset-x-0 bottom-0 flex h-[86%] flex-col rounded-t-[24px] bg-nxsurf shadow-2xl"
      >
        <div className="flex justify-center pt-3.5">
          <div className="h-[5px] w-10 rounded-full bg-nxborder" />
        </div>

        <div className="flex items-center justify-between border-b border-nxborder px-5 py-3.5">
          <h2 id="plp-filter-drawer-title" className="font-integral text-[19px] tracking-[-0.02em] text-nxi1">
            Filtros
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Fechar filtros"
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-xl bg-nxbg text-nxi1 transition-colors hover:bg-nxborder',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2',
            )}
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-5 py-1">{children}</div>

        <div className="flex items-center gap-3 border-t border-nxborder bg-nxsurf px-5 py-3.5">
          <button
            type="button"
            onClick={onClearAll}
            className="flex-none font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-nxd focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nxd/40 focus-visible:ring-offset-2"
          >
            Limpar{activeCount > 0 ? ` (${activeCount})` : ''}
          </button>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'flex h-[50px] flex-1 items-center justify-center gap-2 rounded-2xl bg-store text-[15px] font-bold text-white transition-transform active:scale-[0.98]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2',
            )}
          >
            Ver {resultCount} {resultCount === 1 ? 'produto' : 'produtos'}
          </button>
        </div>
      </div>
    </div>
  )
}
