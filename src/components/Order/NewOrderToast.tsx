'use client'

import { Bell, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NewOrderToastProps {
  customerName: string
  totalFmt: string
  onDismiss: () => void
  className?: string
}

/**
 * J1 · Toast de novo pedido (tempo real). Exporta só o card; o posicionamento
 * fixo fica a cargo da página (passe `className`).
 */
export function NewOrderToast({
  customerName,
  totalFmt,
  onDismiss,
  className,
}: NewOrderToastProps) {
  return (
    <div
      className={cn(
        'flex w-[300px] gap-[11px] rounded-[14px] border border-[#F2D2BE] bg-white p-[13px_14px] shadow-[0_20px_50px_-20px_rgba(20,21,34,0.45)]',
        className,
      )}
    >
      <span className="flex h-[36px] w-[36px] flex-none items-center justify-center rounded-[10px] bg-nxa">
        <Bell size={18} className="text-white" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-extrabold text-nxi1">Novo pedido recebido!</div>
        <div className="mt-[1px] text-[12px] font-semibold text-nxi3">
          {customerName} · {totalFmt}
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Fechar"
        className="flex h-[24px] w-[24px] flex-none items-center justify-center"
      >
        <X size={14} className="text-nxi3" />
      </button>
    </div>
  )
}
