'use client'

import { usePagamento, PAYMENT_METHODS } from './usePagamento'
import { LoadingSpinner } from '@/components'
import { ArrowUpRight, ShieldCheck, Clock, Zap, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
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

interface MethodDef {
  title: string
  desc: string
  badge?: string
  fee: string
  releaseTime: string
  releaseIcon: LucideIcon
}

const METHOD_DEFS: Record<string, MethodDef> = {
  credit_card: {
    title: 'Cartão de crédito',
    desc: 'Aceita as principais bandeiras. Parcelas e antifraude gerenciados pelo Asaas.',
    badge: 'Mais usado',
    fee: '3,99% + R$ 0,49',
    releaseTime: 'D+30 (à vista) · D+30 cada parcela',
    releaseIcon: Clock,
  },
  debit_card: {
    title: 'Cartão de débito',
    desc: 'Pagamento aprovado em segundos com débito em conta.',
    fee: '1,99%',
    releaseTime: 'D+1',
    releaseIcon: Clock,
  },
  pix: {
    title: 'PIX',
    desc: 'Recebimento instantâneo direto na conta. Sem chargeback.',
    badge: 'Recomendado',
    fee: 'R$ 0,99 por transação',
    releaseTime: 'Em segundos',
    releaseIcon: Zap,
  },
  boleto: {
    title: 'Boleto bancário',
    desc: 'Compensação em até 3 dias úteis. Tarifa por boleto pago.',
    fee: 'R$ 3,49 por boleto pago',
    releaseTime: 'D+1 após pagamento',
    releaseIcon: Clock,
  },
  cash: {
    title: 'Dinheiro',
    desc: 'Disponível apenas para retirada na loja. Confirmação manual.',
    fee: 'Sem taxa',
    releaseTime: 'Imediato',
    releaseIcon: Zap,
  },
  transfer: {
    title: 'Transferência bancária',
    desc: 'TED ou PIX direto na sua conta — confirmação manual pelo lojista.',
    fee: 'Sem taxa',
    releaseTime: 'Manual',
    releaseIcon: Clock,
  },
}

// Pequeno chip com taxa + tempo de liberação
function MethodMetaCard({ fee, releaseTime, ReleaseIcon }: { fee: string; releaseTime: string; ReleaseIcon: LucideIcon }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="rounded-lg border border-nxborder bg-white px-3 py-2">
        <div className="text-[9.5px] font-bold uppercase tracking-[0.06em] text-nxi3">Taxa</div>
        <div className="mt-0.5 text-[12.5px] font-semibold tabular-nums text-nxi1">{fee}</div>
      </div>
      <div className="rounded-lg border border-nxborder bg-white px-3 py-2">
        <div className="flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-[0.06em] text-nxi3">
          <ReleaseIcon className="h-2.5 w-2.5" strokeWidth={2.5} />
          Liberação
        </div>
        <div className="mt-0.5 text-[12.5px] font-semibold tabular-nums text-nxi1">{releaseTime}</div>
      </div>
    </div>
  )
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
      {/* Banner do gateway Asaas — refinado */}
      <div className="overflow-hidden rounded-2xl border border-nxs/25 bg-gradient-to-br from-nxs/[0.10] via-nxs/[0.05] to-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
        <div className="flex flex-wrap items-start gap-3 px-4 py-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-nxs shadow-sm ring-1 ring-inset ring-nxs/20">
            <ShieldCheck className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-[14px] font-bold tracking-[-0.005em] text-nxi1">
                Cobrança gerenciada pelo Asaas
              </h4>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.04em] text-nxs ring-1 ring-inset ring-nxs/30">
                PCI-DSS
              </span>
            </div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-nxi2">
              Antifraude, parcelamento e taxas reais são definidos no portal Asaas. As tarifas mostradas abaixo são referências.
            </p>
          </div>
          <a
            href="https://www.asaas.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-nxs/30 bg-white px-3 py-1.5 text-[12.5px] font-semibold text-nxs transition-all hover:bg-nxs/[0.06]"
          >
            Abrir Asaas <ArrowUpRight size={12} strokeWidth={2.5} />
          </a>
        </div>
      </div>

      {enabledCount === 0 && (
        <Notice variant="amber">
          Habilite ao menos uma forma de pagamento para que clientes consigam finalizar pedidos.
        </Notice>
      )}

      {/* Cartão (com bandeiras + taxa + liberação) */}
      <SectionCard flush>
        <ToggleRow
          on={selectedMethods.includes('credit_card')}
          onChange={() => handleMethodToggle('credit_card')}
          title={METHOD_DEFS.credit_card.title}
          desc={METHOD_DEFS.credit_card.desc}
          badge={METHOD_DEFS.credit_card.badge}
        >
          <div className="space-y-3">
            <div>
              <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-nxi3">
                Bandeiras aceitas
              </div>
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
            </div>
            <MethodMetaCard
              fee={METHOD_DEFS.credit_card.fee}
              releaseTime={METHOD_DEFS.credit_card.releaseTime}
              ReleaseIcon={METHOD_DEFS.credit_card.releaseIcon}
            />
          </div>
        </ToggleRow>
      </SectionCard>

      {/* Outros métodos */}
      {PAYMENT_METHODS.filter((m) => m.id !== 'credit_card').map((method) => {
        const def = METHOD_DEFS[method.id] || {
          title: method.name,
          desc: method.description,
          fee: '—',
          releaseTime: '—',
          releaseIcon: Clock,
        }
        const ReleaseIcon = def.releaseIcon
        return (
          <SectionCard key={method.id} flush>
            <ToggleRow
              on={selectedMethods.includes(method.id)}
              onChange={() => handleMethodToggle(method.id)}
              title={def.title}
              desc={def.desc}
              badge={def.badge}
            >
              <MethodMetaCard fee={def.fee} releaseTime={def.releaseTime} ReleaseIcon={ReleaseIcon} />
            </ToggleRow>

            {/* Compact fee summary quando colapsado */}
            {!selectedMethods.includes(method.id) && (
              <div className="flex items-center gap-3 border-t border-nxborder bg-nxbg/30 px-5 py-2 text-[11px] text-nxi3">
                <span className="inline-flex items-center gap-1 font-semibold">
                  <span className="text-nxi3">Taxa:</span>
                  <span className="tabular-nums text-nxi2">{def.fee}</span>
                </span>
                <span className="text-nxborder">·</span>
                <span className="inline-flex items-center gap-1 font-semibold">
                  <ReleaseIcon className="h-2.5 w-2.5" strokeWidth={2.5} />
                  <span className="tabular-nums text-nxi2">{def.releaseTime}</span>
                </span>
              </div>
            )}
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
