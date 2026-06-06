export const STATUS_CONFIG = {
  1: { label: 'Pendente',   iconName: 'Clock',        tone: 'nxw' as const, desc: 'Recebemos seu pedido e ele aguarda confirmação da loja.' },
  2: { label: 'Confirmado', iconName: 'CircleCheck',  tone: 'nxp' as const, desc: 'A loja confirmou seu pedido e está preparando tudo.' },
  3: { label: 'Enviado',    iconName: 'Truck',        tone: 'nxp' as const, desc: 'Seu pedido saiu para entrega. Logo chega até você.' },
  4: { label: 'Entregue',   iconName: 'PackageCheck', tone: 'nxs' as const, desc: 'Pedido entregue. Esperamos que você ame suas peças!' },
  5: { label: 'Cancelado',  iconName: 'CircleX',      tone: 'nxd' as const, desc: 'Este pedido foi cancelado.' },
} as const

export type StatusKey = keyof typeof STATUS_CONFIG
export type StatusTone = typeof STATUS_CONFIG[StatusKey]['tone']

export const TONE_BG: Record<StatusTone, string> = {
  nxw: 'bg-nxw',
  nxp: 'bg-nxp',
  nxs: 'bg-nxs',
  nxd: 'bg-nxd',
}

export const TONE_TEXT: Record<StatusTone, string> = {
  nxw: 'text-nxw',
  nxp: 'text-nxp',
  nxs: 'text-nxs',
  nxd: 'text-nxd',
}

export const TONE_BORDER_BG: Record<StatusTone, string> = {
  nxw: 'border-nxw/25 bg-nxw/[0.05]',
  nxp: 'border-nxp/20 bg-nxp/[0.04]',
  nxs: 'border-nxs/25 bg-nxs/[0.05]',
  nxd: 'border-nxd/25 bg-nxd/[0.04]',
}

export const TONE_BADGE_BG: Record<StatusTone, string> = {
  nxw: 'bg-nxw/[0.12] text-nxw',
  nxp: 'bg-nxp/[0.12] text-nxp',
  nxs: 'bg-nxs/[0.12] text-nxs',
  nxd: 'bg-nxd/[0.12] text-nxd',
}
