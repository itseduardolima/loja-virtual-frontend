'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, X, Check, Info, XCircle, Phone, ShieldCheck, Hourglass } from 'lucide-react'
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

/** Máscara (11) 99999-9999 — mesma do checkout. */
function fmtPhone(v: string): string {
  let raw = v.replace(/\D/g, '')
  // Colar "+55 11 99999-9999" é comum: descarta o DDI para não estourar a máscara.
  if (raw.length > 11 && raw.startsWith('55')) raw = raw.slice(2)
  const d = raw.slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

/**
 * Espelha a validação do backend (BRAZILIAN_PHONE_REGEX): DDD de 2 dígitos
 * começando em 1-9, e 10 dígitos (fixo) ou 11 com o 9 na frente (celular).
 * Sem isso o cliente levaria 400 no submit em vez de erro inline.
 */
function isValidBrPhone(v: string): boolean {
  let d = v.replace(/\D/g, '')
  if (d.length > 11 && d.startsWith('55')) d = d.slice(2)
  if (d.length !== 10 && d.length !== 11) return false
  if (d[0] === '0') return false
  if (d.length === 11 && d[2] !== '9') return false
  return true
}

interface CancelModalProps {
  order: {
    order_code: string
    status: number
    store: { name: string; logo?: string | null }
    created_at: string
    total: string | number
  } | null
  /** Pedido Confirmado (status 2): vira solicitação que o lojista aprova. */
  needsApproval: boolean
  /** Mensagem de erro da API (telefone que não bate, status inválido, 429…). */
  error?: string | null
  onClose: () => void
  onConfirm: (payload: { phone: string; reason: string }) => void
  isBusy: boolean
}

export function CancelModal({
  order,
  needsApproval,
  error,
  onClose,
  onConfirm,
  isBusy,
}: CancelModalProps) {
  const [picked, setPicked] = useState<string | null>(null)
  const [detail, setDetail] = useState('')
  const [phone, setPhone] = useState('')
  const [touchedPhone, setTouchedPhone] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const needsDetail = picked === 'Outro motivo'
  const phoneOk = isValidBrPhone(phone)
  const showPhoneError = touchedPhone && phone.length > 0 && !phoneOk
  const valid = phoneOk && picked !== null && (!needsDetail || detail.trim().length >= 3)

  const handleSubmit = () => {
    if (!valid || isBusy) return
    const reason = detail.trim() ? `${picked}: ${detail.trim()}` : picked!
    onConfirm({ phone, reason })
  }

  const storeInitials = order?.store?.name ? order.store.name.slice(0, 2).toUpperCase() : 'LJ'

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center"
        role="dialog"
        aria-modal
        aria-labelledby="cancel-modal-title"
      >
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
              <h3
                id="cancel-modal-title"
                className="text-[15.5px] font-extrabold tracking-tight text-nxi1"
              >
                {needsApproval ? 'Solicitar cancelamento' : 'Cancelar este pedido?'}
              </h3>
              <p className="mt-0.5 text-[12.5px] leading-snug text-nxi2">
                {needsApproval
                  ? 'A loja já confirmou este pedido, então o cancelamento passa pela aprovação dela.'
                  : 'O pedido ainda não foi confirmado pela loja, então o cancelamento é imediato.'}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-nxi3 hover:bg-nxbg"
            >
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
                  <p className="text-[11px] text-nxi3">
                    {order.store.name} · {formatDate(order.created_at)}
                  </p>
                </div>
                <span className="text-[13px] font-extrabold text-nxi1">
                  {formatPrice(order.total)}
                </span>
              </div>
            )}

            {/* como funciona — muda conforme o status */}
            {needsApproval ? (
              <div className="mb-4 rounded-xl border border-nxw/30 bg-nxw/[0.07] px-3.5 py-3">
                <p className="flex items-center gap-2 text-[12.5px] font-extrabold text-nxi1">
                  <Hourglass size={14} className="shrink-0 text-nxw" />
                  Isto é uma solicitação, não um cancelamento
                </p>
                <ol className="mt-2 space-y-1.5">
                  <li className="flex gap-2 text-[12px] leading-relaxed text-nxi2">
                    <span className="mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-nxw/20 text-[9.5px] font-extrabold text-nxw">
                      1
                    </span>
                    Você envia o pedido de cancelamento agora.
                  </li>
                  <li className="flex gap-2 text-[12px] leading-relaxed text-nxi2">
                    <span className="mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-nxw/20 text-[9.5px] font-extrabold text-nxw">
                      2
                    </span>
                    <span>
                      A loja aprova ou recusa.{' '}
                      <b className="text-nxi1">Até lá o pedido continua válido</b> e o status segue
                      como &ldquo;Confirmado&rdquo; aqui no rastreio.
                    </span>
                  </li>
                </ol>
              </div>
            ) : (
              <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-nxp/15 bg-nxp/[0.04] px-3.5 py-2.5">
                <Info size={15} className="mt-0.5 shrink-0 text-nxp" />
                <p className="text-[12px] leading-relaxed text-nxi2">
                  Como a loja ainda não confirmou este pedido, ele é{' '}
                  <b className="text-nxi1">cancelado na hora</b> e os itens voltam para o estoque.
                  Essa ação não pode ser desfeita.
                </p>
              </div>
            )}

            {/* telefone — prova de posse do pedido (checkout é sem login) */}
            <label
              htmlFor="cancel-phone"
              className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.06em] text-nxi3"
            >
              Telefone usado na compra
            </label>
            <div className="relative">
              <Phone
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-nxi3"
              />
              <input
                id="cancel-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(fmtPhone(e.target.value))}
                onBlur={() => setTouchedPhone(true)}
                placeholder="(11) 99999-9999"
                aria-invalid={showPhoneError}
                aria-describedby="cancel-phone-hint"
                className={cn(
                  'h-11 w-full rounded-xl border bg-white pl-10 pr-3.5 text-[14px] font-medium text-nxi1 placeholder:text-nxi3 focus:outline-none focus:ring-2',
                  showPhoneError
                    ? 'border-nxd focus:border-nxd focus:ring-nxd/15'
                    : 'border-nxborder focus:border-nxp focus:ring-nxp/15',
                )}
              />
            </div>
            <p
              id="cancel-phone-hint"
              className={cn(
                'mt-1.5 flex items-start gap-1.5 text-[11.5px] leading-relaxed',
                showPhoneError ? 'text-nxd' : 'text-nxi3',
              )}
            >
              {!showPhoneError && <ShieldCheck size={13} className="mt-[1px] shrink-0" />}
              {showPhoneError
                ? 'Informe um telefone válido com DDD (10 ou 11 dígitos).'
                : 'Confirmamos que o pedido é seu pelo telefone que você informou no checkout. Não é preciso ter conta.'}
            </p>

            {/* reason chips */}
            <label className="mb-2 mt-4 block text-[12px] font-bold uppercase tracking-[0.06em] text-nxi3">
              Por que deseja cancelar?
            </label>
            <div className="flex flex-wrap gap-2">
              {CANCEL_REASONS.map((r) => {
                const on = picked === r
                return (
                  <button
                    key={r}
                    type="button"
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
              <label
                htmlFor="cancel-detail"
                className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.06em] text-nxi3"
              >
                Detalhe {needsDetail ? '' : '(opcional)'}
              </label>
              <textarea
                id="cancel-detail"
                value={detail}
                onChange={(e) => setDetail(e.target.value.slice(0, 400))}
                rows={3}
                placeholder={
                  needsDetail
                    ? 'Conte o que aconteceu…'
                    : 'Quer acrescentar algo para a loja? (opcional)'
                }
                className="w-full resize-none rounded-xl border border-nxborder bg-white px-3.5 py-2.5 text-[13.5px] leading-relaxed text-nxi1 placeholder:text-nxi3 focus:border-nxp focus:outline-none focus:ring-2 focus:ring-nxp/15"
              />
              <p className="mt-1 text-right text-[11px] text-nxi3">{detail.length}/400</p>
            </div>

            {/* erro vindo da API */}
            {error && (
              <div
                role="alert"
                className="mt-3 flex items-start gap-2.5 rounded-xl border border-nxd/30 bg-nxd/[0.05] px-3.5 py-2.5"
              >
                <AlertTriangle size={15} className="mt-0.5 shrink-0 text-nxd" />
                <p className="text-[12px] leading-relaxed text-nxi1">{error}</p>
              </div>
            )}
          </div>

          {/* footer — "Manter pedido" é a ação dominante */}
          <div className="flex flex-col-reverse gap-2 border-t border-nxborder px-5 py-4 sm:flex-row">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!valid || isBusy}
              className="flex h-11 items-center justify-center gap-2 rounded-full border border-nxd/40 px-4 text-[13px] font-bold text-nxd transition-colors hover:bg-nxd/[0.06] disabled:opacity-40"
            >
              {isBusy ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-nxd/30 border-t-nxd" />
              ) : (
                <XCircle size={16} />
              )}
              {isBusy ? 'Enviando…' : needsApproval ? 'Enviar solicitação' : 'Sim, cancelar pedido'}
            </button>
            <button
              type="button"
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
