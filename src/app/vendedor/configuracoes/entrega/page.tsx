'use client'

import { useEntrega } from './useEntrega'
import { Input, LoadingSpinner } from '@/components'
import { Home as HomeIcon, Truck, PackageOpen, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  SectionCard,
  ToggleRow,
  Notice,
  FieldLabel,
  FieldHelp,
  NxButton,
} from '../_shared'

export default function EntregaPage() {
  const {
    isLoading,
    isUpdating,
    formData,
    errors,
    isDirty,
    isFormValid,
    setPickupEnabled,
    setFreeShippingEnabled,
    setFreeShippingMin,
    handleSave,
    handleReset,
    storeAddress,
  } = useEntrega()

  if (isLoading) {
    return (
      <SectionCard>
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size="md" />
        </div>
      </SectionCard>
    )
  }

  // Hero summary stats
  const enabledCount =
    (formData.pickup_enabled ? 1 : 0) + (formData.free_shipping_enabled ? 1 : 0)
  const minValueDisplay = formData.free_shipping_min
    ? Number(formData.free_shipping_min.replace(',', '.')).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })
    : null

  return (
    <div className="flex flex-col gap-4">
      {/* ─── Hero: status dos métodos de entrega ─────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
        <div className="flex flex-wrap items-start gap-3 border-b border-nxborder bg-gradient-to-br from-nxp/[0.04] to-transparent px-4 py-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-nxp ring-1 ring-inset ring-nxp/15">
            <Truck className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[13.5px] font-bold tracking-[-0.005em] text-nxi1">
              Métodos de entrega
            </h3>
            <p className="mt-0.5 text-[12px] text-nxi2">
              {enabledCount === 0 ? (
                <>Nenhum método ativo · clientes não conseguem finalizar pedidos.</>
              ) : (
                <>
                  <strong className="text-nxi1">{enabledCount}</strong>{' '}
                  {enabledCount === 1 ? 'método ativo' : 'métodos ativos'}
                  {minValueDisplay && formData.free_shipping_enabled && (
                    <> · frete grátis acima de <strong className="text-nxs">{minValueDisplay}</strong></>
                  )}
                </>
              )}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <span
              title="Retirada na loja"
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10.5px] font-bold uppercase tracking-[0.04em] ring-1 ring-inset',
                formData.pickup_enabled
                  ? 'bg-nxs/10 text-nxs ring-nxs/20'
                  : 'bg-nxbg text-nxi3 ring-nxborder',
              )}
            >
              <PackageOpen className="h-2.5 w-2.5" strokeWidth={2.5} />
              Retirada
            </span>
            <span
              title="Frete grátis"
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10.5px] font-bold uppercase tracking-[0.04em] ring-1 ring-inset',
                formData.free_shipping_enabled
                  ? 'bg-nxs/10 text-nxs ring-nxs/20'
                  : 'bg-nxbg text-nxi3 ring-nxborder',
              )}
            >
              <Sparkles className="h-2.5 w-2.5" strokeWidth={2.5} />
              Frete grátis
            </span>
          </div>
        </div>
      </div>

      {errors._global && <Notice variant="amber">{errors._global}</Notice>}

      {/* Retirada na loja */}
      <SectionCard flush>
        <ToggleRow
          on={formData.pickup_enabled}
          onChange={setPickupEnabled}
          title="Retirada na loja"
          desc="Cliente retira o pedido pessoalmente no endereço da loja. Sem custo de entrega."
        >
          {storeAddress && (storeAddress.address || storeAddress.city) ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-nxborder bg-nxbg/50 px-3.5 py-3 text-[13px] text-nxi1">
              <HomeIcon size={14} className="mt-0.5 shrink-0 text-nxi3" strokeWidth={2} />
              <span className="leading-relaxed">
                {storeAddress.address}
                {storeAddress.number ? `, ${storeAddress.number}` : ''}
                {storeAddress.complement ? ` — ${storeAddress.complement}` : ''}
                {storeAddress.neighborhood ? ` · ${storeAddress.neighborhood}` : ''}
                {storeAddress.city ? ` · ${storeAddress.city}` : ''}
                {storeAddress.state ? `/${storeAddress.state}` : ''}
                {storeAddress.zipcode ? ` · ${storeAddress.zipcode}` : ''}
              </span>
            </div>
          ) : (
            <Notice variant="amber">
              Configure o <strong>endereço da loja</strong> em “Endereço” para que clientes
              saibam onde retirar.
            </Notice>
          )}
        </ToggleRow>
      </SectionCard>

      {/* Frete grátis */}
      <SectionCard flush>
        <ToggleRow
          on={formData.free_shipping_enabled}
          onChange={setFreeShippingEnabled}
          title="Frete grátis"
          desc="Oferece frete sem custo para pedidos acima de um valor mínimo."
        >
          <div className="max-w-[280px]">
            <FieldLabel htmlFor="free_shipping_min">Pedidos acima de</FieldLabel>
            <div className="mt-1.5 flex items-stretch overflow-hidden rounded-lg border border-nxborder bg-white focus-within:border-nxp focus-within:ring-2 focus-within:ring-nxp/30">
              <span className="flex items-center border-r border-nxborder bg-nxbg/60 px-3 text-[13px] font-semibold text-nxi2">
                R$
              </span>
              <Input
                id="free_shipping_min"
                value={formData.free_shipping_min}
                onChange={(e) => setFreeShippingMin(e.target.value)}
                placeholder="0,00"
                inputMode="decimal"
                className="h-10 rounded-none border-0 px-3 text-[13px] text-nxi1 placeholder:text-nxi3 focus-visible:outline-none focus-visible:ring-0"
              />
            </div>
            {errors.free_shipping_min ? (
              <FieldHelp variant="error">{errors.free_shipping_min}</FieldHelp>
            ) : (
              <FieldHelp>Aplicado automaticamente em qualquer método de envio acima.</FieldHelp>
            )}
          </div>
        </ToggleRow>
      </SectionCard>

      {/* Form actions */}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <NxButton
          variant="ghost"
          onClick={handleReset}
          disabled={!isDirty || isUpdating}
        >
          Descartar alterações
        </NxButton>
        <NxButton
          variant="primary"
          onClick={handleSave}
          disabled={!isDirty || !isFormValid}
          loading={isUpdating}
        >
          {isUpdating ? 'Salvando…' : 'Salvar configurações'}
        </NxButton>
      </div>
    </div>
  )
}
