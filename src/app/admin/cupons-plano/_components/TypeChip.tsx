import { cn } from '@/lib/utils'

interface TypeChipProps {
  type: 'percent' | 'fixed'
}

export function TypeChip({ type }: TypeChipProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-semibold',
      type === 'percent' ? 'bg-green-50 text-green-700' : 'bg-nxp/10 text-nxp',
    )}>
      {type === 'percent' ? '% desconto' : 'R$ fixo'}
    </span>
  )
}
