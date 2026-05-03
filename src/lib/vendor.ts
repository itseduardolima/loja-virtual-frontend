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

export function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

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

const BREADCRUMB_MAP: Record<string, string> = {
  '/vendedor': 'Início',
  '/vendedor/dashboard': 'Dashboard',
  '/vendedor/produtos': 'Produtos',
  '/vendedor/pedidos': 'Pedidos',
  '/vendedor/cupons': 'Cupons',
  '/vendedor/categorias': 'Categorias',
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

export function getBreadcrumb(path: string): { parent: string; current: string } {
  const exact = BREADCRUMB_MAP[path]
  if (exact) return { parent: 'Vendedor', current: exact }
  if (path.startsWith('/vendedor/produtos/criar')) return { parent: 'Produtos', current: 'Criar' }
  if (path.startsWith('/vendedor/produtos/editar')) return { parent: 'Produtos', current: 'Editar' }
  if (path.startsWith('/vendedor/produtos/')) return { parent: 'Produtos', current: 'Detalhes' }
  if (path.startsWith('/vendedor/configuracoes'))
    return { parent: 'Configurações', current: 'Configurações' }
  return { parent: 'Vendedor', current: 'Início' }
}

export interface StoreChannel {
  label: string
  color: string
}

export function getStoreChannels(store: {
  whatsapp?: string | null
  instagram?: string | null
  facebook?: string | null
  email?: string | null
} | null | undefined): StoreChannel[] {
  if (!store) return []
  return [
    store.whatsapp ? { label: 'WhatsApp', color: '#22c55e' } : null,
    store.instagram ? { label: 'Instagram', color: '#ec4899' } : null,
    store.facebook ? { label: 'Facebook', color: '#3b82f6' } : null,
    store.email ? { label: 'E-mail', color: '#8b5cf6' } : null,
  ].filter(Boolean) as StoreChannel[]
}
