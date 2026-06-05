'use client'

import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn, formatPrice, formatDateShort } from '@/lib/utils'
import { PAYMENT_STATUS } from '@/lib/vendor'
import type { StatusTone } from '@/lib/vendor'
import { useGetPaymentLink } from '@/hooks/useSubscription'
import { LoadingSpinner } from '@/components'
import { Payment } from '@/types/subscription'

interface PaymentHistoryProps {
  planName: string | undefined
  billingCycle: 'monthly' | 'yearly'
  payments: Payment[]
  total: number
  totalPages: number
  page: number
  isLoading: boolean
  onPageChange: (page: number) => void
}

const TONE_CLS: Record<StatusTone, string> = {
  success: 'bg-green-50 text-green-700',
  warning: 'bg-amber-50 text-amber-700',
  danger:  'bg-red-50 text-red-600',
  neutral: 'bg-purple-50 text-purple-700',
  primary: 'bg-nxp/10 text-nxp',
}

// Override de cor para status cujo tone não é 1:1 com a cor desejada
const STATUS_CLS_OVERRIDE: Partial<Record<string, string>> = {
  refund_requested: 'bg-orange-50 text-orange-700',
}

function getStatusCfg(status: string): { label: string; cls: string } {
  const entry = PAYMENT_STATUS[status]
  if (!entry) return { label: status, cls: 'bg-nxbg text-nxi2' }
  const cls = STATUS_CLS_OVERRIDE[status] ?? TONE_CLS[entry.tone]
  return { label: entry.label, cls }
}

export function PaymentHistory({ planName, billingCycle, payments, total, totalPages, page, isLoading, onPageChange }: PaymentHistoryProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-nxborder bg-white">
      <div className="border-b border-nxborder px-6 py-4">
        <h3 className="text-[14px] font-bold text-nxi1">Histórico de cobranças</h3>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="sm" />
        </div>
      ) : payments.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="border-b border-nxborder bg-nxbg">
                  {['Data', 'Descrição', 'Valor', 'Status', ''].map((h, i) => (
                    <th
                      key={i}
                      className={cn(
                        'px-6 py-3 text-[10.5px] font-bold uppercase tracking-widest text-nxi3',
                        i === 2 ? 'text-right' : 'text-left',
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-nxborder">
                {payments.map((payment) => (
                  <PaymentRow
                    key={payment.id}
                    payment={payment}
                    planName={planName}
                    billingCycle={billingCycle}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-nxborder px-6 py-3">
              <span className="text-[12px] text-nxi3">
                Mostrando {payments.length} de {total} cobranças
              </span>
              <div className="flex items-center gap-1">
                <PageBtn onClick={() => onPageChange(page - 1)} disabled={page === 1}>
                  <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
                </PageBtn>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PageBtn key={i + 1} onClick={() => onPageChange(i + 1)} active={page === i + 1}>
                    {i + 1}
                  </PageBtn>
                ))}
                <PageBtn onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
                </PageBtn>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="py-12 text-center text-[13px] text-nxi3">Nenhuma cobrança encontrada.</div>
      )}
    </div>
  )
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function PaymentRow({ payment, planName, billingCycle }: { payment: Payment; planName: string | undefined; billingCycle: 'monthly' | 'yearly' }) {
  const cfg = getStatusCfg(payment.status)
  const dateStr = payment.paid_at ? formatDateShort(payment.paid_at, { utc: true }) : formatDateShort(payment.created_at, { utc: true })
  const showCreatedAt = !!payment.paid_at && payment.created_at !== payment.paid_at

  return (
    <tr className="transition-colors hover:bg-nxbg/50">
      <td className="px-6 py-3.5 font-mono text-nxi2">{dateStr}</td>
      <td className="px-6 py-3.5">
        <div className="font-semibold text-nxi1">
          {planName ?? 'Assinatura'} · {billingCycle === 'yearly' ? 'Anual' : 'Mensal'}
        </div>
        {showCreatedAt && (
          <div className="text-[11px] text-nxi3">Criado em {formatDateShort(payment.created_at, { utc: true })}</div>
        )}
      </td>
      <td className="px-6 py-3.5 text-right font-mono font-bold text-nxi1">
        {formatPrice(Number(payment.amount))}
      </td>
      <td className="px-6 py-3.5">
        <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold', cfg.cls)}>{cfg.label}</span>
      </td>
      <td className="px-6 py-3.5 text-right">
        {payment.payment_id && <LinkButton paymentId={payment.payment_id} />}
      </td>
    </tr>
  )
}

function LinkButton({ paymentId }: { paymentId: string }) {
  const { mutate: getLink, isPending } = useGetPaymentLink()
  return (
    <button
      onClick={() => getLink(paymentId)}
      disabled={isPending}
      className="text-nxp transition hover:text-nxp/80 disabled:opacity-50"
      title="Ver fatura"
    >
      <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
    </button>
  )
}

function PageBtn({ onClick, disabled, active, children }: { onClick: () => void; disabled?: boolean; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-lg text-[12px] font-bold transition',
        active
          ? 'bg-nxp text-white'
          : 'border border-nxborder text-nxi2 hover:bg-nxbg disabled:opacity-40',
      )}
    >
      {children}
    </button>
  )
}
