import type { Meta, StoryObj } from '@storybook/react'
import {
  CheckCircle2,
  Clock,
  XCircle,
  Info,
  Sparkles,
  CircleDashed,
  type LucideIcon,
} from 'lucide-react'

// ─── Status Chip (DESIGN_SPEC §5.5) ──────────────────────────────────────────
// Chip semântico do design system Nexo. Replica exatamente o padrão real usado
// no painel do vendedor (ex.: informacoes-basicas/page.tsx ~linha 175):
//   inline-flex items-center gap-1.5 rounded-full bg-{token}/[0.06] px-2.5 py-1
//   text-[10.5px] font-bold uppercase tracking-[0.04em] text-{token}
//   ring-1 ring-inset ring-{token}/15
//
// IMPORTANTE: as classes são literais por tom (não construídas dinamicamente),
// para que o Tailwind as gere no build.

type ChipTone = 'success' | 'warning' | 'danger' | 'info' | 'new' | 'inactive'

// Mapeamento tom → token semântico Nexo (classes literais completas):
//   success → nxs · warning → nxw · danger → nxd · info → nxp · new → nxa · inactive → nxi3
const toneClass: Record<ChipTone, string> = {
  success: 'bg-nxs/[0.06] text-nxs ring-nxs/15',
  warning: 'bg-nxw/[0.06] text-nxw ring-nxw/15',
  danger: 'bg-nxd/[0.06] text-nxd ring-nxd/15',
  info: 'bg-nxp/[0.06] text-nxp ring-nxp/15',
  new: 'bg-nxa/[0.06] text-nxa ring-nxa/15',
  inactive: 'bg-nxi3/[0.06] text-nxi3 ring-nxi3/15',
}

function StatusChip({
  tone,
  children,
  icon: Icon,
}: {
  tone: ChipTone
  children: React.ReactNode
  icon?: LucideIcon
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.04em] ring-1 ring-inset ${toneClass[tone]}`}
    >
      {Icon && <Icon className="h-3 w-3" strokeWidth={2.5} />}
      {children}
    </span>
  )
}

const meta: Meta<typeof StatusChip> = {
  title: 'Design System/Status Chip',
  component: StatusChip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Chip de status semântico do Nexo (DESIGN_SPEC §5.5). Substitui o `Badge` do shadcn. ' +
          'Fundo suave `bg-{token}/[0.06]`, texto e anel no mesmo token, `rounded-full`, ' +
          '`text-[10.5px] font-bold uppercase tracking-[0.04em]`. ' +
          'Mapeamento de tom → token: sucesso=`nxs`, aviso=`nxw`, perigo=`nxd`, info/destaque=`nxp`, ' +
          'novo/notificação=`nxa`, inativo/rascunho=`nxi3`.',
      },
    },
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['success', 'warning', 'danger', 'info', 'new', 'inactive'],
    },
    children: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof StatusChip>

// ─── Um story por tom ────────────────────────────────────────────────────────

export const Success: Story = {
  name: 'Sucesso (nxs)',
  args: { tone: 'success', children: 'Entregue', icon: CheckCircle2 },
}

export const Warning: Story = {
  name: 'Aviso (nxw)',
  args: { tone: 'warning', children: 'Pendente', icon: Clock },
}

export const Danger: Story = {
  name: 'Perigo (nxd)',
  args: { tone: 'danger', children: 'Cancelado', icon: XCircle },
}

export const InfoTone: Story = {
  name: 'Info (nxp)',
  args: { tone: 'info', children: 'Confirmado', icon: Info },
}

export const New: Story = {
  name: 'Novo (nxa)',
  args: { tone: 'new', children: 'Em destaque', icon: Sparkles },
}

export const Inactive: Story = {
  name: 'Inativo (nxi3)',
  args: { tone: 'inactive', children: 'Rascunho', icon: CircleDashed },
}

// ─── Showcase: status de pedido ──────────────────────────────────────────────

export const OrderStatuses: Story = {
  name: 'Status de pedido',
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <StatusChip tone="warning" icon={Clock}>
        Pendente
      </StatusChip>
      <StatusChip tone="info" icon={Info}>
        Confirmado
      </StatusChip>
      <StatusChip tone="new" icon={Sparkles}>
        Enviado
      </StatusChip>
      <StatusChip tone="success" icon={CheckCircle2}>
        Entregue
      </StatusChip>
      <StatusChip tone="danger" icon={XCircle}>
        Cancelado
      </StatusChip>
    </div>
  ),
}

// ─── Showcase: status de produto ─────────────────────────────────────────────

export const ProductStatuses: Story = {
  name: 'Status de produto',
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <StatusChip tone="success" icon={CheckCircle2}>
        Ativo
      </StatusChip>
      <StatusChip tone="inactive" icon={CircleDashed}>
        Rascunho
      </StatusChip>
      <StatusChip tone="new" icon={Sparkles}>
        Em destaque
      </StatusChip>
    </div>
  ),
}
