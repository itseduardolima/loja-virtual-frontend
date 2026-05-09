'use client'

import { useEntrega } from './useEntrega'
import { Input, LoadingSpinner } from '@/components'
import { Home as HomeIcon } from 'lucide-react'
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

  return (
    <div className="flex flex-col gap-4">
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
