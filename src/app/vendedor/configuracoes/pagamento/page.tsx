'use client'

import { usePagamento, PAYMENT_METHODS } from './usePagamento'
import { LoadingSpinner } from '@/components'
import { ArrowUpRight, ShieldCheck } from 'lucide-react'
import {
  SectionCard,
  ToggleRow,
  Notice,
  FormActions,
  FieldHelp,
  NxButton,
} from '../_shared'

const BRANDS = [
  { id: 'visa', label: 'Visa', bg: '#1A1F71', fg: '#FFFFFF' },
  { id: 'mastercard', label: 'Master', bg: '#EB001B', fg: '#FFFFFF' },
  { id: 'elo', label: 'Elo', bg: '#000000', fg: '#FFCC00' },
  { id: 'amex', label: 'Amex', bg: '#0079C1', fg: '#FFFFFF' },
  { id: 'hipercard', label: 'Hiper', bg: '#C71F2D', fg: '#FFFFFF' },
]

const METHOD_DEFS: Record<
  string,
  { title: string; desc: string; badge?: string }
> = {
  credit_card: {
    title: 'Cartão de crédito',
    desc: 'Aceita as principais bandeiras. Parcelas e antifraude gerenciados pelo Asaas.',
    badge: 'Mais usado',
  },
  debit_card: {
    title: 'Cartão de débito',
    desc: 'Pagamento aprovado em segundos com débito em conta.',
  },
  pix: {
    title: 'PIX',
    desc: 'Recebimento instantâneo. Tarifa fixa por transação aprovada via Asaas.',
    badge: 'Recomendado',
  },
  boleto: {
    title: 'Boleto bancário',
    desc: 'Compensação em até 3 dias úteis. Tarifa por boleto pago.',
  },
  cash: {
    title: 'Dinheiro',
    desc: 'Disponível apenas para retirada na loja.',
  },
  transfer: {
    title: 'Transferência bancária',
    desc: 'TED ou PIX direto na sua conta — confirmação manual.',
  },
}

export default function PagamentoPage() {
  const {
    isLoading,
    isUpdating,
    selectedMethods,
    errors,
    isFormValid,
    handleMethodToggle,
    handleSave,
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
      {/* Banner do gateway Asaas (estilo Nexo) */}
      <div className="flex flex-wrap items-start gap-3 rounded-2xl border border-nxs/25 bg-nxs/[0.07] px-4 py-3.5 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-nxs/15 text-nxs">
          <ShieldCheck size={18} strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-[14px] font-bold tracking-[-0.01em] text-nxi1">
              Cobrança gerenciada pelo Asaas
            </h4>
            <span className="rounded-full bg-nxs/[0.10] px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.04em] text-nxs">
              PCI-DSS
            </span>
          </div>
          <p className="mt-0.5 text-[12.5px] leading-relaxed text-nxi2">
            Todos os pagamentos são processados com segurança pelo Asaas. Antifraude,
            parcelamento e taxas são definidos no portal Asaas.
          </p>
        </div>
        <a
          href="https://www.asaas.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-nxs/30 bg-white px-3 py-1.5 text-[12.5px] font-semibold text-nxs transition-colors hover:bg-nxs/[0.06]"
        >
          Abrir Asaas <ArrowUpRight size={12} strokeWidth={2.5} />
        </a>
      </div>

      {enabledCount === 0 && (
        <Notice variant="amber">
          Habilite ao menos uma forma de pagamento para que clientes consigam finalizar pedidos.
        </Notice>
      )}

      {/* Cartão (com pílulas de bandeira) */}
      <SectionCard flush>
        <ToggleRow
          on={selectedMethods.includes('credit_card')}
          onChange={() => handleMethodToggle('credit_card')}
          title={METHOD_DEFS.credit_card.title}
          desc={METHOD_DEFS.credit_card.desc}
          badge={METHOD_DEFS.credit_card.badge}
        >
          <div className="flex flex-wrap gap-1.5">
            {BRANDS.map((b) => (
              <span
                key={b.id}
                className="rounded-md px-2 py-1 text-[10.5px] font-bold uppercase tracking-[0.04em]"
                style={{ background: b.bg, color: b.fg }}
              >
                {b.label}
              </span>
            ))}
          </div>
        </ToggleRow>
      </SectionCard>

      {/* Outros métodos */}
      {PAYMENT_METHODS.filter((m) => m.id !== 'credit_card').map((method) => {
        const def = METHOD_DEFS[method.id] || { title: method.name, desc: method.description }
        return (
          <SectionCard key={method.id} flush>
            <ToggleRow
              on={selectedMethods.includes(method.id)}
              onChange={() => handleMethodToggle(method.id)}
              title={def.title}
              desc={def.desc}
              badge={def.badge}
            />
          </SectionCard>
        )
      })}

      {errors.payment_methods && (
        <FieldHelp variant="error">{errors.payment_methods}</FieldHelp>
      )}

      <FormActions>
        <NxButton
          variant="primary"
          onClick={handleSave}
          disabled={!isFormValid || enabledCount === 0}
          loading={isUpdating}
        >
          {isUpdating ? 'Salvando…' : 'Salvar configurações'}
        </NxButton>
      </FormActions>
    </div>
  )
}
