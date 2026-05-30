'use client'

import { cn } from '@/lib/utils'

interface StatusChipProps {
  status: string
  isCancelScheduled: boolean
}

export function StatusChip({ status, isCancelScheduled }: StatusChipProps) {
  if (isCancelScheduled) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11.5px] font-bold text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Cancelamento agendado
      </span>
    )
  }

  const map: Record<string, { label: string; bg: string; text: string; pulse?: boolean }> = {
    active:   { label: 'Ativo',               bg: 'bg-green-50', text: 'text-green-700', pulse: true },
    pending:  { label: 'Aguardando pagamento', bg: 'bg-amber-50', text: 'text-amber-700' },
    canceled: { label: 'Cancelada',            bg: 'bg-red-50',   text: 'text-red-600' },
    expired:  { label: 'Expirada',             bg: 'bg-red-50',   text: 'text-red-600' },
  }
  const cfg = map[status] ?? map.pending

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold', cfg.bg, cfg.text)}>
      <span className={cn(
        'relative h-1.5 w-1.5 rounded-full bg-current',
        cfg.pulse && 'after:absolute after:inset-0 after:rounded-full after:bg-current after:animate-ping after:opacity-60',
      )} />
      {cfg.label}
    </span>
  )
}
