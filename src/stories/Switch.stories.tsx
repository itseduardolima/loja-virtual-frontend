import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
  Switch,
  ToggleRow,
  SectionCard,
  Field,
  FieldLabel,
  nxInputClass,
} from '@/app/vendedor/configuracoes/_shared'

/**
 * Demo controlado do `Switch` — mantém o estado em `useState` já que o
 * primitivo é controlado (`checked` + `onChange`). Use como base para os
 * stories que precisam de um toggle isolado.
 */
function SwitchDemo({
  defaultChecked = false,
  disabled = false,
  ariaLabel = 'Alternar opção',
}: {
  defaultChecked?: boolean
  disabled?: boolean
  ariaLabel?: string
}) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <div className="flex items-center gap-3">
      <Switch
        checked={checked}
        onChange={setChecked}
        disabled={disabled}
        ariaLabel={ariaLabel}
      />
      <span className="text-[13px] font-medium text-nxi2">
        {checked ? 'Ativado' : 'Desativado'}
      </span>
    </div>
  )
}

const meta: Meta<typeof SwitchDemo> = {
  title: 'Design System/Switch & Toggle',
  component: SwitchDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Primitivos controlados de `_shared.tsx`. O `Switch` é um botão `role="switch"` (trilho `nxp` quando ligado, `nxborder` quando desligado, foco com `ring-nxp/30`). O `ToggleRow` envolve o `Switch` numa linha de card com título, descrição, badge opcional e conteúdo revelado quando ligado. Por serem controlados, cada exemplo mantém o estado em `useState`.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SwitchDemo>

/** Estado padrão — desligado. Trilho em `bg-nxborder`. */
export const SwitchOff: Story = {
  render: () => <SwitchDemo defaultChecked={false} ariaLabel="Receber notificações" />,
}

/** Ligado — trilho em `bg-nxp` com o thumb deslizado. */
export const SwitchOn: Story = {
  render: () => <SwitchDemo defaultChecked ariaLabel="Receber notificações" />,
}

/** Desabilitado — `cursor-not-allowed` e `opacity-50`; o clique não altera o estado. */
export const SwitchDisabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <SwitchDemo disabled defaultChecked={false} ariaLabel="Opção indisponível" />
      <SwitchDemo disabled defaultChecked ariaLabel="Opção indisponível" />
    </div>
  ),
}

/**
 * `ToggleRow` controlado com título e descrição. Quando ligado, a linha ganha
 * fundo `bg-nxp/[0.04]`. Espelha o uso real em `configuracoes/pagamento`.
 */
function ToggleRowDemo() {
  const [on, setOn] = useState(true)
  return (
    <div className="w-[440px] max-w-full">
      <SectionCard flush>
        <ToggleRow
          on={on}
          onChange={setOn}
          title="PIX"
          desc="Mostra o PIX como forma de pagamento no rodapé da sua loja."
        />
      </SectionCard>
    </div>
  )
}

export const Toggle: Story = {
  render: () => <ToggleRowDemo />,
}

/**
 * `ToggleRow` com `badge` — chip índigo ao lado do título para sinalizar
 * recurso novo ou em destaque.
 */
function ToggleRowBadgeDemo() {
  const [on, setOn] = useState(false)
  return (
    <div className="w-[440px] max-w-full">
      <SectionCard flush>
        <ToggleRow
          on={on}
          onChange={setOn}
          title="Pagamento online"
          badge="Novo"
          desc="Receba pedidos já pagos com cartão e PIX direto pelo checkout."
        />
      </SectionCard>
    </div>
  )
}

export const ToggleWithBadge: Story = {
  render: () => <ToggleRowBadgeDemo />,
}

/**
 * `ToggleRow` com `children` — o conteúdo só aparece quando ligado, separado
 * por uma borda superior. Padrão de configuração condicional.
 */
function ToggleRowExpandableDemo() {
  const [on, setOn] = useState(true)
  return (
    <div className="w-[440px] max-w-full">
      <SectionCard flush>
        <ToggleRow
          on={on}
          onChange={setOn}
          title="Retirada na loja"
          desc="Permita que o cliente retire o pedido pessoalmente no endereço da loja."
        >
          <Field>
            <FieldLabel htmlFor="endereco-retirada">Endereço de retirada</FieldLabel>
            <input
              id="endereco-retirada"
              className={nxInputClass()}
              defaultValue="Rua das Flores, 120 — Centro"
            />
          </Field>
        </ToggleRow>
      </SectionCard>
    </div>
  )
}

export const ToggleExpandable: Story = {
  render: () => <ToggleRowExpandableDemo />,
}
