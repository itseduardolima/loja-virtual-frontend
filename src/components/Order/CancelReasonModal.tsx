'use client'

import { useEffect, useState } from 'react'
import { XCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CancelReasonModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  loading?: boolean
}

/**
 * I2 · Cancelar pedido (lojista) — modal com textarea obrigatória do motivo.
 * Botão "Confirmar cancelamento" fica desabilitado enquanto o campo está vazio.
 */
export function CancelReasonModal({
  open,
  onClose,
  onConfirm,
  loading = false,
}: CancelReasonModalProps) {
  const [text, setText] = useState('')

  // Limpa o campo ao abrir.
  useEffect(() => {
    if (open) setText('')
  }, [open])

  // Esc fecha.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const trimmed = text.trim()
  const disabled = !trimmed || loading

  const handleConfirm = () => {
    if (!trimmed || loading) return
    onConfirm(trimmed)
    setText('')
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(20,21,34,0.42)] p-[24px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[420px] rounded-[18px] bg-white p-[22px] shadow-[0_30px_70px_-28px_rgba(20,21,34,0.6)]"
      >
        {/* Header */}
        <div className="flex items-center gap-[10px]">
          <span className="flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-[#FBE9EE]">
            <XCircle size={19} className="text-nxd" />
          </span>
          <div>
            <div className="text-[16px] font-extrabold text-nxi1">Cancelar pedido</div>
            <div className="text-[12px] font-semibold text-nxi3">
              Informe o motivo do cancelamento.
            </div>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 500))}
          maxLength={500}
          placeholder="Ex.: produto sem estoque, pagamento não confirmado…"
          className="mt-[14px] h-[104px] w-full resize-none rounded-[12px] border border-nxborder p-[11px_12px] text-[13px] font-semibold leading-[1.45] text-nxi1 outline-none"
        />
        <div className="mt-[4px] text-right text-[11px] font-bold text-nxi3">{text.length}/500</div>

        {/* Ações */}
        <div className="mt-[8px] flex gap-[9px]">
          <button
            type="button"
            onClick={onClose}
            className="h-[42px] flex-1 rounded-[11px] border border-nxborder bg-white text-[13.5px] font-extrabold text-nxi2"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={disabled}
            className={cn(
              'flex h-[42px] flex-1 items-center justify-center gap-[7px] rounded-[11px] text-[13.5px] font-extrabold text-white',
              disabled ? 'cursor-not-allowed bg-[#E9C9C5]' : 'bg-nxd',
            )}
          >
            {loading && <Loader2 size={14} className="animate-spin text-white" />}
            Confirmar cancelamento
          </button>
        </div>
      </div>
    </div>
  )
}
