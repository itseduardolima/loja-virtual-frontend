'use client'

import {
  ArrowLeft,
  Tag,
  Plug,
  MessageSquare,
  BarChart3,
  Download,
  TrendingDown,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn, formatBRL } from '@/lib/utils'
import { useEditarPlanoPage } from './useEditarPlanoPage'
import {
  SectionCard,
  SectionHeader,
  Field,
  FieldLabel,
  FieldHelp,
  FieldGrid,
  NxButton,
  nxInputClass,
} from '../../../_shared'

// ─── feature rows ─────────────────────────────────────────────────────────────

const FEATURE_OPTIONS = [
  {
    key: 'feature_coupons' as const,
    icon: Tag,
    title: 'Cupons de desconto',
    desc: 'Criação de cupons fixos ou percentuais',
  },
  {
    key: 'feature_bling_integration' as const,
    icon: Plug,
    title: 'Integração Bling ERP',
    desc: 'Emissão automática de NF-e',
  },
  {
    key: 'feature_product_questions' as const,
    icon: MessageSquare,
    title: 'Perguntas e respostas',
    desc: 'Clientes perguntam direto no produto',
  },
  {
    key: 'feature_advanced_dashboard' as const,
    icon: BarChart3,
    title: 'Dashboard avançado',
    desc: 'Relatórios de venda e conversão',
  },
  {
    key: 'feature_order_export' as const,
    icon: Download,
    title: 'Exportar pedidos',
    desc: 'Download em Excel/CSV',
  },
]

function FeatureRow({
  icon: Icon,
  title,
  desc,
  on,
  onChange,
  hasBorderTop = true,
}: {
  icon: React.ElementType
  title: string
  desc: string
  on: boolean
  onChange: (v: boolean) => void
  hasBorderTop?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-[13px] px-[16px] py-[14px] transition-colors',
        hasBorderTop && 'border-t border-[#F0F1F5]',
        on ? 'bg-[#FAFAFE]' : 'bg-white',
      )}
    >
      <span
        className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px]"
        style={{ background: on ? 'rgba(42,45,124,0.10)' : '#F6F7FA' }}
      >
        <Icon size={17} color={on ? '#2A2D7C' : '#8A8CA3'} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-extrabold text-nxi1">{title}</div>
        <div className="text-[12px] font-semibold text-nxi3">{desc}</div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!on)}
        className="flex h-[23px] w-[40px] flex-none items-center rounded-full p-[2px] transition-colors"
        style={{
          background: on ? '#3F8A66' : '#D7D9E3',
          justifyContent: on ? 'flex-end' : 'flex-start',
        }}
      >
        <span className="h-[19px] w-[19px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
      </button>
    </div>
  )
}

function SavingsBadge({ amount }: { amount: number }) {
  return (
    <span
      className="inline-flex items-center gap-[4px] rounded-full px-[8px] py-[1px] text-[10.5px] font-extrabold"
      style={{
        color: '#2E6B4E',
        background: 'rgba(63,138,102,0.08)',
        boxShadow: 'inset 0 0 0 1px rgba(63,138,102,0.18)',
      }}
    >
      <TrendingDown size={11} />
      Economia de {formatBRL(amount)}/ano
    </span>
  )
}

function PageSkeleton() {
  function Sk({ className, style }: { className?: string; style?: React.CSSProperties }) {
    return <div className={cn('animate-pulse rounded-lg bg-[#ECEDF2]', className)} style={style} />
  }
  return (
    <div className="flex flex-col gap-5">
      <Sk className="h-[13px] w-[60px]" />
      <div>
        <Sk className="h-[26px] w-[200px]" />
        <Sk className="mt-2 h-3 w-[300px]" />
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          {[120, 100, 200].map((h, i) => (
            <div key={i} className="rounded-2xl border border-nxborder bg-white p-5 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
              <Sk className="mb-5 h-[15px] w-[120px]" />
              <Sk style={{ height: h }} />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-nxborder bg-white p-5 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
            <Sk className="mb-5 h-[15px] w-[100px]" />
            <div className="flex flex-col gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i}><Sk className="mb-2 h-3 w-[80px]" /><Sk className="h-10 rounded-[10px]" /></div>
              ))}
            </div>
          </div>
          <Sk className="h-[42px] rounded-[10px]" />
          <Sk className="h-[42px] rounded-[10px]" />
        </div>
      </div>
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function AdminEditarPlanoPage() {
  const { plan, register, handleSubmit, setValue, watch, errors, isSubmitting, onSubmit, router } =
    useEditarPlanoPage()

  if (!plan) return <PageSkeleton />

  const priceMonthly = Number(watch('price_monthly')) || 0
  const priceYearly = watch('price_yearly')
  const savingsPerYear =
    priceYearly && priceMonthly > 0
      ? Math.max(0, priceMonthly * 12 - Number(priceYearly))
      : 0

  return (
    <div className="flex flex-col gap-5">
      {/* Back */}
      <button
        type="button"
        onClick={() => router.back()}
        className="flex w-fit items-center gap-[6px] text-[13px] font-semibold text-nxi3 hover:text-nxi2 transition-colors"
      >
        <ArrowLeft size={15} />
        Voltar
      </button>

      {/* Header */}
      <div>
        <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">
          Editar Plano — {plan.name}
        </h1>
        <p className="mt-0.5 text-[13px] font-semibold text-nxi2">
          Ajuste as informações, o preço e os recursos liberados por este plano.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* ── Coluna principal ── */}
          <div className="flex flex-col gap-5 lg:col-span-2">

            {/* Identificação */}
            <SectionCard>
              <SectionHeader title="Identificação" />
              <FieldGrid columns={1}>
                <Field>
                  <FieldLabel htmlFor="name" required>Nome do plano</FieldLabel>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Ex: Plano Premium"
                    className={nxInputClass(!!errors.name)}
                  />
                  {errors.name && <FieldHelp variant="error">{errors.name.message}</FieldHelp>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">Descrição</FieldLabel>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Ex: Inclui acesso a todos os recursos avançados da plataforma"
                    rows={3}
                    className="resize-none rounded-[10px] border border-nxborder bg-white px-3 py-2.5 text-[13px] font-semibold text-nxi1 placeholder:text-nxi3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(42,45,124,0.15)]"
                  />
                </Field>
              </FieldGrid>
            </SectionCard>

            {/* Cobrança */}
            <SectionCard>
              <SectionHeader title="Cobrança" />
              <FieldGrid columns={2}>
                <Field>
                  <FieldLabel htmlFor="price_monthly" required>Preço Mensal (R$)</FieldLabel>
                  <Input
                    id="price_monthly"
                    {...register('price_monthly')}
                    type="number"
                    step="0.01"
                    placeholder="29.90"
                    className={nxInputClass(!!errors.price_monthly)}
                  />
                  {errors.price_monthly && (
                    <FieldHelp variant="error">{errors.price_monthly.message}</FieldHelp>
                  )}
                </Field>
                <Field>
                  <FieldLabel htmlFor="price_yearly">
                    Preço Anual (R$)
                    {savingsPerYear > 0 && <SavingsBadge amount={savingsPerYear} />}
                  </FieldLabel>
                  <Input
                    id="price_yearly"
                    {...register('price_yearly')}
                    type="number"
                    step="0.01"
                    placeholder="299.00"
                    className={nxInputClass()}
                  />
                  <FieldHelp>Sugestão: ~17% de desconto (2 meses grátis)</FieldHelp>
                </Field>
              </FieldGrid>
            </SectionCard>

            {/* Funcionalidades */}
            <SectionCard>
              <div>
                <h3 className="text-[15px] font-extrabold tracking-[-0.01em] text-nxi1">
                  Funcionalidades inclusas
                </h3>
                <p className="mt-0.5 text-[12.5px] font-semibold text-nxi3">
                  Selecione quais recursos premium este plano libera
                </p>
              </div>
              <div className="mt-[14px] overflow-hidden rounded-xl border border-nxborder">
                {FEATURE_OPTIONS.map((opt, i) => (
                  <FeatureRow
                    key={opt.key}
                    icon={opt.icon}
                    title={opt.title}
                    desc={opt.desc}
                    on={!!watch(opt.key)}
                    onChange={(v) => setValue(opt.key, v, { shouldDirty: true })}
                    hasBorderTop={i > 0}
                  />
                ))}
              </div>
            </SectionCard>
          </div>

          {/* ── Sidebar ── */}
          <div className="flex flex-col gap-5">
            <SectionCard>
              <SectionHeader title="Configurações" />
              <FieldGrid columns={1}>
                <Field>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <Select
                    defaultValue={String(plan.status)}
                    onValueChange={(v) => setValue('status', Number(v))}
                  >
                    <SelectTrigger id="status" className={nxInputClass()}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Ativo</SelectItem>
                      <SelectItem value="0">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="max_products">Máximo de Produtos</FieldLabel>
                  <Input
                    id="max_products"
                    {...register('max_products')}
                    type="number"
                    placeholder="Vazio = ilimitado"
                    className={nxInputClass()}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="trial_days">Dias de Trial</FieldLabel>
                  <Input
                    id="trial_days"
                    {...register('trial_days')}
                    type="number"
                    min={0}
                    placeholder="Vazio = sem trial"
                    className={nxInputClass()}
                  />
                  <FieldHelp>Acesso gratuito sem cartão por N dias</FieldHelp>
                </Field>
                <Field>
                  <FieldLabel htmlFor="sort_order">Ordem de Exibição</FieldLabel>
                  <Input
                    id="sort_order"
                    {...register('sort_order')}
                    type="number"
                    className={nxInputClass()}
                  />
                </Field>
              </FieldGrid>
            </SectionCard>

            <div className="flex flex-col gap-2">
              <NxButton
                type="submit"
                variant="primary"
                loading={isSubmitting}
                className="h-[42px] w-full justify-center text-[13.5px]"
              >
                {isSubmitting ? 'Salvando…' : 'Salvar Alterações'}
              </NxButton>
              <NxButton
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="h-[42px] w-full justify-center text-[13.5px]"
              >
                Cancelar
              </NxButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
