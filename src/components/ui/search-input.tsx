'use client'

import { forwardRef } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear?: () => void
  isLoading?: boolean
  className?: string
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, onClear, isLoading, className, placeholder, ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex items-center gap-2 rounded-full bg-nxbg border border-nxborder px-3 h-9 transition-[border-color]',
          'focus-within:border-nxp focus-within:shadow-[0_0_0_3px_hsl(var(--nxp)/0.10)]',
          className,
        )}
      >
        <Search className="w-[15px] h-[15px] text-nxi3 shrink-0" />
        <input
          ref={ref}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[13px] text-nxi2 placeholder:text-nxi3"
          {...props}
        />
        {isLoading && (
          <div className="shrink-0 h-3 w-3 animate-spin rounded-full border-2 border-t-transparent border-nxi3" />
        )}
        {!isLoading && value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 text-[18px] leading-none text-nxi3 hover:text-nxi2 cursor-pointer bg-transparent border-0 p-0"
            aria-label="Limpar busca"
          >
            ×
          </button>
        )}
      </div>
    )
  },
)

SearchInput.displayName = 'SearchInput'

export { SearchInput }
