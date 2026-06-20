import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  SectionCard,
  SectionHeader,
  Field,
  FieldLabel,
  FieldHelp,
  FieldGrid,
  FormActions,
  ToggleRow,
  NxButton,
  nxInputClass,
} from '@/app/vendedor/configuracoes/_shared'

/**
 * `SectionCard` é o contêiner padrão das telas do painel (usado 69x). É um
 * `rounded-2xl border border-nxborder bg-white` com sombra sutil e padding
 * `p-5 md:p-6`. Com a prop `flush` o padding é removido e o card ganha
 * `overflow-hidden` — ideal para empilhar linhas (`ToggleRow`) com bordas próprias.
 *
 * `SectionHeader` (usado 25x) é o cabeçalho interno do card: um `title` em peso
 * forte (`text-nxi1`), uma `description` opcional (`text-nxi2`) e um slot `right`
 * para uma ação alinhada à direita.
 */
const meta: Meta<typeof SectionCard> = {
  title: 'Design System/Card (SectionCard)',
  component: SectionCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Contêiner de seção do design system Nexo. Substitui o `Card` do shadcn no painel do vendedor. Combine `SectionCard` + `SectionHeader` para títulos de seção; use a prop `flush` para empilhar `ToggleRow` sem padding interno.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SectionCard>

/** Card básico com `SectionHeader` (título + descrição). */
export const Default: Story = {
  render: () => (
    <div className="max-w-2xl">
      <SectionCard>
        <SectionHeader
          title="Identidade textual"
          description="Como sua loja é encontrada e apresentada nos buscadores."
        />
        <p className="text-[13px] leading-relaxed text-nxi2">
          O conteúdo da seção vai aqui — campos de formulário, listas ou qualquer
          composição. O card mantém padding, borda e sombra consistentes em toda
          a tela.
        </p>
      </SectionCard>
    </div>
  ),
}

/** `SectionHeader` com o slot `right` segurando um `NxButton` de ação. */
export const WithHeaderAction: Story = {
  render: () => (
    <div className="max-w-2xl">
      <SectionCard>
        <SectionHeader
          title="Formas de pagamento"
          description="Métodos exibidos no rodapé da sua loja."
          right={<NxButton variant="ghost">Adicionar método</NxButton>}
        />
        <p className="text-[13px] leading-relaxed text-nxi2">
          A ação principal da seção fica ancorada no canto superior direito do
          cabeçalho, alinhada ao topo do título.
        </p>
      </SectionCard>
    </div>
  ),
}

// ToggleRow é controlado: encapsulamos o estado em um componente próprio.
function FlushToggleList() {
  const methods = [
    { id: 'pix', title: 'PIX', desc: 'Pagamento instantâneo via chave PIX.' },
    { id: 'credit_card', title: 'Cartão de crédito', desc: 'Bandeiras Visa, Master e Elo.' },
    { id: 'boleto', title: 'Boleto bancário', desc: 'Compensação em até 2 dias úteis.' },
  ]
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    pix: true,
    credit_card: false,
    boleto: false,
  })

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      {methods.map((method) => (
        <SectionCard key={method.id} flush>
          <ToggleRow
            on={!!enabled[method.id]}
            onChange={(next) => setEnabled((prev) => ({ ...prev, [method.id]: next }))}
            title={method.title}
            desc={method.desc}
          />
        </SectionCard>
      ))}
    </div>
  )
}

/**
 * Prop `flush`: remove o padding interno e ativa `overflow-hidden`, deixando o
 * `ToggleRow` controlar seu próprio espaçamento — mesmo padrão da página de
 * pagamento.
 */
export const Flush: Story = {
  render: () => <FlushToggleList />,
}

// Card de configuração realista, com formulário controlado.
function ComposedConfigCard() {
  const [name, setName] = useState('Casa Bonita Decoração')
  const [description, setDescription] = useState(
    'Peças únicas para decorar com afeto. Curadoria autoral, entrega em todo o Brasil.',
  )
  const nameError = name.trim().length === 0

  return (
    <div className="max-w-2xl">
      <SectionCard>
        <SectionHeader
          title="Identidade textual"
          description="Como sua loja é encontrada e apresentada nos buscadores."
        />

        <div className="space-y-5">
          <FieldGrid columns={1}>
            <Field full>
              <FieldLabel htmlFor="store-name" required>
                Nome da loja
              </FieldLabel>
              <input
                id="store-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: Casa Bonita Decoração"
                className={nxInputClass(nameError)}
              />
              {nameError ? (
                <FieldHelp variant="error">Informe o nome da loja.</FieldHelp>
              ) : (
                <FieldHelp>
                  {name.length}/100 · aparece no cabeçalho da loja e nos buscadores.
                </FieldHelp>
              )}
            </Field>

            <Field full>
              <FieldLabel htmlFor="store-description">Descrição curta</FieldLabel>
              <textarea
                id="store-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={170}
                placeholder="Apresente sua loja em uma frase."
                className="min-h-[90px] rounded-lg border border-nxborder bg-white px-3 py-2 text-[13px] text-nxi1 placeholder:text-nxi3 focus-visible:border-nxp focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nxp/30"
              />
              <FieldHelp>
                {description.length}/170 · usada como descrição padrão para SEO e
                redes sociais.
              </FieldHelp>
            </Field>
          </FieldGrid>
        </div>

        <FormActions>
          <NxButton variant="ghost">Descartar alterações</NxButton>
          <NxButton variant="primary" disabled={nameError}>
            Salvar alterações
          </NxButton>
        </FormActions>
      </SectionCard>
    </div>
  )
}

/** Exemplo realista: card de configuração completo, espelhando `informacoes-basicas`. */
export const Composed: Story = {
  render: () => <ComposedConfigCard />,
}
