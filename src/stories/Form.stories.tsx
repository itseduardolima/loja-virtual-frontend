import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  SectionCard,
  SectionHeader,
  FieldGrid,
  Field,
  FieldLabel,
  FieldHelp,
  FormActions,
  NxButton,
  nxInputClass,
} from '@/app/vendedor/configuracoes/_shared'

/**
 * Composição completa de formulário Nexo: `SectionCard` + `SectionHeader`
 * + `FieldGrid` + `Field` + `FieldLabel` + input com `nxInputClass()`
 * + `FieldHelp` + `FormActions` + `NxButton`.
 *
 * Espelha a estrutura real de
 * `src/app/vendedor/configuracoes/informacoes-basicas/page.tsx`.
 */
function FormShowcase({ children }: { children: React.ReactNode }) {
  return <div className="max-w-2xl">{children}</div>
}

const meta: Meta<typeof FormShowcase> = {
  title: 'Design System/Form',
  component: FormShowcase,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Padrão de formulário do painel do vendedor montado com os primitivos reais de `_shared.tsx`. Use sempre `nxInputClass(error)` no input nativo, `FieldHelp variant="error"` para validação e `NxButton` (nunca o Button do shadcn) na barra de ações.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof FormShowcase>

// ─── Two-column form ─────────────────────────────────────────────────────────
function TwoColumnFormDemo() {
  const [form, setForm] = useState({
    name: 'Casa Bonita Decoração',
    email: 'contato@casabonita.com.br',
    phone: '(11) 98888-7777',
    whatsapp: '(11) 98888-7777',
    instagram: '@casabonita',
    address: 'Rua das Flores, 120 — Vila Madalena, São Paulo/SP',
  })

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  return (
    <FormShowcase>
      <SectionCard>
        <SectionHeader
          title="Dados de contato"
          description="Como os clientes entram em contato e encontram sua loja."
        />

        <FieldGrid columns={2}>
          <Field>
            <FieldLabel htmlFor="tc-name" required>
              Nome da loja
            </FieldLabel>
            <input
              id="tc-name"
              value={form.name}
              onChange={set('name')}
              placeholder="Ex.: Casa Bonita Decoração"
              className={nxInputClass()}
            />
            <FieldHelp>Aparece no cabeçalho da loja e nos buscadores.</FieldHelp>
          </Field>

          <Field>
            <FieldLabel htmlFor="tc-email" required>
              E-mail
            </FieldLabel>
            <input
              id="tc-email"
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="contato@sualoja.com.br"
              className={nxInputClass()}
            />
            <FieldHelp>Usado para notificações de pedidos.</FieldHelp>
          </Field>

          <Field>
            <FieldLabel htmlFor="tc-phone">Telefone</FieldLabel>
            <input
              id="tc-phone"
              value={form.phone}
              onChange={set('phone')}
              placeholder="(00) 00000-0000"
              className={nxInputClass()}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="tc-whatsapp">WhatsApp</FieldLabel>
            <input
              id="tc-whatsapp"
              value={form.whatsapp}
              onChange={set('whatsapp')}
              placeholder="(00) 00000-0000"
              className={nxInputClass()}
            />
            <FieldHelp>Habilita o botão de pedido por WhatsApp na vitrine.</FieldHelp>
          </Field>

          <Field>
            <FieldLabel htmlFor="tc-instagram">Instagram</FieldLabel>
            <input
              id="tc-instagram"
              value={form.instagram}
              onChange={set('instagram')}
              placeholder="@sualoja"
              className={nxInputClass()}
            />
          </Field>

          <Field full>
            <FieldLabel htmlFor="tc-address">Endereço completo</FieldLabel>
            <input
              id="tc-address"
              value={form.address}
              onChange={set('address')}
              placeholder="Rua, número, bairro, cidade/UF"
              className={nxInputClass()}
            />
            <FieldHelp>
              Exibido na página de contato quando a retirada na loja está ativa.
            </FieldHelp>
          </Field>
        </FieldGrid>

        <FormActions>
          <NxButton variant="ghost">Descartar alterações</NxButton>
          <NxButton variant="primary">Salvar alterações</NxButton>
        </FormActions>
      </SectionCard>
    </FormShowcase>
  )
}

/**
 * Formulário em duas colunas (`FieldGrid columns={2}`) com um campo de
 * largura total (`Field full`) e a barra de ações com Cancelar (ghost)
 * + Salvar (primary).
 */
export const TwoColumnForm: Story = {
  render: () => <TwoColumnFormDemo />,
}

// ─── Validation errors ───────────────────────────────────────────────────────
function WithValidationErrorsDemo() {
  const [form, setForm] = useState({
    name: '',
    email: 'email-invalido',
    slug: 'minha loja!',
  })

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const errors = {
    name: form.name.trim() ? '' : 'Informe o nome da loja.',
    email: /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) ? '' : 'Informe um e-mail válido.',
    slug: /^[a-z0-9-]+$/.test(form.slug)
      ? ''
      : 'Use apenas letras minúsculas, números e hífens.',
  }

  return (
    <FormShowcase>
      <SectionCard>
        <SectionHeader
          title="Identidade da loja"
          description="Campos obrigatórios destacam a borda em vermelho quando inválidos."
        />

        <FieldGrid columns={2}>
          <Field>
            <FieldLabel htmlFor="ve-name" required>
              Nome da loja
            </FieldLabel>
            <input
              id="ve-name"
              value={form.name}
              onChange={set('name')}
              placeholder="Ex.: Casa Bonita Decoração"
              className={nxInputClass(!!errors.name)}
            />
            {errors.name ? (
              <FieldHelp variant="error">{errors.name}</FieldHelp>
            ) : (
              <FieldHelp>Aparece no cabeçalho da loja.</FieldHelp>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="ve-email" required>
              E-mail
            </FieldLabel>
            <input
              id="ve-email"
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="contato@sualoja.com.br"
              className={nxInputClass(!!errors.email)}
            />
            {errors.email ? (
              <FieldHelp variant="error">{errors.email}</FieldHelp>
            ) : (
              <FieldHelp variant="ok">E-mail válido.</FieldHelp>
            )}
          </Field>

          <Field full>
            <FieldLabel htmlFor="ve-slug" required>
              Endereço público (slug)
            </FieldLabel>
            <input
              id="ve-slug"
              value={form.slug}
              onChange={set('slug')}
              placeholder="minha-loja"
              className={nxInputClass(!!errors.slug)}
            />
            {errors.slug ? (
              <FieldHelp variant="error">{errors.slug}</FieldHelp>
            ) : (
              <FieldHelp>nexo.com/{form.slug || 'minha-loja'}</FieldHelp>
            )}
          </Field>
        </FieldGrid>

        <FormActions>
          <NxButton variant="ghost">Descartar alterações</NxButton>
          <NxButton variant="primary" disabled>
            Salvar alterações
          </NxButton>
        </FormActions>
      </SectionCard>
    </FormShowcase>
  )
}

/**
 * Estado de validação: campos inválidos usam `nxInputClass(true)` (borda
 * `nxd`) com `FieldHelp variant="error"`. O botão Salvar fica desabilitado
 * enquanto houver erros.
 */
export const WithValidationErrors: Story = {
  render: () => <WithValidationErrorsDemo />,
}

// ─── Saving state ────────────────────────────────────────────────────────────
function SavingDemo() {
  return (
    <FormShowcase>
      <SectionCard>
        <SectionHeader
          title="Dados de contato"
          description="Durante o envio, o NxButton entra em estado de loading."
        />

        <FieldGrid columns={2}>
          <Field>
            <FieldLabel htmlFor="sv-name" required>
              Nome da loja
            </FieldLabel>
            <input
              id="sv-name"
              defaultValue="Casa Bonita Decoração"
              className={nxInputClass()}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="sv-email" required>
              E-mail
            </FieldLabel>
            <input
              id="sv-email"
              type="email"
              defaultValue="contato@casabonita.com.br"
              className={nxInputClass()}
            />
          </Field>

          <Field full>
            <FieldLabel htmlFor="sv-address">Endereço completo</FieldLabel>
            <input
              id="sv-address"
              defaultValue="Rua das Flores, 120 — Vila Madalena, São Paulo/SP"
              className={nxInputClass()}
            />
          </Field>
        </FieldGrid>

        <FormActions>
          <NxButton variant="ghost" disabled>
            Descartar alterações
          </NxButton>
          <NxButton variant="primary" loading>
            Salvando…
          </NxButton>
        </FormActions>
      </SectionCard>
    </FormShowcase>
  )
}

/**
 * Estado de salvamento: `NxButton loading` mostra o spinner `Loader2`
 * e bloqueia o clique; o botão de cancelar fica desabilitado.
 */
export const Saving: Story = {
  render: () => <SavingDemo />,
}
