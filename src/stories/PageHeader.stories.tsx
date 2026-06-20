import type { Meta, StoryObj } from '@storybook/react'
import { Plus } from 'lucide-react'
import { NxButton } from '@/app/vendedor/configuracoes/_shared'

/**
 * Cabeçalho de página de listagem — padrão consolidado em `DESIGN_SPEC §7`
 * ("Página de listagem") e usado de fato em `vendedor/produtos` e `vendedor/cupons`.
 *
 * É uma linha `flex items-center justify-between` com dois blocos:
 *
 * - **Esquerda:** `h1` em peso de display (`text-[26px] font-extrabold tracking-[-0.03em]
 *   text-nxi1`) seguido de uma `p` de apoio (`text-[13px] text-nxi2`) com a contagem /
 *   resumo da lista.
 * - **Direita:** a ação principal da tela como `NxButton` primário (`+ Novo produto`,
 *   `+ Novo cupom`). A `action` é opcional — telas só de leitura ficam sem botão.
 *
 * Espelha o `ListPageHeader` real (`@/components/VendorList`); aqui ele é reconstruído
 * de forma autossuficiente, sem dependências de runtime.
 */
function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">
          {title}
        </h1>
        <p className="mt-0.5 text-[13px] text-nxi2">{description}</p>
      </div>
      {action}
    </div>
  )
}

const meta: Meta<typeof PageHeader> = {
  title: 'Patterns/Page Header',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Cabeçalho de página de listagem do painel do vendedor (DESIGN_SPEC §7). Título de display + subtítulo de resumo à esquerda, ação principal (`NxButton`) à direita.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof PageHeader>

/**
 * Listagem de produtos — espelha `vendedor/produtos/page.tsx`. Subtítulo com a
 * contagem da lista e a ação `+ Novo produto` (NxButton primário com ícone `Plus`).
 */
export const Products: Story = {
  render: () => (
    <div className="max-w-4xl">
      <PageHeader
        title="Produtos"
        description="12 produtos · 9 ativos na sua vitrine."
        action={
          <NxButton variant="primary">
            <Plus size={15} strokeWidth={2.5} />
            Novo produto
          </NxButton>
        }
      />
    </div>
  ),
}

/**
 * Listagem de cupons — espelha `vendedor/cupons/page.tsx`. Mesmo padrão, com a
 * ação `+ Novo cupom`.
 */
export const Coupons: Story = {
  render: () => (
    <div className="max-w-4xl">
      <PageHeader
        title="Cupons"
        description="5 cupons · 3 ativos na sua loja."
        action={
          <NxButton variant="primary">
            <Plus size={15} strokeWidth={2.5} />
            Novo cupom
          </NxButton>
        }
      />
    </div>
  ),
}

/**
 * Sem ação à direita: telas de listagem somente leitura mantêm o bloco de título
 * e subtítulo, omitindo o `NxButton`.
 */
export const NoAction: Story = {
  render: () => (
    <div className="max-w-4xl">
      <PageHeader
        title="Pedidos"
        description="28 pedidos · 4 aguardando confirmação."
      />
    </div>
  ),
}
