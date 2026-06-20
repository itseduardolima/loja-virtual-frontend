import type { Meta, StoryObj } from '@storybook/react'
import {
  Field,
  FieldLabel,
  FieldHelp,
  nxInputClass,
} from '@/app/vendedor/configuracoes/_shared'

// ─── Demo presentacional para o meta.component ──────────────────────────────
// Reproduz o padrão real de campo de configuração: Field + FieldLabel +
// <input className={nxInputClass(error)}> + FieldHelp.
// (Espelha informacoes-basicas/page.tsx — "Nome da loja".)
type FieldDemoProps = {
  /** Texto da label */
  label?: string
  /** Marca a label como obrigatória (asterisco laranja nxa) */
  required?: boolean
  /** Aplica o estilo de erro à borda do input (border-nxd) */
  error?: boolean
  /** Placeholder do input */
  placeholder?: string
  /** Valor inicial do input */
  defaultValue?: string
  /** Desabilita o input */
  disabled?: boolean
  /** Texto de ajuda abaixo do campo */
  help?: string
  /** Variante do texto de ajuda */
  helpVariant?: 'default' | 'error' | 'ok' | 'checking'
}

function FieldDemo({
  label = 'Nome da loja',
  required = false,
  error = false,
  placeholder = 'Ex.: Casa Bonita Decoração',
  defaultValue,
  disabled = false,
  help,
  helpVariant = 'default',
}: FieldDemoProps) {
  return (
    <div className="w-[360px] max-w-full">
      <Field full>
        <FieldLabel htmlFor="store-name" required={required}>
          {label}
        </FieldLabel>
        <input
          id="store-name"
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          className={nxInputClass(error)}
        />
        {help && <FieldHelp variant={helpVariant}>{help}</FieldHelp>}
      </Field>
    </div>
  )
}

const meta: Meta<typeof FieldDemo> = {
  title: 'Design System/Input',
  component: FieldDemo,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Campo de texto do design system Nexo: `Field` + `FieldLabel` + `<input className={nxInputClass(error)}>` + `FieldHelp`. ' +
          'O input usa `nxInputClass(error?: boolean)` — `h-10 rounded-lg border px-3 text-[13px] text-nxi1`, foco com `ring-nxp/30`. ' +
          'No estado de erro a borda vira `border-nxd`. O `FieldHelp` comunica o estado abaixo do campo (erro, ok, verificando). ' +
          'Espelha os campos de `vendedor/configuracoes/informacoes-basicas`.',
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    required: { control: 'boolean' },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    help: { control: 'text' },
    helpVariant: {
      control: 'select',
      options: ['default', 'error', 'ok', 'checking'],
    },
  },
}

export default meta
type Story = StoryObj<typeof FieldDemo>

/** Campo padrão: label + input neutro com texto de ajuda. */
export const Default: Story = {
  args: {
    label: 'Nome da loja',
    placeholder: 'Ex.: Casa Bonita Decoração',
    help: '0/100 · aparece no cabeçalho da loja e nos buscadores.',
    helpVariant: 'default',
  },
}

/** Campo obrigatório: asterisco laranja (`text-nxa`) ao lado da label. */
export const Required: Story = {
  args: {
    label: 'Nome da loja',
    required: true,
    placeholder: 'Ex.: Casa Bonita Decoração',
    help: 'Campo obrigatório.',
    helpVariant: 'default',
  },
}

/** Estado de erro: borda `border-nxd` + ajuda em vermelho (`variant="error"`). */
export const WithError: Story = {
  args: {
    label: 'Nome da loja',
    required: true,
    error: true,
    defaultValue: 'A',
    placeholder: 'Ex.: Casa Bonita Decoração',
    help: 'O nome da loja precisa ter ao menos 3 caracteres.',
    helpVariant: 'error',
  },
}

/** Estado válido: ajuda em verde (`variant="ok"`) confirmando o valor. */
export const WithSuccess: Story = {
  args: {
    label: 'Slug da loja',
    defaultValue: 'casa-bonita-decoracao',
    placeholder: 'casa-bonita-decoracao',
    help: 'Endereço disponível.',
    helpVariant: 'ok',
  },
}

/** Verificando: ajuda com spinner (`variant="checking"`) durante validação assíncrona. */
export const Checking: Story = {
  args: {
    label: 'Slug da loja',
    defaultValue: 'casa-bonita-decoracao',
    placeholder: 'casa-bonita-decoracao',
    help: 'Verificando disponibilidade…',
    helpVariant: 'checking',
  },
}

/** Campo desabilitado: input não editável. */
export const Disabled: Story = {
  args: {
    label: 'Nome da loja',
    disabled: true,
    defaultValue: 'Casa Bonita Decoração',
    help: 'Esse campo não pode ser editado no momento.',
    helpVariant: 'default',
  },
}
