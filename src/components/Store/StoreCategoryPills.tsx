'use client'

import { cn } from '@/lib/utils'
import { StorePill } from '@/components/Store/ui'

interface StoreCategoryPillsProps {
  categories: string[]
  active: string
  onSelect: (cat: string) => void
  counts?: Record<string, number>
}

export function StoreCategoryPills({ categories, active, onSelect, counts }: StoreCategoryPillsProps) {
  return (
    <div className="sticky top-16 z-40 border-b border-nxborder bg-white/95 backdrop-blur">
      <div className="edge-fade-x mx-auto flex max-w-store items-center gap-3 overflow-x-auto px-4 py-3 [&::-webkit-scrollbar]:hidden md:px-10">
        {categories.map((cat) => {
          const isActive = active === cat

          return (
            <StorePill
              key={cat}
              active={isActive}
              // 'Todos' nunca exibe contagem; StorePill já oculta count nulo/0.
              count={cat === 'Todos' ? undefined : counts?.[cat]}
              onClick={() => onSelect(cat)}
              // Preserva aparência/timing originais: pílula inativa é semibold
              // (o primitivo é bold) e a transição roda em 300ms.
              className={cn('duration-300', !isActive && 'font-semibold')}
            >
              {cat}
            </StorePill>
          )
        })}
      </div>
    </div>
  )
}
