'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, X, Check, Info, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { formatPrice, formatDate } from '@/lib/utils'

const CANCEL_REASONS = [
  'Comprei sem querer',
  'Mudei de ideia',
  'Achei mais barato',
  'Demora na confirmação',
  'Errei cor / tamanho',
  'Outro motivo',
]

interface CancelModalProps {
  order: { order_code: string; store: { name: string; logo?: string | null }; created_at: string; total: string | number } | null
  onClose: () => void
  onConfirm: (reason: string) => void
  isBusy: boolean
}

export function CancelModal({ order, onClose, onConfirm, isBusy }: CancelModalProps) {
  const [picked, setPicked] = useState<string | null>(null)
  const [detail, setDetail] = useState('')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const needsDetail = picked === 'Outro motivo'
  const valid = picked !== null && (!needsDetail || detail.trim().length >= 3)

  const handleSubmit = () => {
    if (!valid) return
    const reason = detail.trim() ? `${picked}: ${detail.trim()}` : picked!
    onConfirm(reason)
  }

  const storeInitials = order?.store?.name
    ? order.store.name.slice(0, 2).toUpperCase()
    : 'LJ'

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center" role="dialog" aria-modal>
        <motion.div
          className="absolute inset-0 bg-nxi1/45 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="relative flex max-h-[92vh] w-full max-w-[470px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* header */}
          <div className="flex items-start gap-3 border-b border-nxborder px-5 py-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-nxd/10 text-nxd">
              <AlertTriangle size={19} />
            </span>
            <div className="min-w-0">
              <h3 className="text-[15.5px] font-extrabold tracking-tight text-nxi1">Cancelar este pedido?</h3>
              <p className="mt-0.5 text-[12.5px] leading-snug text-nxi2">
                Sua solicitação vai para análise da loja — o pedido ainda não é cancelado na hora.
              </p>
            </div>
            <button onClick={onClose} className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-nxi3 hover:bg-nxbg">
              <X size={18} />
            </button>
          </div>

          {/* body — scrollável */}
          <div className="flex-1 overflow-y-auto px-5 py-4">

            {/* order recap */}
            {order && (
              <div className="mb-4 flex items-center gap-3 rounded-xl bg-nxbg px-3.5 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-nxp text-[12px] font-extrabold text-white">
                  {storeInitials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-bold text-nxi1">Pedido #{order.order_code}</p>
                  <p className="text-[11px] text-nxi3">{order.store.name} · {formatDate(order.created_at)}</p>
                </div>
                <span className="text-[13px] font-extrabold text-nxi1">{formatPrice(order.total)}</span>
              </div>
            )}

            {/* info callout */}
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-nxp/15 bg-nxp/[0.04] px-3.5 py-2.5">
              <Info size={15} className="mt-0.5 shrink-0 text-nxp" />
              <p className="text-[12px] leading-relaxed text-nxi2">
                A loja costuma responder em até <b className="text-nxi1">24h úteis</b>. Como o pedido ainda está{' '}
                <b className="text-nxi1">pendente</b>, a aprovação geralmente é rápida. Você acompanha o resultado por aqui.
              </p>
            </div>

            {/* reason chips */}
            <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.06em] text-nxi3">
              Por que deseja cancelar?
            </label>
            <div className="flex flex-wrap gap-2">
              {CANCEL_REASONS.map((r) => {
                const on = picked === r
                return (
                  <button
                    key={r}
                    onClick={() => setPicked(r)}
                    className={cn(
                      'rounded-full border px-3 py-2 text-[12.5px] font-semibold transition-colors',
                      on
                        ? 'border-nxd bg-nxd/[0.07] text-nxd'
                        : 'border-nxborder text-nxi2 hover:border-nxi3',
                    )}
                  >
                    {on && <Check size={12} strokeWidth={3} className="mr-1 inline" />}
                    {r}
                  </button>
                )
              })}
            </div>

            {/* detail textarea */}
            <div className="mt-4">
              <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.06em] text-nxi3">
                Detalhe {needsDetail ? '' : '(opcional)'}
              </label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value.slice(0, 500))}
                rows={3}
                placeholder={
                  needsDetail
                    ? 'Conte o que aconteceu…'
                    : 'Quer acrescentar algo para a loja? (opcional)'
                }
                className="w-full resize-none rounded-xl border border-nxborder bg-white px-3.5 py-2.5 text-[13.5px] leading-relaxed text-nxi1 placeholder:text-nxi3 focus:border-nxp focus:outline-none focus:ring-2 focus:ring-nxp/15"
              />
              <p className="mt-1 text-right text-[11px] text-nxi3">{detail.length}/500</p>
            </div>
          </div>

          {/* footer — "Manter pedido" é a ação dominante */}
          <div className="flex flex-col-reverse gap-2 border-t border-nxborder px-5 py-4 sm:flex-row">
            <button
              onClick={handleSubmit}
              disabled={!valid || isBusy}
              className="flex h-11 items-center justify-center gap-2 rounded-full border border-nxd/40 px-4 text-[13px] font-bold text-nxd transition-colors hover:bg-nxd/[0.06] disabled:opacity-40"
            >
              {isBusy ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-nxd/30 border-t-nxd" />
              ) : (
                <XCircle size={16} />
              )}
              {isBusy ? 'Enviando…' : 'Sim, cancelar'}
            </button>
            <button
              onClick={onClose}
              className="h-11 flex-1 rounded-full bg-nxp text-[13.5px] font-bold text-white transition-transform active:scale-[0.99]"
            >
              Manter pedido
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
