/**
 * Fundação do redesign de Pedidos (vendedor) — fonte de verdade de rótulos, cores,
 * regras de status, KPIs e formatadores. Espelha a lógica `DCLogic` do design
 * `Pedidos.dc.html` (ver `.specs/Pedidos.design.html`).
 *
 * IMPORTANTE (rename de status — apenas vendedor): o backend mantém os códigos 1–5;
 * aqui apenas os RÓTULOS mudam (1 = "Novo", 2 = "Em preparação"). Não altera o
 * `ORDER_STATUS` global usado pelas telas do cliente.
 *
 * Cores de status são exceção documentada ao design system (paleta própria por status),
 * centralizadas aqui como strings literais de classe Tailwind (escaneáveis pelo JIT).
 */
import type { Order } from '@/types/order'
import { formatPrice } from '@/lib/utils'
import { getInitials } from '@/lib/vendor'
import { relativeTimeOrder, STATUS_FLOW } from '@/lib/orderPanelUtils'

// Reexports utilitários (fonte única de import para os componentes)
export { formatPrice, getInitials, STATUS_FLOW }
export { relativeTimeOrder as relativeTime }

// ─── Tipos ────────────────────────────────────────────────────────────────────
export type StatusCode = 1 | 2 | 3 | 4 | 5
export type OrderViewMode = 'list' | 'board'
export type OrderSortKey = 'recent' | 'old' | 'high' | 'low' | 'az' | 'za'
export type StatusFilter = 'all' | StatusCode

export interface VendorStatusMeta {
  label: string
  /** Cor do badge (texto + fundo + ring). Componente adiciona tamanho/layout. */
  badge: string
  /** Cor da bolinha (dot) do badge/segmento/coluna. */
  dot: string
}

export interface OrderKpis {
  total: number
  novos: number
  andamento: number
  cancelados: number
  receitaFmt: string
}

export interface StatusSegment {
  key: StatusFilter
  label: string
  dot?: string
}

// ─── Status (rótulos + paleta do vendedor) ──────────────────────────────────────
// Hexes exatos do design (DCLogic.statusMeta). fg→text, bg→bg, ring→ring inset, dot→bg.
export const VENDOR_STATUS_META: Record<StatusCode, VendorStatusMeta> = {
  1: {
    label: 'Novo',
    badge: 'text-[#8A6516] bg-[#FBF3E0] ring-1 ring-inset ring-[#F0DCA8]',
    dot: 'bg-[#E8A33D]',
  },
  2: {
    label: 'Em preparação',
    badge: 'text-[#1E4FA8] bg-[#E8EFFB] ring-1 ring-inset ring-[#C5D8F5]',
    dot: 'bg-[#2F6FE0]',
  },
  3: {
    label: 'Enviado',
    badge: 'text-[#5B41A8] bg-[#EFEAFB] ring-1 ring-inset ring-[#D8CCF3]',
    dot: 'bg-[#7C5CD6]',
  },
  4: {
    label: 'Entregue',
    badge: 'text-[#2E6B4E] bg-[#E7F2EC] ring-1 ring-inset ring-[#BFE0CF]',
    dot: 'bg-[#3F8A66]',
  },
  5: {
    label: 'Cancelado',
    badge: 'text-[#A82F4F] bg-[#FBE9EE] ring-1 ring-inset ring-[#F3C8D4]',
    dot: 'bg-[#D6456A]',
  },
}

const FALLBACK_META = VENDOR_STATUS_META[1]

export function getStatusMeta(status: number): VendorStatusMeta {
  return VENDOR_STATUS_META[status as StatusCode] ?? FALLBACK_META
}

/** Segmentos do filtro de status (Todos + 1–5), com bolinha de cor. */
export const STATUS_SEGMENTS: StatusSegment[] = [
  { key: 'all', label: 'Todos' },
  { key: 1, label: VENDOR_STATUS_META[1].label, dot: VENDOR_STATUS_META[1].dot },
  { key: 2, label: VENDOR_STATUS_META[2].label, dot: VENDOR_STATUS_META[2].dot },
  { key: 3, label: VENDOR_STATUS_META[3].label, dot: VENDOR_STATUS_META[3].dot },
  { key: 4, label: VENDOR_STATUS_META[4].label, dot: VENDOR_STATUS_META[4].dot },
  { key: 5, label: VENDOR_STATUS_META[5].label, dot: VENDOR_STATUS_META[5].dot },
]

// ─── Fluxo de status ────────────────────────────────────────────────────────────
const ADVANCE_LABEL: Record<number, string> = {
  1: 'Iniciar preparação',
  2: 'Marcar como enviado',
  3: 'Marcar como entregue',
}

/** Rótulo do botão de avançar (footer do drawer / ação rápida). */
export function advanceLabel(status: number): string {
  return ADVANCE_LABEL[status] ?? 'Avançar'
}

/** Próximo status no fluxo linear (1→2→3→4). Null se terminal (4) ou cancelado (5). */
export function nextStatus(status: number): number | null {
  return status < 4 && status !== 5 ? status + 1 : null
}

export function canAdvance(status: number): boolean {
  return status < 4 && status !== 5
}

export function canCancel(status: number): boolean {
  return status < 4 && status !== 5
}

// ─── Itens ────────────────────────────────────────────────────────────────────
export function itemsCount(order: Pick<Order, 'items'>): number {
  const items = order.items ?? []
  const byQty = items.reduce((sum, i) => sum + (i.quantity ?? 0), 0)
  return byQty || items.length
}

export function itemsWord(count: number): string {
  return count === 1 ? 'item' : 'itens'
}

// ─── KPIs ────────────────────────────────────────────────────────────────────
/** KPIs calculados do conjunto carregado; `total` usa o meta.total do servidor quando disponível. */
export function computeKpis(orders: Order[], total?: number): OrderKpis {
  const cnt = (s: number) => orders.filter((o) => o.status === s).length
  const receita = orders
    .filter((o) => o.status !== 5)
    .reduce((sum, o) => sum + parseFloat(o.total || '0'), 0)
  return {
    total: total ?? orders.length,
    novos: cnt(1),
    andamento: cnt(2) + cnt(3),
    cancelados: cnt(5),
    receitaFmt: formatPrice(receita),
  }
}

// ─── Datas (formatos do design) ────────────────────────────────────────────────
/** "18/06 13:20" */
export function dateShort(iso: string): string {
  const d = new Date(iso)
  return (
    d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) +
    ' ' +
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  )
}

/** "18/06/2026 às 13:20" */
export function dateFull(iso: string): string {
  const d = new Date(iso)
  return (
    d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' às ' +
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  )
}

// ─── Ordenação + filtro (client-side, espelha DCLogic.filtered) ──────────────────
export const SORT_LABELS: Record<OrderSortKey, string> = {
  recent: 'Mais recentes',
  old: 'Mais antigos',
  high: 'Maior valor',
  low: 'Menor valor',
  az: 'Cliente A–Z',
  za: 'Cliente Z–A',
}

export const SORT_OPTIONS: OrderSortKey[] = ['recent', 'old', 'high', 'low', 'az', 'za']

const time = (o: Order) => new Date(o.created_at).getTime()
const total = (o: Order) => parseFloat(o.total || '0')

const SORTERS: Record<OrderSortKey, (a: Order, b: Order) => number> = {
  recent: (a, b) => time(b) - time(a),
  old: (a, b) => time(a) - time(b),
  high: (a, b) => total(b) - total(a),
  low: (a, b) => total(a) - total(b),
  az: (a, b) => a.customer_name.localeCompare(b.customer_name, 'pt-BR'),
  za: (a, b) => b.customer_name.localeCompare(a.customer_name, 'pt-BR'),
}

export function sortOrders(orders: Order[], key: OrderSortKey): Order[] {
  return orders.slice().sort(SORTERS[key] ?? SORTERS.recent)
}

/** Filtra por status + busca (código/cliente) e ordena. */
export function applyOrderFilters(
  orders: Order[],
  opts: { statusFilter?: StatusFilter; search?: string; sort?: OrderSortKey },
): Order[] {
  const { statusFilter = 'all', search = '', sort = 'recent' } = opts
  let result = orders
  if (statusFilter !== 'all') result = result.filter((o) => o.status === statusFilter)
  const q = search.trim().toLowerCase()
  if (q) {
    result = result.filter(
      (o) => o.order_code.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q),
    )
  }
  return sortOrders(result, sort)
}

/** Colunas do Quadro: 1–4 (Cancelado fica fora do fluxo). */
export const BOARD_STATUSES: StatusCode[] = [1, 2, 3, 4]
