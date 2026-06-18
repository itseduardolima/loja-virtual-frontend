'use client'

import { FileText, Download, Loader2 } from 'lucide-react'
import { type Order } from '@/types/order'
import { cn } from '@/lib/utils'
import { nfeMeta } from '@/lib/orderVendorMeta'

interface OrderNfeCardProps {
  order: Order
  emitting?: boolean
  onEmit?: () => void
}

/**
 * Card de NF-e do drawer de detalhe — 6 sub-estados derivados de `nfeMeta(order)`:
 * H1 Indisponível · H2 Pronta para emitir · H3 Emitindo · H4 Em processo ·
 * H5 Autorizada (número/série/chave + DANFE/XML) · H6 Denegada · H7 Cancelada.
 */
export function OrderNfeCard({ order, emitting = false, onEmit }: OrderNfeCardProps) {
  const m = nfeMeta(order)

  return (
    <div className={cn('mt-[12px] rounded-[14px] p-[14px]', m.cardClass)}>
      {/* Título + rótulo de estado */}
      <div className="flex items-center gap-[8px]">
        <FileText size={15} className={m.accentClass} />
        <span className="text-[13px] font-extrabold text-nxi1">Nota Fiscal (NF-e)</span>
        <span className={cn('ml-auto text-[11.5px] font-extrabold', m.accentClass)}>{m.state}</span>
      </div>

      {/* Descrição */}
      <div className="mt-[8px] text-[12.5px] font-semibold leading-[1.45] text-nxi2">{m.desc}</div>

      {/* Botão emitir (H2 / H3) */}
      {m.emit && (
        <button
          type="button"
          onClick={onEmit}
          disabled={emitting}
          className="mt-[12px] flex h-[38px] w-full items-center justify-center gap-[7px] rounded-[10px] bg-nxp text-[13px] font-extrabold text-white transition-colors hover:bg-nxp/90 disabled:cursor-not-allowed"
        >
          {emitting && <Loader2 size={14} className="animate-spin" />}
          {emitting ? 'Solicitando emissão…' : 'Emitir NF-e via Bling'}
        </button>
      )}

      {/* Dados + downloads (H5) */}
      {m.authorized && (
        <>
          <div className="mt-[11px] flex flex-col gap-[6px] text-[12px] font-bold text-nxi2">
            <div className="flex justify-between">
              <span className="text-nxi3">Número / Série</span>
              <span className="tabular-nums">
                {order.nfe_number} / {order.nfe_serie}
              </span>
            </div>
            <div className="flex items-center gap-[6px]">
              <span className="flex-none text-nxi3">Chave</span>
              <span className="break-all text-[11px] font-bold leading-[1.3] text-nxi2 tabular-nums">
                {order.nfe_chave}
              </span>
            </div>
          </div>
          <div className="mt-[11px] flex gap-[8px]">
            <a
              href={order.nfe_url_pdf ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[34px] flex-1 items-center justify-center gap-[6px] rounded-[9px] border border-nxborder bg-white text-[12px] font-extrabold text-nxi2 transition-colors hover:bg-nxbg"
            >
              <Download size={13} className="text-nxi3" />
              DANFE.pdf
            </a>
            <a
              href={order.nfe_url_xml ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[34px] flex-1 items-center justify-center gap-[6px] rounded-[9px] border border-nxborder bg-white text-[12px] font-extrabold text-nxi2 transition-colors hover:bg-nxbg"
            >
              <Download size={13} className="text-nxi3" />
              XML
            </a>
          </div>
        </>
      )}
    </div>
  )
}
