'use client'

import React from 'react'
import { Controller, type UseFormRegister, type Control, type UseFormWatch, type UseFormSetValue, type FieldErrors } from 'react-hook-form'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, CalendarIcon, Loader2, Tag } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn, formatPrice } from '@/lib/utils'
import type { CreateCouponFormData } from '@/schemas'

/**
 * Valores de formulário compartilhados entre criação e edição de cupom.
 * Usa CreateCouponFormData como base — o campo `code` só é registrado
 * no modo de criação; no modo de edição o campo não é montado no DOM.
 */
export type CouponFormValues = CreateCouponFormData

const CODE_MAX = 20

function clampInput(
  e: React.FormEvent<HTMLInputElement>,
  max: number,
  setVal: UseFormSetValue<CouponFormValues>,
  field: keyof CouponFormValues,
) {
  const input = e.currentTarget
  const num = parseFloat(input.value)
  if (!isNaN(num) && num > max) {
    input.value = String(max)
    setVal(field, max)
  }
}

// ─── Live preview ────────────────────────────────────────────────────────────

function CouponPreview({
  code,
  type,
  value,
  minOrder,
  maxUses,
  expiresAt,
}: {
  code: string
  type: 'percent' | 'fixed'
  value: number | undefined
  minOrder: number | undefined
  maxUses: number | undefined
  expiresAt: Date | undefined
}) {
  const hasValue = value !== undefined && !isNaN(value) && value > 0
  const displayValue = hasValue
    ? type === 'percent'
      ? `${value}%`
      : formatPrice(value)
    : null

  const chips: string[] = []
  if (minOrder) chips.push(`Mín. ${formatPrice(minOrder)}`)
  if (maxUses) chips.push(`${maxUses} uso${maxUses !== 1 ? 's' : ''}`)
  if (expiresAt) chips.push(`até ${format(expiresAt, 'dd/MM/yyyy')}`)

  return (
    <div className="overflow-hidden rounded-2xl bg-nxi1 shadow-xl">
      {/* Top strip */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-nxa/20">
            <Tag className="h-3.5 w-3.5 text-nxa" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">Prévia</span>
        </div>
        <span className={cn(
          'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
          hasValue ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/30',
        )}>
          {hasValue ? 'Ativo' : 'Rascunho'}
        </span>
      </div>

      {/* Main content */}
      <div className="px-6 pt-7 pb-5">
        {/* Value */}
        <div className="mb-5">
          {displayValue ? (
            <>
              <div className={cn(
                'text-[52px] font-black leading-none tracking-tight text-white',
                type === 'fixed' && 'text-[38px]',
              )}>
                {displayValue}
              </div>
              <p className="mt-1.5 text-[13px] font-medium text-white/50">
                {type === 'percent' ? 'de desconto' : 'de desconto em reais'}
              </p>
            </>
          ) : (
            <>
              <div className="text-[52px] font-black leading-none tracking-tight text-white/15">—</div>
              <p className="mt-1.5 text-[13px] font-medium text-white/25">preencha o valor</p>
            </>
          )}
        </div>

        {/* Dashed divider with holes */}
        <div className="relative -mx-6 mb-5">
          <div className="border-t border-dashed border-white/15" />
          <div className="absolute -left-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full" />
          <div className="absolute -right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full" />
        </div>

        {/* Code */}
        <div className="mb-4">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-white/30">Código</p>
          <span className={cn(
            'font-mono text-[17px] font-extrabold tracking-widest',
            code ? 'text-white' : 'text-white/20',
          )}>
            {code || 'SEUCÓDIGO'}
          </span>
        </div>

        {/* Restriction chips */}
        {chips.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {chips.map(c => (
              <span key={c} className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/60">
                {c}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-white/20">Sem restrições</p>
        )}
      </div>

      {/* Bottom strip */}
      <div className="border-t border-white/10 px-5 py-3">
        <p className="text-[10.5px] text-white/25">
          {type === 'percent' ? '% desconto' : 'R$ fixo'} · uso único por pedido
        </p>
      </div>
    </div>
  )
}

// ─── Field primitives ─────────────────────────────────────────────────────────

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1.5">{children}</div>
}

function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-[12.5px] font-semibold text-nxi2">
      {children}
    </label>
  )
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-[11.5px] text-nxi3">{children}</p>
}

function FieldError({ children }: { children?: string }) {
  if (!children) return null
  return <p className="text-[11.5px] font-medium text-red-500">{children}</p>
}

const inputCls = (hasError: boolean) =>
  cn(
    'h-10 w-full rounded-xl border bg-white px-3.5 text-[13.5px] text-nxi1 placeholder:text-nxi3 outline-none transition',
    hasError
      ? 'border-red-400 focus:ring-2 focus:ring-red-100'
      : 'border-nxborder focus:border-nxp focus:ring-2 focus:ring-nxp/15',
  )

// ─── Main form ────────────────────────────────────────────────────────────────

interface CouponFormProps {
  mode: 'create' | 'edit'
  couponCode?: string
  usedCount?: number
  register: UseFormRegister<CouponFormValues>
  control: Control<CouponFormValues>
  watch: UseFormWatch<CouponFormValues>
  setValue: UseFormSetValue<CouponFormValues>
  errors: FieldErrors<CouponFormValues>
  isSubmitting: boolean
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export function CouponForm({
  mode,
  couponCode,
  usedCount,
  register,
  control,
  watch,
  setValue,
  errors,
  isSubmitting,
  onSubmit,
  onCancel,
}: CouponFormProps) {
  const selectedType = watch('type') as 'percent' | 'fixed'
  const watchedCode    = (watch('code') as string) || ''
  const watchedValue   = watch('value') as number | undefined
  const watchedMin     = watch('min_order') as number | undefined
  const watchedMaxUses = watch('max_uses') as number | undefined
  const watchedExpiry  = watch('expires_at') as Date | undefined

  const codeLength = watchedCode.length

  const minOrderReg = register('min_order', {
    setValueAs: (v: unknown) => {
      if (!v && v !== 0) return undefined
      const num = parseFloat(String(v).replace(',', '.'))
      return isNaN(num) ? undefined : num
    },
  })

  const handleMinOrderBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(',', '.')
    const num = parseFloat(raw)
    if (!isNaN(num) && num >= 0) {
      const clamped = Math.min(num, 99999)
      e.target.value = clamped.toFixed(2).replace('.', ',')
      setValue('min_order', clamped)
    } else {
      e.target.value = ''
      setValue('min_order', undefined)
    }
    minOrderReg.onBlur(e)
  }

  const handleMinOrderFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(',', '.')
    const num = parseFloat(raw)
    if (!isNaN(num)) e.target.value = String(num)
  }

  return (
    <div className="mx-auto max-w-[1380px] py-4 md:py-6 lg:py-8">

      {/* Back + heading */}
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-nxborder bg-white text-nxi3 transition hover:border-nxi3 hover:text-nxi1"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-[20px] font-extrabold tracking-tight text-nxi1">
            {mode === 'create' ? 'Novo cupom' : `Editar cupom`}
          </h1>
          {mode === 'edit' && couponCode && (
            <p className="text-[12.5px] text-nxi3">
              <span className="font-mono font-bold text-nxi2">{couponCode}</span>
              {' · '}{usedCount} uso{usedCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <div className="flex gap-6 items-start">

          {/* ── Left: preview ───────────────────────────────────────────── */}
          <div className="w-64 shrink-0 sticky top-6">
            <CouponPreview
              code={mode === 'edit' ? (couponCode ?? '') : watchedCode}
              type={selectedType || 'percent'}
              value={watchedValue}
              minOrder={typeof watchedMin === 'number' ? watchedMin : undefined}
              maxUses={typeof watchedMaxUses === 'number' ? watchedMaxUses : undefined}
              expiresAt={watchedExpiry}
            />

            <div className="mt-3 rounded-xl border border-nxborder bg-white p-3.5 text-[11.5px] leading-relaxed text-nxi3">
              <p className="font-semibold text-nxi2">Como funciona</p>
              <p className="mt-1">O cliente insere o código no checkout e o desconto é aplicado automaticamente.</p>
            </div>
          </div>

          {/* ── Right: form ─────────────────────────────────────────────── */}
          <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-nxborder bg-white">

            <div className="divide-y divide-nxborder">

              {/* Identificação (create only) */}
              {mode === 'create' && (
                <div className="px-7 py-6">
                  <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-nxi3">Identificação</p>
                  <FieldGroup>
                    <FieldLabel htmlFor="code">Código do cupom <span className="text-red-400">*</span></FieldLabel>
                    <div className="relative">
                      <input
                        id="code"
                        maxLength={CODE_MAX}
                        {...register('code')}
                        onChange={(e) => {
                          e.target.value = e.target.value.toUpperCase()
                          register('code').onChange(e)
                        }}
                        placeholder="Ex: DESCONTO10"
                        className={cn(
                          inputCls(!!errors.code),
                          'pr-14 font-mono uppercase tracking-wide',
                        )}
                      />
                      <span className={cn(
                        'absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] tabular-nums',
                        codeLength >= CODE_MAX
                          ? 'font-bold text-red-500'
                          : codeLength >= CODE_MAX - 10
                            ? 'text-amber-500'
                            : 'text-nxi3',
                      )}>
                        {codeLength}/{CODE_MAX}
                      </span>
                    </div>
                    {errors.code
                      ? <FieldError>{errors.code.message as string}</FieldError>
                      : <FieldHint>Somente letras e números, máx. {CODE_MAX} caracteres</FieldHint>
                    }
                  </FieldGroup>
                </div>
              )}

              {/* Desconto */}
              <div className="px-7 py-6">
                <p className="mb-4 text-[11px] font-bold uppercase tracking-widest text-nxi3">Desconto</p>
                <div className="grid grid-cols-2 gap-5">

                  {/* Type */}
                  <FieldGroup>
                    <FieldLabel>Tipo <span className="text-red-400">*</span></FieldLabel>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <div className="grid grid-cols-2 gap-2">
                          {(['percent', 'fixed'] as const).map(t => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => field.onChange(t)}
                              className={cn(
                                'rounded-xl border py-2.5 text-[12.5px] font-semibold transition',
                                field.value === t
                                  ? t === 'percent'
                                    ? 'border-green-300 bg-green-50 text-green-700'
                                    : 'border-nxp/30 bg-nxp/10 text-nxp'
                                  : 'border-nxborder bg-white text-nxi2 hover:border-nxi3 hover:text-nxi1',
                              )}
                            >
                              {t === 'percent' ? '% Percentual' : 'R$ Valor fixo'}
                            </button>
                          ))}
                        </div>
                      )}
                    />
                  </FieldGroup>

                  {/* Value */}
                  <FieldGroup>
                    <FieldLabel htmlFor="value">
                      {selectedType === 'percent' ? 'Percentual' : 'Valor'}{' '}
                      <span className="text-red-400">*</span>
                    </FieldLabel>
                    <div className={cn(
                      'flex h-10 overflow-hidden rounded-xl border transition focus-within:ring-2',
                      errors.value
                        ? 'border-red-400 focus-within:ring-red-100'
                        : 'border-nxborder focus-within:border-nxp focus-within:ring-nxp/15',
                    )}>
                      {selectedType === 'fixed' && (
                        <span className="flex items-center border-r border-nxborder bg-nxbg px-3 text-[12px] font-semibold text-nxi3 select-none">R$</span>
                      )}
                      <input
                        id="value"
                        type="number"
                        min={selectedType === 'percent' ? '1' : '0.01'}
                        step={selectedType === 'percent' ? '1' : '0.01'}
                        max={selectedType === 'percent' ? 100 : undefined}
                        {...register('value')}
                        onInput={e => selectedType === 'percent' && clampInput(e, 100, setValue, 'value')}
                        placeholder={selectedType === 'percent' ? '10' : '0,00'}
                        className="min-w-0 flex-1 bg-transparent px-3.5 text-[13.5px] text-nxi1 outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      />
                      {selectedType === 'percent' && (
                        <span className="flex items-center border-l border-nxborder bg-nxbg px-3 text-[12px] font-semibold text-nxi3 select-none">%</span>
                      )}
                    </div>
                    {errors.value
                      ? <FieldError>{errors.value.message as string}</FieldError>
                      : <FieldHint>{selectedType === 'percent' ? '1% – 100%' : 'Valor em reais'}</FieldHint>
                    }
                  </FieldGroup>

                </div>
              </div>

              {/* Restrições */}
              <div className="px-7 py-6">
                <div className="mb-4 flex items-center gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-nxi3">Restrições</p>
                  <span className="rounded-full bg-nxbg px-2 py-0.5 text-[10px] font-semibold text-nxi3">opcional</span>
                </div>
                <div className="grid grid-cols-3 gap-5">

                  {/* Min order */}
                  <FieldGroup>
                    <FieldLabel htmlFor="min_order">Pedido mínimo</FieldLabel>
                    <div className={cn(
                      'flex h-10 overflow-hidden rounded-xl border transition focus-within:ring-2',
                      errors.min_order
                        ? 'border-red-400 focus-within:ring-red-100'
                        : 'border-nxborder focus-within:border-nxp focus-within:ring-nxp/15',
                    )}>
                      <span className="flex items-center border-r border-nxborder bg-nxbg px-3 text-[12px] font-semibold text-nxi3 select-none">R$</span>
                      <input
                        id="min_order"
                        type="text"
                        inputMode="decimal"
                        {...minOrderReg}
                        onBlur={handleMinOrderBlur}
                        onFocus={handleMinOrderFocus}
                        placeholder="0,00"
                        className="min-w-0 flex-1 bg-transparent px-3 text-[13.5px] text-nxi1 outline-none"
                      />
                    </div>
                    {errors.min_order
                      ? <FieldError>{errors.min_order.message as string}</FieldError>
                      : <FieldHint>Vazio = sem restrição</FieldHint>
                    }
                  </FieldGroup>

                  {/* Max uses */}
                  <FieldGroup>
                    <FieldLabel htmlFor="max_uses">Limite de usos</FieldLabel>
                    <input
                      id="max_uses"
                      type="number"
                      min="1"
                      max="999"
                      step="1"
                      {...register('max_uses')}
                      onInput={e => clampInput(e, 999, setValue, 'max_uses')}
                      placeholder="Ilimitado"
                      className={cn(
                        inputCls(!!errors.max_uses),
                        '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                      )}
                    />
                    {errors.max_uses
                      ? <FieldError>{errors.max_uses.message as string}</FieldError>
                      : <FieldHint>1 – 999 · vazio = ilimitado</FieldHint>
                    }
                  </FieldGroup>

                  {/* Expiry */}
                  <FieldGroup>
                    <FieldLabel>Data de expiração</FieldLabel>
                    <Controller
                      name="expires_at"
                      control={control}
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className={cn(
                                'flex h-10 w-full items-center gap-2 rounded-xl border border-nxborder bg-white px-3.5 text-[13px] transition hover:border-nxi3',
                                field.value ? 'text-nxi1' : 'text-nxi3',
                              )}
                            >
                              <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-nxi3" />
                              <span className="truncate">
                                {field.value
                                  ? format(field.value as Date, 'dd/MM/yyyy')
                                  : 'Sem expiração'}
                              </span>
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value as Date | undefined}
                              onSelect={field.onChange}
                              disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))}
                              locale={ptBR}
                              initialFocus
                            />
                            {field.value && (
                              <div className="border-t border-nxborder px-3 pb-3 pt-2">
                                <button
                                  type="button"
                                  onClick={() => field.onChange(undefined)}
                                  className="w-full rounded-lg py-1.5 text-[12px] font-semibold text-nxi3 transition hover:bg-nxbg hover:text-nxi1"
                                >
                                  Remover data
                                </button>
                              </div>
                            )}
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    <FieldHint>Vazio = não expira</FieldHint>
                  </FieldGroup>

                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 bg-white px-7 py-4">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-nxborder bg-white px-5 py-2.5 text-[13px] font-semibold text-nxi1 transition hover:border-nxi3"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-nxp px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-nxp/90 disabled:opacity-60"
              >
                {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {isSubmitting ? 'Salvando…' : mode === 'create' ? 'Criar cupom' : 'Salvar alterações'}
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  )
}
