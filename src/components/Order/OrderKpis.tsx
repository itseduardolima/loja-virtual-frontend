'use client'

import { ShoppingBag, Clock, Truck, XCircle, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type OrderKpis } from '@/lib/orderVendorMeta'

interface OrderKpisProps {
  kpis: OrderKpis
  loading?: boolean
}

const CARD =
  'rounded-[16px] border border-nxborder bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-[14px_15px]'
const LABEL = 'flex items-center gap-[8px] text-[12px] font-bold text-nxi3'
const VALUE = 'mt-[8px] text-[25px] font-extrabold tracking-[-.03em]'

/**
 * KPIs do topo da tela de Pedidos (B1 normal · B2 shimmer · B3 zerados).
 * 4 cards brancos (Total / Novos / Em andamento / Cancelados) + card de Receita
 * em gradiente índigo.
 */
export function OrderKpis({ kpis, loading = false }: OrderKpisProps) {
  if (loading) {
    // Proporções espelham B2 (label 12px · número 24px) com larguras variando por card.
    const bars: Array<{ label: string; value: string }> = [
      { label: 'w-[70%]', value: 'w-[45%]' },
      { label: 'w-[55%]', value: 'w-[40%]' },
      { label: 'w-[65%]', value: 'w-[40%]' },
      { label: 'w-[60%]', value: 'w-[35%]' },
      { label: 'w-[50%]', value: 'w-[70%]' },
    ]
    return (
      <div className="grid grid-cols-5 gap-[12px]">
        {bars.map((bar, i) => (
          <div
            key={i}
            className={cn(CARD, i === 4 && 'bg-gradient-to-b from-[#2F327F] to-[#2A2D7C]')}
          >
            <div className={cn('h-[12px] animate-pulse rounded-[8px] bg-nxbg', bar.label)} />
            <div
              className={cn('mt-[12px] h-[24px] animate-pulse rounded-[8px] bg-nxbg', bar.value)}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-5 gap-[12px]">
      {/* Total de pedidos */}
      <div className={CARD}>
        <div className={LABEL}>
          <ShoppingBag size={14} className="text-nxp" />
          Total de pedidos
        </div>
        <div className={cn(VALUE, kpis.total === 0 ? 'text-[#C2C4CF]' : 'text-nxi1')}>
          {kpis.total}
        </div>
      </div>

      {/* Novos */}
      <div className={CARD}>
        <div className={LABEL}>
          <Clock size={14} className="text-[#E8A33D]" />
          Novos
        </div>
        <div className={cn(VALUE, kpis.novos === 0 ? 'text-[#C2C4CF]' : 'text-nxi1')}>
          {kpis.novos}
        </div>
      </div>

      {/* Em andamento */}
      <div className={CARD}>
        <div className={LABEL}>
          <Truck size={14} className="text-nxs" />
          Em andamento
        </div>
        <div className={cn(VALUE, kpis.andamento === 0 ? 'text-[#C2C4CF]' : 'text-nxi1')}>
          {kpis.andamento}
        </div>
      </div>

      {/* Cancelados */}
      <div className={CARD}>
        <div className={LABEL}>
          <XCircle size={14} className="text-nxd" />
          Cancelados
        </div>
        <div className={cn(VALUE, kpis.cancelados === 0 ? 'text-[#C2C4CF]' : 'text-nxi1')}>
          {kpis.cancelados}
        </div>
      </div>

      {/* Receita do período */}
      <div className={cn(CARD, 'bg-gradient-to-b from-[#2F327F] to-[#2A2D7C]')}>
        <div className="flex items-center gap-[8px] text-[12px] font-bold text-[#C9CBEC]">
          <TrendingUp size={14} className="text-[#C9CBEC]" />
          Receita do período
        </div>
        <div className={cn(VALUE, 'text-white')}>{kpis.receitaFmt}</div>
      </div>
    </div>
  )
}
