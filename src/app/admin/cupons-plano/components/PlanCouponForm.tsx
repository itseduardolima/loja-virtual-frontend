'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CalendarClock, Hash, Percent, Settings, Tag, Ticket, Users } from 'lucide-react'
import { cn, formatBRL } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { createPlanCouponSchema } from '@/schemas/planCouponSchemas'
import { useAdminPlans } from '@/hooks/useAdminPlans'
import type { AdminPlanCoupon } from '@/types/admin'
import {
  SectionCard, SectionHeader,
  Field, FieldLabel, FieldHelp, FieldGrid,
  NxButton, nxInputClass,
} from '../../_shared'

export interface PlanCouponFormValues {
  code: string
  description?: string
  discount_type: 'percent' | 'fixed'
  discount_value: number
  applies_to_cycle: 'monthly' | 'yearly' | 'both'
  duration_type: 'forever' | 'once' | 'months'
  duration_months?: number | null
  plan_ids?: number[]
  max_uses?: number | null
  expires_at?: string | null
  status: number
}

interface PlanCouponFormProps {
  initial?: AdminPlanCoupon | null
  isSubmitting: boolean
  submitLabel: string
  onSubmit: (values: PlanCouponFormValues) => void
  onCancel: () => void
}

const DEFAULTS: PlanCouponFormValues = {
  code: '', description: '',
  discount_type: 'percent', discount_value: 10,
  applies_to_cycle: 'both', duration_type: 'forever',
  duration_months: null, plan_ids: [], max_uses: null, expires_at: null, status: 1,
}

const textareaClass = 'resize-none rounded-lg border border-nxborder bg-white px-3 py-2 text-[13px] text-nxi1 placeholder:text-nxi3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nxp/30 w-full'

export function PlanCouponForm({ initial, isSubmitting, submitLabel, onSubmit, onCancel }: PlanCouponFormProps) {
  const { data: plansData } = useAdminPlans({ page: 1, limit: 100 })

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<PlanCouponFormValues>({
    resolver: yupResolver(createPlanCouponSchema) as any,
    defaultValues: DEFAULTS,
  })

  useEffect(() => {
    if (initial) {
      reset({
        code: initial.code,
        description: initial.description ?? '',
        discount_type: initial.discount_type,
        discount_value: Number(initial.discount_value),
        applies_to_cycle: initial.applies_to_cycle,
        duration_type: initial.duration_type,
        duration_months: initial.duration_months ?? null,
        plan_ids: initial.plans.map((p) => p.plan_id),
        max_uses: initial.max_uses ?? null,
        expires_at: initial.expires_at ? initial.expires_at.slice(0, 10) : null,
        status: initial.status,
      })
    }
  }, [initial, reset])

  const discountType = watch('discount_type')
  const durationType = watch('duration_type')
  const planIds = watch('plan_ids') ?? []
  const togglePlan = (id: number) =>
    setValue('plan_ids', planIds.includes(id) ? planIds.filter((p) => p !== id) : [...planIds, id], { shouldDirty: true })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* Coluna principal */}
        <div className="flex flex-col gap-5 lg:col-span-2">

          <SectionCard>
            <SectionHeader title="Identificação" />
            <FieldGrid columns={2}>
              <Field>
                <FieldLabel htmlFor="code" required>Código</FieldLabel>
                <Input
                  id="code"
                  {...register('code')}
                  placeholder="EX: BLACK50"
                  className={`${nxInputClass(!!errors.code)} font-mono uppercase`}
                  onChange={(e) => setValue('code', e.target.value.toUpperCase(), { shouldDirty: true })}
                />
                {errors.code && <FieldHelp variant="error">{errors.code.message}</FieldHelp>}
              </Field>
              <Field>
                <FieldLabel htmlFor="coupon-status">Status</FieldLabel>
                <Select value={String(watch('status'))} onValueChange={(v) => setValue('status', Number(v))}>
                  <SelectTrigger id="coupon-status" className={nxInputClass()}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ativo</SelectItem>
                    <SelectItem value="0">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field full>
                <FieldLabel htmlFor="coupon-desc">Descrição</FieldLabel>
                <Textarea id="coupon-desc" {...register('description')} placeholder="Para uso interno do admin" rows={2} className={textareaClass} />
              </Field>
            </FieldGrid>
          </SectionCard>

          <SectionCard>
            <SectionHeader title="Desconto" />
            <FieldGrid columns={2}>
              <Field>
                <FieldLabel htmlFor="discount_type" required>Tipo</FieldLabel>
                <Select
                  value={discountType}
                  onValueChange={(v) => {
                    const next = v as 'percent' | 'fixed'
                    setValue('discount_type', next, { shouldDirty: true, shouldValidate: true })
                    if (next === 'percent' && Number(watch('discount_value') ?? 0) > 100) {
                      setValue('discount_value', 100, { shouldDirty: true, shouldValidate: true })
                    }
                  }}
                >
                  <SelectTrigger id="discount_type" className={nxInputClass()}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percent">Percentual (%)</SelectItem>
                    <SelectItem value="fixed">Valor fixo (R$)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="discount_value" required>
                  Valor {discountType === 'percent' ? '(%)' : '(R$)'}
                </FieldLabel>
                <Input
                  id="discount_value"
                  {...register('discount_value')}
                  type="number"
                  step={discountType === 'percent' ? '1' : '0.01'}
                  placeholder={discountType === 'percent' ? '50' : '20.00'}
                  className={nxInputClass(!!errors.discount_value)}
                />
                {errors.discount_value && <FieldHelp variant="error">{errors.discount_value.message}</FieldHelp>}
              </Field>
            </FieldGrid>
          </SectionCard>

          <SectionCard>
            <SectionHeader title="Aplicação e duração" />
            <FieldGrid columns={2}>
              <Field>
                <FieldLabel htmlFor="applies_to_cycle" required>Vale para ciclo</FieldLabel>
                <Select value={watch('applies_to_cycle')} onValueChange={(v) => setValue('applies_to_cycle', v as any, { shouldDirty: true })}>
                  <SelectTrigger id="applies_to_cycle" className={nxInputClass()}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Mensal e Anual</SelectItem>
                    <SelectItem value="monthly">Apenas Mensal</SelectItem>
                    <SelectItem value="yearly">Apenas Anual</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="duration_type" required>Duração do desconto</FieldLabel>
                <Select value={durationType} onValueChange={(v) => setValue('duration_type', v as any, { shouldDirty: true })}>
                  <SelectTrigger id="duration_type" className={nxInputClass()}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="forever">Vitalício</SelectItem>
                    <SelectItem value="months">Por N meses</SelectItem>
                    <SelectItem value="once">Apenas 1º pagamento</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              {durationType === 'months' && (
                <Field>
                  <FieldLabel htmlFor="duration_months" required>Quantos meses</FieldLabel>
                  <Input id="duration_months" {...register('duration_months')} type="number" min={1} placeholder="3" className={nxInputClass(!!errors.duration_months)} />
                  {errors.duration_months && <FieldHelp variant="error">{errors.duration_months.message}</FieldHelp>}
                </Field>
              )}
            </FieldGrid>
          </SectionCard>

          <SectionCard>
            <SectionHeader
              title="Planos elegíveis"
              description="Não selecione nenhum para valer em todos os planos"
            />
            {plansData?.data?.length ? (
              <div className="mt-[14px] overflow-hidden rounded-xl border border-nxborder">
                {plansData.data.map((plan, i) => {
                  const checked = planIds.includes(plan.id)
                  return (
                    <label
                      key={plan.id}
                      className={cn(
                        'flex cursor-pointer items-center gap-[13px] px-[16px] py-[14px] transition-colors',
                        i > 0 && 'border-t border-[#F0F1F5]',
                        checked ? 'bg-[#FAFAFE]' : 'bg-white hover:bg-[#FAFAFE]',
                      )}
                    >
                      <span
                        className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[9px] text-[13px] font-extrabold"
                        style={{
                          background: checked ? 'rgba(42,45,124,0.10)' : '#F6F7FA',
                          color: checked ? '#2A2D7C' : '#8A8CA3',
                        }}
                      >
                        {plan.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[13.5px] font-extrabold text-nxi1">{plan.name}</div>
                        <div className="text-[12px] font-semibold text-nxi3">
                          {formatBRL(Number(plan.price_monthly))}/mês
                          {plan.price_yearly
                            ? ` · ${formatBRL(Number(plan.price_yearly))}/ano`
                            : ''}
                        </div>
                      </div>
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => togglePlan(plan.id)}
                      />
                    </label>
                  )
                })}
              </div>
            ) : (
              <p className="mt-3 text-[13px] font-semibold text-nxi3">Carregando planos…</p>
            )}
          </SectionCard>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          <SectionCard>
            <SectionHeader title="Limites e expiração" />
            <FieldGrid columns={1}>
              <Field>
                <FieldLabel htmlFor="max_uses">Limite de usos</FieldLabel>
                <Input id="max_uses" {...register('max_uses')} type="number" min={1} placeholder="Vazio = ilimitado" className={nxInputClass()} />
              </Field>
              <Field>
                <FieldLabel htmlFor="expires_at">Expira em</FieldLabel>
                <Input id="expires_at" {...register('expires_at')} type="date" className={nxInputClass()} />
                <FieldHelp>Após esta data, o código deixa de funcionar</FieldHelp>
              </Field>
            </FieldGrid>
          </SectionCard>

          <div className="flex flex-col gap-2">
            <NxButton type="submit" variant="primary" loading={isSubmitting} className="w-full justify-center">
              {isSubmitting ? 'Salvando…' : submitLabel}
            </NxButton>
            <NxButton type="button" variant="ghost" onClick={onCancel} className="w-full justify-center">
              Cancelar
            </NxButton>
          </div>
        </div>
      </div>
    </form>
  )
}
