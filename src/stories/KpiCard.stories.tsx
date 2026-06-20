import type { Meta, StoryObj } from '@storybook/react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Coins,
  type LucideIcon,
  Package,
  ShoppingCart,
  Wallet,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// Padrão de KPI card do dashboard do vendedor.
// Espelha src/components/Vendor/Home/KpiCard.tsx — card branco arredondado,
// label suave, valor grande em tinta forte, ícone tonal e chip de variação.
// Self-contained: sem fetch, sem hooks de dados, apenas mock inline.
// ─────────────────────────────────────────────────────────────────────────────

type KpiTone = 'primary' | 'accent' | 'warning' | 'success'

const ICON_BG: Record<KpiTone, string> = {
  primary: 'bg-nxp/10 text-nxp',
  accent: 'bg-nxa/10 text-nxa',
  warning: 'bg-nxw/[0.12] text-nxw',
  success: 'bg-nxs/10 text-nxs',
}

interface KpiCardProps {
  /** Rótulo do indicador (ex.: "Pedidos") */
  label: string
  /** Valor formatado já pronto para exibição (ex.: "R$ 4.280,00") */
  value: string
  /** Variação no período (ex.: "12,5%"). Omitir oculta o chip. */
  delta?: string
  /** Direção da variação: up = positivo (nxs), down = negativo (nxd) */
  deltaDir?: 'up' | 'down'
  /** Texto auxiliar ao lado da variação */
  deltaLabel?: string
  /** Ícone Lucide exibido no canto superior direito */
  icon: LucideIcon
  /** Tom do ícone */
  tone: KpiTone
}

function KpiCard({
  label,
  value,
  delta,
  deltaDir = 'up',
  deltaLabel = 'vs ontem',
  icon: Icon,
  tone,
}: KpiCardProps) {
  const positive = deltaDir === 'up'
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl border border-nxborder bg-white px-4 pt-4 pb-3.5 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_hsl(0_0%_0%/0.08)]">
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] font-semibold tracking-[0.01em] text-nxi3">
          {label}
        </span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${ICON_BG[tone]}`}
        >
          <Icon size={14} strokeWidth={2} />
        </span>
      </div>

      <div className="text-[22px] font-extrabold leading-[1.1] tracking-[-0.03em] text-nxi1">
        {value}
      </div>

      {delta && (
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.04em] ring-1 ring-inset ${
              positive
                ? 'bg-nxs/[0.06] text-nxs ring-nxs/15'
                : 'bg-nxd/[0.06] text-nxd ring-nxd/15'
            }`}
          >
            {positive ? (
              <ArrowUpRight size={12} strokeWidth={2.5} />
            ) : (
              <ArrowDownRight size={12} strokeWidth={2.5} />
            )}
            {delta}
          </span>
          <span className="text-[11.5px] font-medium text-nxi3">{deltaLabel}</span>
        </div>
      )}
    </div>
  )
}

const meta: Meta<typeof KpiCard> = {
  title: 'Patterns/KPI Cards',
  component: KpiCard,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'nxbg' },
  },
}

export default meta

type Story = StoryObj<typeof KpiCard>

// ─── Card único ──────────────────────────────────────────────────────────────
export const Single: Story = {
  args: {
    label: 'Pedidos',
    value: '128',
    delta: '12,5%',
    deltaDir: 'up',
    deltaLabel: 'vs ontem',
    icon: ShoppingCart,
    tone: 'accent',
  },
  render: (args) => (
    <div className="max-w-[240px]">
      <KpiCard {...args} />
    </div>
  ),
}

// ─── Variação positiva (nxs) ─────────────────────────────────────────────────
export const PositiveDelta: Story = {
  args: {
    label: 'Receita',
    value: 'R$ 4.280,00',
    delta: '8,3%',
    deltaDir: 'up',
    deltaLabel: 'vs período anterior',
    icon: Coins,
    tone: 'primary',
  },
  render: (args) => (
    <div className="max-w-[240px]">
      <KpiCard {...args} />
    </div>
  ),
}

// ─── Variação negativa (nxd) ─────────────────────────────────────────────────
export const NegativeDelta: Story = {
  args: {
    label: 'Ticket médio',
    value: 'R$ 33,44',
    delta: '4,1%',
    deltaDir: 'down',
    deltaLabel: 'vs período anterior',
    icon: Wallet,
    tone: 'warning',
  },
  render: (args) => (
    <div className="max-w-[240px]">
      <KpiCard {...args} />
    </div>
  ),
}

// ─── Grade de 4 KPIs (layout real do dashboard) ──────────────────────────────
const GRID_KPIS: KpiCardProps[] = [
  {
    label: 'Pedidos',
    value: '128',
    delta: '12,5%',
    deltaDir: 'up',
    deltaLabel: 'vs período anterior',
    icon: ShoppingCart,
    tone: 'accent',
  },
  {
    label: 'Receita',
    value: 'R$ 4.280,00',
    delta: '8,3%',
    deltaDir: 'up',
    deltaLabel: 'vs período anterior',
    icon: Coins,
    tone: 'primary',
  },
  {
    label: 'Ticket médio',
    value: 'R$ 33,44',
    delta: '4,1%',
    deltaDir: 'down',
    deltaLabel: 'vs período anterior',
    icon: Wallet,
    tone: 'warning',
  },
  {
    label: 'Pendentes',
    value: '7',
    delta: '2,0%',
    deltaDir: 'down',
    deltaLabel: 'vs período anterior',
    icon: Package,
    tone: 'success',
  },
]

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {GRID_KPIS.map((kpi) => (
        <KpiCard key={kpi.label} {...kpi} />
      ))}
    </div>
  ),
}
