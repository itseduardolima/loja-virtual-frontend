import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Field,
  FieldLabel,
  FieldHelp,
  Notice,
  NxButton,
  nxInputClass,
} from '@/app/vendedor/configuracoes/_shared'

/**
 * O `Dialog` (shadcn / Radix) segue sendo a primitiva de modal, mas todo o
 * CONTEÚDO usa o design system Nexo: `NxButton` nas ações, tokens de ink
 * (`text-nxi1` / `text-nxi2` / `text-nxi3`) nos textos, `Field` + `nxInputClass`
 * nos campos e `Notice` para avisos.
 */
const meta: Meta<typeof Dialog> = {
  title: 'UI/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Dialog do design system Nexo. A primitiva de modal continua sendo a do shadcn (`@/components/ui/dialog`), mas o conteúdo é todo Nexo: `NxButton` nas ações, tokens de ink nos textos, `Field` + `nxInputClass` nos campos e `Notice` nos avisos.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Dialog>

// ─── Default ───────────────────────────────────────────────────────────────
export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <NxButton>Abrir dialog</NxButton>
      </DialogTrigger>
      <DialogContent className="max-w-[480px] rounded-2xl border-nxborder">
        <DialogHeader>
          <DialogTitle className="text-base font-bold tracking-[-0.01em] text-nxi1">
            Título do dialog
          </DialogTitle>
          <DialogDescription className="text-[13px] text-nxi2">
            Descrição do que este dialog faz ou qual ação está sendo confirmada.
          </DialogDescription>
        </DialogHeader>

        <p className="text-[13px] font-medium leading-relaxed text-nxi2">
          Conteúdo principal do dialog. Use este espaço para detalhar a ação
          antes de o vendedor confirmar.
        </p>

        <DialogFooter className="gap-2">
          <NxButton variant="ghost">Cancelar</NxButton>
          <NxButton variant="primary">Confirmar</NxButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

// ─── WithForm ──────────────────────────────────────────────────────────────
// Formulário de cupom controlado: Field + FieldLabel + nxInputClass + NxButton.
function CupomDialog() {
  const [code, setCode] = useState('')
  const [discount, setDiscount] = useState('')
  const [saving, setSaving] = useState(false)
  const [touched, setTouched] = useState(false)

  const codeError = touched && code.trim().length === 0

  function save() {
    setTouched(true)
    if (code.trim().length === 0) return
    setSaving(true)
    setTimeout(() => setSaving(false), 800)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <NxButton>Adicionar cupom</NxButton>
      </DialogTrigger>
      <DialogContent className="max-w-[480px] rounded-2xl border-nxborder">
        <DialogHeader>
          <DialogTitle className="text-base font-bold tracking-[-0.01em] text-nxi1">
            Criar cupom
          </DialogTitle>
          <DialogDescription className="text-[13px] text-nxi2">
            Preencha os dados do novo cupom de desconto da sua loja.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="cupom-code" required>
              Código
            </FieldLabel>
            <input
              id="cupom-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="DESCONTO10"
              className={nxInputClass(codeError)}
            />
            {codeError ? (
              <FieldHelp variant="error">Informe um código para o cupom.</FieldHelp>
            ) : (
              <FieldHelp>Letras e números, sem espaços. Ex.: BEMVINDO.</FieldHelp>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="cupom-discount" required>
              Desconto (%)
            </FieldLabel>
            <input
              id="cupom-discount"
              type="number"
              min={1}
              max={100}
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="10"
              className={nxInputClass(false)}
            />
            <FieldHelp>Percentual aplicado sobre o subtotal do pedido.</FieldHelp>
          </Field>
        </div>

        <DialogFooter className="gap-2">
          <NxButton variant="ghost" disabled={saving}>
            Cancelar
          </NxButton>
          <NxButton variant="primary" onClick={save} loading={saving}>
            {saving ? 'Salvando…' : 'Salvar cupom'}
          </NxButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const WithForm: Story = {
  render: () => <CupomDialog />,
}

// ─── DestructiveConfirm ────────────────────────────────────────────────────
function DestructiveDialog() {
  const [deleting, setDeleting] = useState(false)

  function confirm() {
    setDeleting(true)
    setTimeout(() => setDeleting(false), 800)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <NxButton variant="danger">Excluir produto</NxButton>
      </DialogTrigger>
      <DialogContent className="max-w-[480px] rounded-2xl border-nxborder">
        <DialogHeader>
          <DialogTitle className="text-base font-bold tracking-[-0.01em] text-nxi1">
            Confirmar exclusão
          </DialogTitle>
          <DialogDescription className="text-[13px] text-nxi2">
            O produto será removido permanentemente do catálogo da loja.
          </DialogDescription>
        </DialogHeader>

        <Notice variant="error">
          Esta ação não pode ser desfeita. Pedidos já realizados com este produto
          não são afetados, mas ele deixará de aparecer na loja.
        </Notice>

        <DialogFooter className="gap-2">
          <NxButton variant="ghost" disabled={deleting}>
            Cancelar
          </NxButton>
          <NxButton variant="danger" onClick={confirm} loading={deleting}>
            {deleting ? 'Excluindo…' : 'Excluir permanentemente'}
          </NxButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export const DestructiveConfirm: Story = {
  render: () => <DestructiveDialog />,
}
