import type { Meta, StoryObj } from '@storybook/react'
import { Plus, Trash2, Save } from 'lucide-react'
import { NxButton, FormActions } from '@/app/vendedor/configuracoes/_shared'

/**
 * `NxButton` é o botão de ação oficial do design system Nexo, usado em todo o
 * painel do vendedor (formulários de configuração, listagens, modais).
 *
 * - **Sempre** usar `NxButton` para ações de formulário — nunca o `Button` do shadcn/ui.
 * - Variantes: `primary` (índigo `nxp`, ação principal), `ghost` (secundária / cancelar)
 *   e `danger` (`nxd`, ações destrutivas).
 * - Estado `loading` exibe `Loader2 animate-spin` e desabilita o clique automaticamente —
 *   não desabilite manualmente durante o carregamento.
 * - Tamanho fixo: `px-3.5 py-2 rounded-lg text-[13px] font-semibold`.
 */
const meta: Meta<typeof NxButton> = {
  title: 'Design System/Button (NxButton)',
  component: NxButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'ghost', 'danger'],
      description: 'primary = nxp · ghost = secundária · danger = nxd',
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    variant: 'primary',
    children: 'Salvar alterações',
  },
}

export default meta
type Story = StoryObj<typeof NxButton>

/** Ação principal da tela (salvar, criar, confirmar). Índigo `nxp`. */
export const Primary: Story = {
  args: { variant: 'primary', children: 'Salvar alterações' },
}

/** Ação secundária ou cancelar. Borda neutra, fundo branco. */
export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Descartar alterações' },
}

/** Ação destrutiva (excluir, revogar). Vermelho `nxd`. */
export const Danger: Story = {
  args: { variant: 'danger', children: 'Excluir loja' },
}

/**
 * Estado de carregamento: spinner `Loader2 animate-spin` + texto. O botão é
 * desabilitado automaticamente enquanto `loading` for `true`.
 */
export const Loading: Story = {
  args: { variant: 'primary', loading: true, children: 'Salvando…' },
}

/** Botão desabilitado — cursor bloqueado e opacidade reduzida. */
export const Disabled: Story = {
  args: { variant: 'primary', disabled: true, children: 'Salvar alterações' },
}

/** Ícone Lucide (size 14–15 conforme spec §8) + texto, com o `gap-1.5` nativo do botão. */
export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <NxButton variant="primary">
        <Plus size={15} strokeWidth={2.5} />
        Novo produto
      </NxButton>
      <NxButton variant="ghost">
        <Save size={15} strokeWidth={2.5} />
        Salvar rascunho
      </NxButton>
      <NxButton variant="danger">
        <Trash2 size={15} strokeWidth={2.5} />
        Excluir
      </NxButton>
    </div>
  ),
}

/** As três variantes lado a lado, como renderizam de fato no painel. */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <NxButton variant="primary">Salvar alterações</NxButton>
      <NxButton variant="ghost">Descartar alterações</NxButton>
      <NxButton variant="danger">Excluir</NxButton>
    </div>
  ),
}

/**
 * Uso real no rodapé de um formulário de configuração (`FormActions` + `NxButton`),
 * espelhando `configuracoes/pagamento/page.tsx`: ghost para descartar à esquerda,
 * primary para salvar à direita.
 */
export const InFormActions: Story = {
  render: () => (
    <div className="w-full max-w-xl rounded-2xl border border-nxborder bg-white p-5 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)] md:p-6">
      <p className="text-[13px] font-medium text-nxi2">
        As formas de pagamento habilitadas aparecem no rodapé da sua loja.
      </p>
      <FormActions>
        <NxButton variant="ghost">Descartar alterações</NxButton>
        <NxButton variant="primary">Salvar configurações</NxButton>
      </FormActions>
    </div>
  ),
}
