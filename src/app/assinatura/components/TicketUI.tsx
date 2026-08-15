import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Peças visuais do "comprovante" — o motivo recorrente do fluxo de assinatura
 * (Processing/Success/Completed), inspirado no recibo/boleto físico do
 * pagamento real (Pix, cartão, boleto via Asaas) em vez do badge-de-check
 * genérico. Cartão com bordas de papel + selo carimbado + linha de corte
 * picotada entre seções.
 */

export function TicketCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-nxborder bg-nxsurf p-6 text-center',
        'shadow-[0_1px_0_rgba(15,23,42,.02),0_10px_24px_-16px_rgba(30,34,66,.25)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Linha de corte picotada com "furos" nas bordas do cartão, como um talão. */
export function TicketDivider({ className }: { className?: string }) {
  return (
    <div className={cn('relative -mx-6 my-5', className)}>
      <span className="absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      <span className="absolute right-0 top-1/2 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      <div className="border-t border-dashed border-nxborder" />
    </div>
  )
}

export type StampTone = 'pending' | 'confirmed' | 'brand' | 'accent'

const STAMP_TONE_CLASSES: Record<StampTone, string> = {
  pending: 'border-nxw text-nxw nx-stamp-pending',
  confirmed: 'border-nxs text-nxs',
  brand: 'border-nxp text-nxp',
  accent: 'border-nxa text-nxa',
}

/** Selo carimbado — o indicador de estado (substitui o ícone-em-círculo padrão). */
export function TicketStamp({ label, tone }: { label: string; tone: StampTone }) {
  return (
    <span
      className={cn(
        'inline-flex -rotate-2 items-center gap-1.5 rounded-md border-2 border-dashed px-3 py-1.5',
        'font-mono text-[11.5px] font-bold uppercase tracking-[0.16em]',
        STAMP_TONE_CLASSES[tone],
      )}
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      {label}
    </span>
  )
}

export function TicketEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-nxi3">{children}</p>
  )
}
