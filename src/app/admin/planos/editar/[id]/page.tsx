'use client'

import { CreditCard, Settings, Tag, ChevronLeft, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEditarPlanoPage } from './useEditarPlanoPage'
import {
  SectionCard, SectionHeader,
  Field, FieldLabel, FieldHelp, FieldGrid, ToggleRow,
  NxButton, nxInputClass,
} from '../../../_shared'
import LoadingPage from '@/components/Layout/LoadingPage'

const FEATURE_OPTIONS = [
  { key: 'feature_coupons'            as const, title: 'Cupons de desconto',    desc: 'Criar cupons percentuais ou fixos com expiração e limite de uso' },
  { key: 'feature_bling_integration'  as const, title: 'Integração Bling ERP',  desc: 'Sincronizar pedidos automaticamente com o Bling' },
  { key: 'feature_product_questions'  as const, title: 'Perguntas e respostas', desc: 'Receber e responder perguntas dos clientes nos produtos' },
  { key: 'feature_advanced_dashboard' as const, title: 'Dashboard avançado',    desc: 'Gráfico de receita, top produtos, top categorias e estoque baixo' },
  { key: 'feature_order_export'       as const, title: 'Exportar pedidos',      desc: 'Exportar pedidos em planilha Excel' },
]

export default function AdminEditarPlanoPage() {
  const { plan, register, handleSubmit, setValue, watch, errors, isSubmitting, onSubmit, router } = useEditarPlanoPage()

  if (!plan) return (
    <div className="flex items-center justify-center py-16">
      <LoadingPage />
    </div>
  )

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex w-fit items-center gap-1.5 text-[13px] font-medium text-nxi2 hover:text-nxi1"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar
      </button>
      <div>
        <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">Editar Plano</h1>
        <p className="mt-0.5 text-[13px] text-nxi2">
          Atualize as informações do plano <span className="font-semibold text-nxi1">{plan.name}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          <div className="flex flex-col gap-5 lg:col-span-2">

            <SectionCard>
              <SectionHeader title="Identificação" />
              <FieldGrid columns={1}>
                <Field>
                  <FieldLabel htmlFor="name" required>Nome</FieldLabel>
                  <Input id="name" {...register('name')} placeholder="Ex: Plano Premium" className={nxInputClass(!!errors.name)} />
                  {errors.name && <FieldHelp variant="error">{errors.name.message}</FieldHelp>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="description">Descrição</FieldLabel>
                  <Textarea id="description" {...register('description')} placeholder="Descreva o que está incluído neste plano…" rows={3} className="resize-none rounded-lg border border-nxborder bg-white px-3 py-2 text-[13px] text-nxi1 placeholder:text-nxi3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nxp/30" />
                </Field>
              </FieldGrid>
            </SectionCard>

            <SectionCard>
              <SectionHeader title="Cobrança" />
              <FieldGrid columns={2}>
                <Field>
                  <FieldLabel htmlFor="price_monthly" required>Preço Mensal (R$)</FieldLabel>
                  <Input id="price_monthly" {...register('price_monthly')} type="number" step="0.01" placeholder="29.90" className={nxInputClass(!!errors.price_monthly)} />
                  {errors.price_monthly && <FieldHelp variant="error">{errors.price_monthly.message}</FieldHelp>}
                </Field>
                <Field>
                  <FieldLabel htmlFor="price_yearly">Preço Anual (R$)</FieldLabel>
                  <Input id="price_yearly" {...register('price_yearly')} type="number" step="0.01" placeholder="Vazio = não oferece anual" className={nxInputClass()} />
                  <FieldHelp>Sugestão: ~17% de desconto (2 meses grátis)</FieldHelp>
                </Field>
              </FieldGrid>
            </SectionCard>

            <SectionCard flush>
              <div className="p-5">
                <SectionHeader title="Funcionalidades inclusas" description="Selecione quais recursos premium este plano libera" />
              </div>
              {FEATURE_OPTIONS.map((opt) => (
                <ToggleRow
                  key={opt.key}
                  on={!!watch(opt.key)}
                  onChange={(checked) => setValue(opt.key, checked, { shouldDirty: true })}
                  title={opt.title}
                  desc={opt.desc}
                />
              ))}
            </SectionCard>
          </div>

          <div className="flex flex-col gap-5">
            <SectionCard>
              <SectionHeader title="Configurações" />
              <FieldGrid columns={1}>
                <Field>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <Select defaultValue={String(plan.status)} onValueChange={(v) => setValue('status', Number(v))}>
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
                  <Input id="max_products" {...register('max_products')} type="number" placeholder="Vazio = ilimitado" className={nxInputClass()} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="trial_days">Dias de Trial</FieldLabel>
                  <Input id="trial_days" {...register('trial_days')} type="number" min={0} placeholder="Vazio = sem trial" className={nxInputClass()} />
                  <FieldHelp>Acesso gratuito sem cartão por N dias</FieldHelp>
                </Field>
                <Field>
                  <FieldLabel htmlFor="sort_order">Ordem de Exibição</FieldLabel>
                  <Input id="sort_order" {...register('sort_order')} type="number" className={nxInputClass()} />
                </Field>
              </FieldGrid>
            </SectionCard>

            <div className="flex flex-col gap-2">
              <NxButton type="submit" variant="primary" loading={isSubmitting} className="w-full justify-center">
                {isSubmitting ? 'Salvando…' : 'Salvar Alterações'}
              </NxButton>
              <NxButton type="button" variant="ghost" onClick={() => router.back()} className="w-full justify-center">
                Cancelar
              </NxButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
