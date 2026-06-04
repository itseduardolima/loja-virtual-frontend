'use client'

// Espelha BasicInfoSection de /tmp/nexo-design/nexo-criar-produto/project/sections.jsx.
// O protótipo guarda price/promoPrice como string BRL; o form real usa number.
// Reutilizamos a abordagem de moeda da página atual
// (src/app/vendedor/produtos/criar/page.tsx): exibimos string formatada e
// convertemos via dígitos→centavos no onChange.
import * as React from 'react'
import { BadgePercent, Star, Type } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import type { CreateProductFormData } from '@/schemas'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { cn } from '@/lib/utils'
import {
  Field,
  FieldGrid,
  FieldHelp,
  FieldLabel,
  SectionCard,
  SectionHeader,
  ToggleRow,
} from '../primitives'
import { Switch } from '@/components/ui/switch'
import { NxInput, NxTextarea } from '../inputs'

// dígitos → "1.234,56" (centavos), vazio quando não houver valor
const centsToBRL = (cents: number) =>
  (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const numberToDisplay = (n?: number | null) =>
  n != null && !Number.isNaN(n) && n > 0 ? centsToBRL(Math.round(n * 100)) : ''

export function BasicInfoSection({
  form,
  showErrors,
}: {
  form: UseFormReturn<CreateProductFormData>
  showErrors: boolean
}) {
  const { register, setValue, watch, formState } = form
  const errors = formState.errors

  const name = watch('name') || ''
  const description = watch('description') || ''
  const price = watch('price')
  const promoPrice = watch('promo_price')
  const promoStart = watch('promo_starts_at')
  const promoEnd = watch('promo_ends_at')
  const featured = watch('featured') || false

  const [promoOn, setPromoOn] = React.useState(
    () => promoPrice != null || !!promoStart || !!promoEnd,
  )

  const handleCurrency =
    (field: 'price' | 'promo_price') => (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/\D/g, '')
      const cents = parseInt(digits, 10) || 0
      if (cents > 99999999) return
      setValue(field, cents > 0 ? cents / 100 : undefined, {
        shouldValidate: digits.length > 0,
      })
    }

  const nameErr = showErrors && name.trim().length < 3
  const priceErr = showErrors && (!price || price <= 0)
  const promoPriceErr = promoOn && promoPrice != null && price != null && promoPrice >= price
  const promoEndErr =
    promoOn && !!promoStart && !!promoEnd && new Date(promoEnd) <= new Date(promoStart)

  const togglePromo = (v: boolean) => {
    setPromoOn(v)
    if (!v) {
      setValue('promo_price', undefined)
      setValue('promo_starts_at', null)
      setValue('promo_ends_at', null)
    }
  }

  return (
    <SectionCard id="sec-basico">
      <SectionHeader
        icon={Type}
        title="Informações básicas"
        description="O essencial que aparece na vitrine da sua loja."
      />
      <FieldGrid columns={1}>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel required>Nome do produto</FieldLabel>
            <span
              className={cn(
                'text-[11px] font-medium',
                name.length > 100 ? 'text-nxd' : 'text-nxi3',
              )}
            >
              {name.length}/100
            </span>
          </div>
          <NxInput
            {...register('name')}
            maxLength={100}
            placeholder="ex.: Camiseta Oversized Algodão Pima"
            error={nameErr}
          />
          {nameErr && <FieldHelp variant="error">Nome deve ter no mínimo 3 caracteres.</FieldHelp>}
        </Field>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel>Descrição curta</FieldLabel>
            <span
              className={cn(
                'text-[11px] font-medium',
                description.length > 500 ? 'text-nxd' : 'text-nxi3',
              )}
            >
              {description.length}/500
            </span>
          </div>
          <NxTextarea
            {...register('description')}
            rows={3}
            maxLength={500}
            placeholder="Um resumo curto e vendedor. Aparece na listagem e no topo da página do produto."
          />
        </Field>
      </FieldGrid>

      <FieldGrid columns={2} className="mt-4 md:mt-5">
        <Field>
          <FieldLabel required>Preço de venda</FieldLabel>
          <NxInput
            prefix="R$"
            inputMode="decimal"
            value={numberToDisplay(price)}
            onChange={handleCurrency('price')}
            placeholder="0,00"
            error={priceErr}
          />
          {priceErr && <FieldHelp variant="error">Preço é obrigatório.</FieldHelp>}
        </Field>
        <Field>
          <FieldLabel>Visibilidade</FieldLabel>
          <div className="flex h-10 items-center justify-between rounded-lg border border-nxborder bg-white px-3">
            <span className="flex items-center gap-2 text-[13px] font-medium text-nxi2">
              <Star size={15} className={featured ? 'text-nxa' : 'text-nxi3'} /> Produto em destaque
            </span>
            <Switch
              checked={featured}
              onCheckedChange={(v) => setValue('featured', v)}
              aria-label="Destaque"
              className="data-[state=checked]:bg-nxp data-[state=unchecked]:bg-nxborder focus-visible:ring-nxp/30"
            />
          </div>
        </Field>
      </FieldGrid>

      {/* Promoção agendada */}
      <div className="mt-4 overflow-hidden rounded-xl border border-nxborder">
        <ToggleRow
          on={promoOn}
          onChange={togglePromo}
          icon={BadgePercent}
          title="Promoção agendada"
          desc="Defina um preço promocional com início e fim automáticos."
          badge={promoOn ? 'Ativa' : undefined}
        >
          <FieldGrid columns={3}>
            <Field>
              <FieldLabel required>Preço promocional</FieldLabel>
              <NxInput
                prefix="R$"
                inputMode="decimal"
                value={numberToDisplay(promoPrice)}
                onChange={handleCurrency('promo_price')}
                placeholder="0,00"
                error={promoPriceErr}
              />
              {promoPriceErr && <FieldHelp variant="error">Deve ser menor que o preço.</FieldHelp>}
            </Field>
            <Field>
              <FieldLabel required>Início</FieldLabel>
              <DateTimePicker
                value={promoStart}
                onChange={(v) => setValue('promo_starts_at', v)}
                placeholder="Selecionar data"
              />
            </Field>
            <Field>
              <FieldLabel required>Fim</FieldLabel>
              <DateTimePicker
                value={promoEnd}
                onChange={(v) => setValue('promo_ends_at', v)}
                placeholder="Selecionar data"
              />
              {(promoEndErr || errors.promo_ends_at) && (
                <FieldHelp variant="error">
                  {errors.promo_ends_at?.message || 'Fim deve ser após o início.'}
                </FieldHelp>
              )}
            </Field>
          </FieldGrid>
        </ToggleRow>
      </div>
    </SectionCard>
  )
}
