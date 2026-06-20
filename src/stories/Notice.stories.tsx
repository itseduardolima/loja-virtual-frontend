import type { Meta, StoryObj } from '@storybook/react'
import { Notice } from '@/app/vendedor/configuracoes/_shared'

/**
 * `Notice` é o bloco de aviso/alerta do design system Nexo.
 *
 * Três variantes, cada uma com seu token, ícone Lucide e fundo translúcido:
 * - `info` → `nxp` (indigo) com ícone `Info` — destaque informativo.
 * - `amber` → `nxw` (âmbar) com ícone `AlertTriangle` — atenção / ação irreversível.
 * - `error` → `nxd` (vermelho) com ícone `AlertCircle` — erro / impedimento.
 *
 * Uso real: `src/app/vendedor/configuracoes/pagamento/page.tsx`, onde aparece um
 * `Notice info` fixo explicando as formas de pagamento e um `Notice amber`
 * condicional quando nenhuma forma está habilitada.
 */
const meta: Meta<typeof Notice> = {
  title: 'Design System/Notice',
  component: Notice,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Avisos contextuais do Nexo. Variantes: `info` (nxp), `amber` (nxw) e `error` (nxd). Use para orientar, alertar sobre ações irreversíveis ou comunicar impedimentos.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'amber', 'error'],
      description: 'Define a cor (token), o ícone e o fundo do aviso.',
    },
    children: {
      control: 'text',
      description: 'Conteúdo do aviso (texto ou JSX).',
    },
  },
}

export default meta
type Story = StoryObj<typeof Notice>

/** Variante `info` (nxp) — orientação informativa, copiada da página de pagamento. */
export const Info: Story = {
  args: {
    variant: 'info',
    children:
      'As formas de pagamento habilitadas aparecem no rodapé da sua loja e indicam aos clientes como podem pagar os pedidos, como PIX e boleto.',
  },
}

/** Variante `amber` (nxw) — atenção sobre ação que exige cuidado ou é irreversível. */
export const Amber: Story = {
  args: {
    variant: 'amber',
    children:
      'Atenção: ao excluir esta loja, todos os produtos, pedidos e configurações serão removidos permanentemente. Esta ação não pode ser desfeita.',
  },
}

/** Variante `error` (nxd) — impedimento ou falha que bloqueia o fluxo. */
export const Error: Story = {
  args: {
    variant: 'error',
    children:
      'Não foi possível salvar as configurações. Verifique sua conexão e tente novamente em alguns instantes.',
  },
}

/** As três variantes empilhadas, como renderizam de fato na aplicação. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex max-w-2xl flex-col gap-4">
      <Notice variant="info">
        As formas de pagamento habilitadas aparecem no rodapé da sua loja e
        indicam aos clientes como podem pagar os pedidos, como PIX e boleto.
      </Notice>

      <Notice variant="amber">
        Habilite ao menos uma forma de pagamento para que os clientes consigam
        finalizar pedidos.
      </Notice>

      <Notice variant="error">
        Não foi possível salvar as configurações. Verifique sua conexão e tente
        novamente em alguns instantes.
      </Notice>
    </div>
  ),
}

/** Notice com conteúdo rico (título em negrito + descrição), mantendo o leading-relaxed. */
export const ComConteudoRico: Story = {
  render: () => (
    <div className="max-w-2xl">
      <Notice variant="info">
        <p className="m-0 font-semibold text-nxi1">Pagamentos via PIX</p>
        <p className="mt-1 text-nxi2">
          Ao habilitar o PIX, a chave configurada será exibida no checkout e o
          cliente poderá pagar instantaneamente. Boleto continua disponível para
          quem preferir.
        </p>
      </Notice>
    </div>
  ),
}
