export type GreetingPeriod = 'morning' | 'afternoon' | 'evening'

export function getGreeting(name: string): {
  text: string
  period: GreetingPeriod
} {
  const h = new Date().getHours()
  const period: GreetingPeriod = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'
  const partLabel =
    period === 'morning' ? 'Bom dia' : period === 'afternoon' ? 'Boa tarde' : 'Boa noite'
  return { text: `${partLabel}, ${name?.split(' ')[0] ?? ''}`, period }
}

import { formatBRL } from './utils'
export { formatBRL }

export function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function daysRemaining(endDate: string | null | undefined): number {
  if (!endDate) return 0
  const diff = new Date(endDate).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / 86_400_000))
}

export function planProgress(
  startDate: string | null | undefined,
  endDate: string | null | undefined,
): number {
  if (!startDate || !endDate) return 0
  const total = new Date(endDate).getTime() - new Date(startDate).getTime()
  const elapsed = Date.now() - new Date(startDate).getTime()
  if (total <= 0) return 100
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)))
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'agora'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}min atrás`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h atrás`
  return `${Math.floor(hours / 24)}d atrás`
}

export function formatTodayLabel(date = new Date()): string {
  return date
    .toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .toUpperCase()
    .replace('.', '')
    .replace(',', ' ·')
}

const VENDEDOR_BREADCRUMB_MAP: Record<string, string> = {
  '/vendedor': 'Início',
  '/vendedor/dashboard': 'Dashboard',
  '/vendedor/produtos': 'Produtos',
  '/vendedor/pedidos': 'Pedidos',
  '/vendedor/cupons': 'Cupons',
  '/vendedor/categorias': 'Categorias',
  '/vendedor/vitrine': 'Vitrine',
  '/vendedor/perguntas': 'Perguntas',
  '/vendedor/plano': 'Plano',
  '/vendedor/configuracoes/informacoes-basicas': 'Informações Básicas',
  '/vendedor/configuracoes/endereco': 'Endereço',
  '/vendedor/configuracoes/contatos': 'Contatos',
  '/vendedor/configuracoes/documentos': 'Documentos',
  '/vendedor/configuracoes/entrega': 'Entrega',
  '/vendedor/configuracoes/horario': 'Horário',
  '/vendedor/configuracoes/pagamento': 'Formas de Pagamento',
  '/vendedor/configuracoes/integracao-bling': 'Integração Bling',
}

const ADMIN_BREADCRUMB_MAP: Record<string, { parent: string; current: string }> = {
  '/admin': { parent: 'Admin', current: 'Dashboard' },
  '/admin/usuarios': { parent: 'Admin', current: 'Usuários' },
  '/admin/lojas': { parent: 'Admin', current: 'Lojas' },
  '/admin/assinaturas': { parent: 'Admin', current: 'Assinaturas' },
  '/admin/estornos': { parent: 'Admin', current: 'Estornos' },
  '/admin/planos': { parent: 'Admin', current: 'Planos' },
  '/admin/planos/criar': { parent: 'Planos', current: 'Novo Plano' },
  '/admin/cupons-plano': { parent: 'Admin', current: 'Cupons de Plano' },
  '/admin/cupons-plano/criar': { parent: 'Cupons de Plano', current: 'Novo Cupom' },
}

export function getBreadcrumb(path: string): { parent: string; current: string } {
  if (path.startsWith('/admin')) {
    const exact = ADMIN_BREADCRUMB_MAP[path]
    if (exact) return exact
    if (path.startsWith('/admin/usuarios/')) return { parent: 'Usuários', current: 'Detalhes' }
    if (path.startsWith('/admin/planos/editar/')) return { parent: 'Planos', current: 'Editar Plano' }
    if (path.startsWith('/admin/cupons-plano/editar/')) return { parent: 'Cupons de Plano', current: 'Editar Cupom' }
    return { parent: 'Admin', current: 'Dashboard' }
  }

  const exact = VENDEDOR_BREADCRUMB_MAP[path]
  if (exact) return { parent: 'Vendedor', current: exact }
  if (path.startsWith('/vendedor/produtos/criar')) return { parent: 'Produtos', current: 'Criar' }
  if (path.startsWith('/vendedor/produtos/editar')) return { parent: 'Produtos', current: 'Editar' }
  if (path.startsWith('/vendedor/configuracoes'))
    return { parent: 'Configurações', current: 'Configurações' }
  return { parent: 'Vendedor', current: 'Início' }
}

const AVATAR_HUES = [
  '#2A2D7C',
  '#E8632A',
  '#3F8A66',
  '#7C5CFF',
  '#C13A2E',
  '#1A6F8E',
  '#B17A1A',
] as const

export function avatarHueFor(name: string): string {
  if (!name) return AVATAR_HUES[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  return AVATAR_HUES[hash % AVATAR_HUES.length]
}

export type StatusTone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral'

const STATUS_TONE_BY_ID: Record<number, StatusTone> = {
  1: 'warning',
  2: 'primary',
  3: 'primary',
  4: 'success',
  5: 'success',
  6: 'danger',
}

export function getStatusTone(statusId: number): StatusTone {
  return STATUS_TONE_BY_ID[statusId] ?? 'neutral'
}

export type KpiMetricKind = 'currency' | 'count' | 'percentPoints'

export interface FormatKpiDeltaOptions {
  kind: KpiMetricKind
  noun?: string
}

export interface DeltaSource {
  delta: number
  dir: 'up' | 'down' | 'flat'
}

export interface KpiDeltaProps {
  delta?: string
  deltaDir: 'up' | 'down'
}

/**
 * Constrói as props (delta + deltaDir) que o KpiCard espera, a partir de uma
 * métrica de comparação. Quando dir = 'flat' o delta é omitido (não renderizado).
 */
export function kpiDeltaProps(
  metric: DeltaSource | undefined | null,
  kind: KpiMetricKind,
  noun?: string,
): KpiDeltaProps {
  if (!metric || metric.dir === 'flat') {
    return { delta: undefined, deltaDir: 'up' }
  }
  return {
    delta: formatKpiDelta(metric.delta, { kind, noun }),
    deltaDir: metric.dir === 'down' ? 'down' : 'up',
  }
}

/**
 * Formata um delta de KPI em texto humanizado (sem sinal — a direção up/down
 * vem da prop separada e é representada pela seta + cor).
 *
 * - currency: "R$ 1.847,20"
 * - count: "12 pedidos" (usa noun no plural quando aplicável)
 * - percentPoints: "0,3 ponto"
 */
export function formatKpiDelta(value: number, options: FormatKpiDeltaOptions): string {
  const abs = Math.abs(value)
  switch (options.kind) {
    case 'currency':
      return formatBRL(abs)
    case 'count': {
      const noun = options.noun ?? 'item'
      const plural = Math.round(abs) === 1 ? noun : `${noun}s`
      return `${Math.round(abs)} ${plural}`
    }
    case 'percentPoints': {
      const formatted = abs.toFixed(1).replace('.', ',')
      const isOne = Number(formatted.replace(',', '.')) === 1
      return `${formatted} ${isOne ? 'ponto' : 'pontos'}`
    }
  }
}

export function getPreviousRange(from: string, to: string): { from: string; to: string } {
  const start = new Date(`${from}T00:00:00Z`)
  const end = new Date(`${to}T00:00:00Z`)
  const sizeDays = Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000))
  const prevEnd = new Date(start.getTime() - 86_400_000)
  const prevStart = new Date(prevEnd.getTime() - sizeDays * 86_400_000)
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  return { from: fmt(prevStart), to: fmt(prevEnd) }
}

export interface StoreChannel {
  label: string
  color: string
}

export function getStoreChannels(
  store:
    | {
        whatsapp?: string | null
        instagram?: string | null
        facebook?: string | null
        email?: string | null
      }
    | null
    | undefined,
): StoreChannel[] {
  if (!store) return []
  return [
    store.whatsapp ? { label: 'WhatsApp', color: '#22c55e' } : null,
    store.instagram ? { label: 'Instagram', color: '#ec4899' } : null,
    store.facebook ? { label: 'Facebook', color: '#3b82f6' } : null,
    store.email ? { label: 'E-mail', color: '#8b5cf6' } : null,
  ].filter(Boolean) as StoreChannel[]
}

// ─── Status maps centralizados ────────────────────────────────────────────────

export interface StatusEntry {
  label: string
  tone: StatusTone
}

/**
 * Status de pagamento — unificado de PaymentHistory.tsx (STATUS_MAP).
 * tone mapeado para StatusTone (neutral = sem destaque especial).
 */
export const PAYMENT_STATUS: Record<string, StatusEntry> = {
  paid:             { label: 'Pago',                tone: 'success' },
  pending:          { label: 'Pendente',             tone: 'warning' },
  failed:           { label: 'Falhou',               tone: 'danger'  },
  refunded:         { label: 'Reembolsado',          tone: 'neutral' },
  refund_requested: { label: 'Reembolso em análise', tone: 'warning' },
}

/**
 * Status de assinatura — unificado de useAssinaturasPage.ts (statusMap).
 */
export const SUBSCRIPTION_STATUS: Record<string, StatusEntry> = {
  active:   { label: 'Ativa',     tone: 'success' },
  pending:  { label: 'Pendente',  tone: 'warning' },
  expired:  { label: 'Expirada',  tone: 'neutral' },
  canceled: { label: 'Cancelada', tone: 'danger'  },
}

/**
 * Status de cupom — unificado de admin/cupons-plano/page.tsx (STATUS_CONFIG)
 * e vendedor/cupons/page.tsx (STATUS).
 * Nota: o cupom de vendedor usa 'exhausted' (Esgotado) e 'paused' (Pausado),
 * enquanto o admin usa 'inactive' (Inativo). Ambos estão incluídos aqui.
 */
export const COUPON_STATUS: Record<string, StatusEntry> = {
  active:    { label: 'Ativo',    tone: 'success' },
  paused:    { label: 'Pausado',  tone: 'warning' },
  inactive:  { label: 'Inativo',  tone: 'neutral' },
  expired:   { label: 'Expirado', tone: 'neutral' },
  exhausted: { label: 'Esgotado', tone: 'danger'  },
}
