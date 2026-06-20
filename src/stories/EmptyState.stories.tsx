import type { Meta, StoryObj } from '@storybook/react'
import type { LucideIcon } from 'lucide-react'
import { BadgePercent, PackageSearch, Plus, ShoppingBag } from 'lucide-react'
import { SectionCard, NxButton } from '@/app/vendedor/configuracoes/_shared'

/**
 * Padrão de **Estado Vazio** (DESIGN_SPEC §7).
 *
 * Toda listagem sem dados deve renderizar um estado vazio com quatro partes,
 * sempre centralizadas dentro do card:
 * 1. Ícone ilustrativo Lucide (40–48px, `text-nxi3`).
 * 2. Título curto (`text-[15px] font-bold text-nxi1`).
 * 3. Descrição (`text-[13px] text-nxi2`).
 * 4. CTA opcional (`NxButton`) — só quando há uma ação que faz o usuário sair do vazio.
 *
 * Espelha o `TableEmptyState` usado em `vendedor/produtos`, `vendedor/cupons` e
 * `vendedor/perguntas`. Quando a lista está vazia por causa de filtros, omita o CTA
 * (o usuário deve ajustar o filtro, não criar algo novo).
 */
type EmptyStateProps = {
  /** Ícone ilustrativo (Lucide). Renderizado em 44px, `text-nxi3`. */
  icon: LucideIcon
  /** Título curto do estado vazio. */
  title: string
  /** Descrição que orienta o próximo passo. */
  description: string
  /** CTA opcional — normalmente um `NxButton` que tira o usuário do vazio. */
  action?: React.ReactNode
}

/**
 * Bloco de estado vazio centralizado, seguindo DESIGN_SPEC §7.
 * Apresentacional e sem dependências de runtime.
 */
function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <Icon size={44} strokeWidth={1.75} className="text-nxi3" />
      <h3 className="mt-4 text-[15px] font-bold text-nxi1">{title}</h3>
      <p className="mt-1 max-w-xs text-[13px] leading-[1.5] text-nxi2">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

const meta: Meta<typeof EmptyState> = {
  title: 'Patterns/Empty State',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Estado vazio do painel do vendedor (DESIGN_SPEC §7): ícone Lucide 40–48px `text-nxi3`, título `text-[15px] font-bold text-nxi1`, descrição `text-[13px] text-nxi2` e `NxButton` opcional. Sempre centralizado dentro de um `SectionCard`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-2xl">
        <SectionCard flush>
          <Story />
        </SectionCard>
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof EmptyState>

/**
 * Listagem de produtos sem nenhum item cadastrado — espelha `vendedor/produtos`.
 * Inclui o CTA primário `+ Novo produto` (`NxButton`), pois o vendedor precisa
 * cadastrar o primeiro produto para começar a vender.
 */
export const NoProducts: Story = {
  args: {
    icon: PackageSearch,
    title: 'Nenhum produto cadastrado',
    description: 'Cadastre um novo produto para começar a vender.',
    action: (
      <NxButton>
        <Plus size={15} />
        Novo produto
      </NxButton>
    ),
  },
}

/**
 * Listagem de pedidos vazia — sem CTA. O vendedor não cria pedidos manualmente:
 * eles chegam pela loja, então não há ação que tire o usuário do vazio.
 */
export const NoOrders: Story = {
  args: {
    icon: ShoppingBag,
    title: 'Nenhum pedido ainda',
    description:
      'Quando um cliente finalizar uma compra na sua loja, o pedido aparecerá aqui.',
  },
}

/**
 * Listagem de cupons sem nenhum cupom — espelha `vendedor/cupons`.
 * CTA `Criar primeiro cupom` (`NxButton`) para a primeira criação.
 */
export const NoCoupons: Story = {
  args: {
    icon: BadgePercent,
    title: 'Você ainda não criou cupons',
    description:
      'Crie cupons de desconto para campanhas, fidelizar clientes ou impulsionar vendas.',
    action: (
      <NxButton>
        <Plus size={15} />
        Criar primeiro cupom
      </NxButton>
    ),
  },
}
