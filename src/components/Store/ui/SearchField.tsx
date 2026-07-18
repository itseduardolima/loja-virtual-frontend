'use client'

import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchFieldProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  /** callback do botão limpar — quando presente e houver valor, mostra o "×" */
  onClear?: () => void
  /** dica de atalho à direita (ex.: "/") */
  kbdHint?: string
  containerClassName?: string
}

/**
 * Campo de busca em pill (ícone + input + limpar/atalho). Reutilizável no header,
 * na PLP e em qualquer busca da vitrine. Foco pinta com o accent do lojista.
 */
export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  { onClear, kbdHint, containerClassName, className, value, ...rest },
  ref,
) {
  const hasValue = value != null && value !== ''
  return (
    <div
      className={cn(
        'flex h-11 items-center gap-2.5 rounded-full border border-nxborder bg-white px-4 transition-colors focus-within:border-store focus-within:ring-2 focus-within:ring-store/25',
        containerClassName,
      )}
    >
      <Search size={16} className="flex-none text-nxi3" />
      <input
        ref={ref}
        type="text"
        value={value}
        className={cn(
          'min-w-0 flex-1 border-0 bg-transparent text-[14px] text-nxi1 outline-none placeholder:text-nxi3',
          className,
        )}
        {...rest}
      />
      {onClear && hasValue ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Limpar busca"
          className="flex h-6 w-6 flex-none items-center justify-center rounded-full text-nxi3 hover:text-nxi1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store"
        >
          <X size={15} />
        </button>
      ) : kbdHint ? (
        <kbd className="flex-none rounded-md border border-nxborder px-1.5 py-0.5 font-mono text-[10px] text-nxi3">
          {kbdHint}
        </kbd>
      ) : null}
    </div>
  )
})
