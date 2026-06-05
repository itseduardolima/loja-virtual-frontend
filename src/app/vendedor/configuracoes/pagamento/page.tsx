'use client'

import { usePagamento, PAYMENT_METHODS } from './usePagamento'
import { LoadingSpinner } from '@/components'
import {
  SectionCard,
  ToggleRow,
  Notice,
  FormActions,
  FieldHelp,
  NxButton,
} from '../_shared'

const METHOD_DEFS: Record<string, { title: string }> = {
  credit_card: { title: 'Cartão de crédito' },
  debit_card:  { title: 'Cartão de débito' },
  pix:         { title: 'PIX' },
  boleto:      { title: 'Boleto bancário' },
  cash:        { title: 'Dinheiro' },
  transfer:    { title: 'Transferência bancária' },
}

export default function PagamentoPage() {
  const {
    isLoading,
    isUpdating,
    isDirty,
    selectedMethods,
    errors,
    isFormValid,
    handleMethodToggle,
    handleSave,
    handleReset,
  } = usePagamento()

  if (isLoading) {
    return (
      <SectionCard>
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size="md" />
        </div>
      </SectionCard>
    )
  }

  const enabledCount = selectedMethods.length

  return (
    <div className="flex flex-col gap-4">
      <Notice variant="info">
        As formas de pagamento habilitadas aparecem no rodapé da sua loja e indicam aos clientes como podem pagar os pedidos.
      </Notice>

      {enabledCount === 0 && (
        <Notice variant="amber">
          Habilite ao menos uma forma de pagamento para que clientes consigam finalizar pedidos.
        </Notice>
      )}

      {PAYMENT_METHODS.map((method) => {
        const def = METHOD_DEFS[method.id] ?? { title: method.name }
        return (
          <SectionCard key={method.id} flush>
            <ToggleRow
              on={selectedMethods.includes(method.id)}
              onChange={() => handleMethodToggle(method.id)}
              title={def.title}
            />
          </SectionCard>
        )
      })}

      {errors.payment_methods && (
        <FieldHelp variant="error">{errors.payment_methods}</FieldHelp>
      )}

      <FormActions>
        <NxButton variant="ghost" onClick={handleReset} disabled={!isDirty || isUpdating}>
          Descartar alterações
        </NxButton>
        <NxButton
          variant="primary"
          onClick={handleSave}
          disabled={!isDirty || !isFormValid || enabledCount === 0}
          loading={isUpdating}
        >
          {isUpdating ? 'Salvando…' : 'Salvar configurações'}
        </NxButton>
      </FormActions>
    </div>
  )
}
