'use client'

import { Search, Loader2 } from 'lucide-react'
import { nxInputClass } from '@/components/ProductForm'
import { cn } from '@/lib/utils'

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  isSearching?: boolean
  className?: string
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Buscar…',
  isSearching,
  className,
}: SearchFieldProps) {
  return (
    <div className={cn('relative', className)}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-nxi3">
        {isSearching ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(nxInputClass(), 'h-9 pl-9')}
      />
    </div>
  )
}
