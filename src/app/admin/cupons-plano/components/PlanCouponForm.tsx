'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { CalendarClock, Hash, Percent, Settings, Tag, Ticket, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { createPlanCouponSchema } from '@/schemas/planCouponSchemas'
import { useAdminPlans } from '@/hooks/useAdminPlans'
import type { AdminPlanCoupon } from '@/types/admin'

interface PlanCouponFormValues {
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
  code: '',
  description: '',
  discount_type: 'percent',
  discount_value: 10,
  applies_to_cycle: 'both',
  duration_type: 'forever',
  duration_months: null,
  plan_ids: [],
  max_uses: null,
  expires_at: null,
  status: 1,
}

export function PlanCouponForm({ initial, isSubmitting, submitLabel, onSubmit, onCancel }: PlanCouponFormProps) {
  const { data: plansData } = useAdminPlans({ page: 1, limit: 100 })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PlanCouponFormValues>({
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

  const togglePlan = (id: number) => {
    const next = planIds.includes(id) ? planIds.filter((p) => p !== id) : [...planIds, id]
    setValue('plan_ids', next, { shouldDirty: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <Ticket className="h-4 w-4 text-gray-500" />
                Identificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Código *</Label>
                  <Input
                    {...register('code')}
                    placeholder="EX: BLACK50"
                    className="font-mono uppercase"
                    onChange={(e) => setValue('code', e.target.value.toUpperCase(), { shouldDirty: true })}
                  />
                  {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <Select
                    value={String(watch('status'))}
                    onValueChange={(v) => setValue('status', Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Ativo</SelectItem>
                      <SelectItem value="0">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Descrição</Label>
                <Textarea
                  {...register('description')}
                  placeholder="Para uso interno do admin"
                  rows={2}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <Percent className="h-4 w-4 text-gray-500" />
                Desconto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Tipo *</Label>
                  <Select
                    value={discountType}
                    onValueChange={(v) => {
                      const next = v as 'percent' | 'fixed'
                      setValue('discount_type', next, { shouldDirty: true, shouldValidate: true })
                      // Se mudou para percent e valor atual > 100, capar em 100
                      if (next === 'percent') {
                        const current = Number(watch('discount_value') ?? 0)
                        if (current > 100) {
                          setValue('discount_value', 100, { shouldDirty: true, shouldValidate: true })
                        }
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Percentual (%)</SelectItem>
                      <SelectItem value="fixed">Valor fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Valor * {discountType === 'percent' ? '(%)' : '(R$)'}
                  </Label>
                  <Input
                    {...register('discount_value')}
                    type="number"
                    step={discountType === 'percent' ? '1' : '0.01'}
                    placeholder={discountType === 'percent' ? '50' : '20.00'}
                  />
                  {errors.discount_value && <p className="text-xs text-red-500">{errors.discount_value.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <CalendarClock className="h-4 w-4 text-gray-500" />
                Aplicação e duração
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Vale para ciclo *</Label>
                  <Select
                    value={watch('applies_to_cycle')}
                    onValueChange={(v) => setValue('applies_to_cycle', v as any, { shouldDirty: true })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="both">Mensal e Anual</SelectItem>
                      <SelectItem value="monthly">Apenas Mensal</SelectItem>
                      <SelectItem value="yearly">Apenas Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Duração do desconto *</Label>
                  <Select
                    value={durationType}
                    onValueChange={(v) => setValue('duration_type', v as any, { shouldDirty: true })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="forever">Vitalício</SelectItem>
                      <SelectItem value="months">Por N meses</SelectItem>
                      <SelectItem value="once">Apenas 1º pagamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {durationType === 'months' && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Quantos meses *</Label>
                  <Input
                    {...register('duration_months')}
                    type="number"
                    min={1}
                    placeholder="3"
                  />
                  {errors.duration_months && <p className="text-xs text-red-500">{errors.duration_months.message}</p>}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <Tag className="h-4 w-4 text-gray-500" />
                Planos elegíveis
              </CardTitle>
              <p className="text-sm text-gray-500">Não selecione nenhum para valer em todos os planos</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {plansData?.data?.length ? (
                plansData.data.map((plan) => (
                  <label
                    key={plan.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <Checkbox
                      checked={planIds.includes(plan.id)}
                      onCheckedChange={() => togglePlan(plan.id)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{plan.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{plan.slug}</p>
                    </div>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-400">Carregando planos...</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-900">
                <Settings className="h-4 w-4 text-gray-500" />
                Limites e expiração
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  Limite de usos
                </Label>
                <Input
                  {...register('max_uses')}
                  type="number"
                  min={1}
                  placeholder="Vazio = ilimitado"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5" />
                  Expira em
                </Label>
                <Input {...register('expires_at')} type="date" />
                <p className="text-xs text-gray-400">Após esta data, o código deixa de funcionar</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Salvando...' : submitLabel}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="w-full">
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
