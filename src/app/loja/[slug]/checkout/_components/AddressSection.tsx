'use client'

import { MapPin, Check, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionCard } from './SectionCard'
import { Field, inputCls } from './Field'
import { emptyAddressForm, type AddressFormData } from '../useCheckoutPage'

interface Address {
  id: number
  label?: string
  name: string
  street: string
  number?: string
  complement?: string
  neighborhood?: string
  city: string
  state: string
  zipcode: string
  is_default?: number
}

interface AddressSectionProps {
  isAuthenticated: boolean
  addresses: Address[]
  addressesLoading: boolean
  selectedAddressId: number | null
  setSelectedAddressId: (id: number) => void
  useManualAddress: boolean
  setUseManualAddress: (v: boolean) => void
  showAddressForm: boolean
  setShowAddressForm: (v: boolean) => void
  addressForm: AddressFormData
  setAddressForm: React.Dispatch<React.SetStateAction<AddressFormData>>
  isFetchingCep: boolean
  cepError: string
  addressError: string
  addrDone: boolean
  handleZipcodeChange: (value: string) => void
  handleSaveAndSelectAddress: () => void
  isCreating: boolean
}

// Verifica se o CEP foi preenchido com sucesso (via ViaCEP)
function cepFilled(form: AddressFormData): boolean {
  return !!(form.street && form.city && form.state && form.zipcode.replace(/\D/g, '').length === 8)
}

export function AddressSection({
  isAuthenticated,
  addresses,
  addressesLoading,
  selectedAddressId,
  setSelectedAddressId,
  useManualAddress,
  setUseManualAddress,
  showAddressForm,
  setShowAddressForm,
  addressForm,
  setAddressForm,
  isFetchingCep,
  cepError,
  addressError,
  addrDone,
  handleZipcodeChange,
  handleSaveAndSelectAddress,
  isCreating,
}: AddressSectionProps) {
  // Formulário do endereço (novo ou manual)
  const showForm = showAddressForm || (!isAuthenticated && useManualAddress)
  const isCepFilled = cepFilled(addressForm)

  const addressFormContent = (
    <div className="grid grid-cols-2 gap-3 rounded-xl bg-nxbg/60 p-3.5 ck-rise">
      {/* CEP */}
      <div className="col-span-2 sm:col-span-1">
        <Field
          label="CEP"
          required
          error={cepError || undefined}
          hint={!cepError ? 'Preenche o resto sozinho' : undefined}
        >
          <div className="relative">
            <input
              value={addressForm.zipcode}
              onChange={(e) => handleZipcodeChange(e.target.value)}
              autoComplete="postal-code"
              inputMode="numeric"
              placeholder="00000-000"
              maxLength={9}
              className={inputCls(!!cepError)}
            />
            {isFetchingCep && (
              <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-nxi3 border-t-transparent" />
            )}
            {isCepFilled && !isFetchingCep && !cepError && (
              <Check size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-nxs" />
            )}
          </div>
        </Field>
      </div>

      {/* Número */}
      <div className="col-span-2 sm:col-span-1">
        <Field label="Número" required>
          <input
            value={addressForm.number}
            onChange={(e) => setAddressForm((p) => ({ ...p, number: e.target.value.slice(0, 10) }))}
            inputMode="numeric"
            placeholder="123"
            className={inputCls(false)}
          />
        </Field>
      </div>

      {/* Logradouro */}
      <div className="col-span-2">
        <Field label="Logradouro" required>
          <input
            value={addressForm.street}
            onChange={(e) =>
              setAddressForm((p) => ({ ...p, street: e.target.value.slice(0, 100) }))
            }
            placeholder="Rua, avenida…"
            className={cn(inputCls(false), isCepFilled && 'bg-nxs/[0.04]')}
          />
        </Field>
      </div>

      {/* Complemento */}
      <div>
        <Field label="Complemento">
          <input
            value={addressForm.complement}
            onChange={(e) =>
              setAddressForm((p) => ({ ...p, complement: e.target.value.slice(0, 50) }))
            }
            placeholder="Apto, bloco…"
            className={inputCls(false)}
          />
        </Field>
      </div>

      {/* Bairro */}
      <div>
        <Field label="Bairro">
          <input
            value={addressForm.neighborhood}
            onChange={(e) =>
              setAddressForm((p) => ({ ...p, neighborhood: e.target.value.slice(0, 60) }))
            }
            placeholder="Bairro"
            className={cn(inputCls(false), isCepFilled && 'bg-nxs/[0.04]')}
          />
        </Field>
      </div>

      {/* Cidade */}
      <div>
        <Field label="Cidade" required>
          <input
            value={addressForm.city}
            onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value.slice(0, 60) }))}
            placeholder="Cidade"
            className={cn(inputCls(false), isCepFilled && 'bg-nxs/[0.04]')}
          />
        </Field>
      </div>

      {/* UF */}
      <div>
        <Field label="UF" required>
          <input
            value={addressForm.state}
            onChange={(e) =>
              setAddressForm((p) => ({ ...p, state: e.target.value.toUpperCase().slice(0, 2) }))
            }
            placeholder="SP"
            className={cn(inputCls(false), isCepFilled && 'bg-nxs/[0.04]')}
          />
        </Field>
      </div>

      {/* Rótulo — somente autenticados */}
      {isAuthenticated && (
        <div>
          <Field label="Rótulo (ex: Casa, Trabalho)">
            <input
              value={addressForm.label}
              onChange={(e) =>
                setAddressForm((p) => ({ ...p, label: e.target.value.slice(0, 30) }))
              }
              placeholder="Casa"
              className={inputCls(false)}
            />
          </Field>
        </div>
      )}

      {/* Nome do destinatário */}
      <div className={cn('col-span-2', isAuthenticated && 'col-span-2')}>
        <Field label="Nome do destinatário" required>
          <input
            value={addressForm.name}
            onChange={(e) => setAddressForm((p) => ({ ...p, name: e.target.value.slice(0, 80) }))}
            placeholder="Nome completo"
            className={inputCls(false)}
          />
        </Field>
      </div>

      {/* Botões — salvar (autenticado) ou nada (guest) */}
      {isAuthenticated && (
        <div className="col-span-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setShowAddressForm(false)
              setAddressForm(emptyAddressForm)
            }}
            className="h-9 rounded-xl border border-nxborder px-4 text-[13px] font-semibold text-nxi2 transition-colors hover:border-nxi2"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSaveAndSelectAddress}
            disabled={isCreating}
            className="h-9 rounded-xl bg-store px-4 text-[13px] font-bold text-white transition-[opacity,filter] hover:brightness-[1.05] disabled:opacity-50"
          >
            {isCreating ? 'Salvando…' : 'Salvar endereço'}
          </button>
        </div>
      )}
    </div>
  )

  return (
    <SectionCard
      n="2"
      icon={MapPin}
      title="Endereço de entrega"
      desc="Para a loja calcular o envio no WhatsApp."
      done={addrDone}
    >
      <div className="flex flex-col gap-2.5">
        {/* Cards de endereços salvos */}
        {isAuthenticated &&
          !addressesLoading &&
          addresses.length > 0 &&
          addresses.map((addr) => {
            const isSelected = selectedAddressId === addr.id && !useManualAddress
            return (
              <button
                key={addr.id}
                type="button"
                onClick={() => {
                  setSelectedAddressId(addr.id)
                  setUseManualAddress(false)
                }}
                role="radio"
                aria-checked={isSelected}
                className={cn(
                  'flex items-start gap-3 rounded-xl border-[1.5px] p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store focus-visible:ring-offset-2',
                  isSelected
                    ? 'border-store bg-store/[0.05]'
                    : 'border-nxborder bg-white hover:border-nxi3',
                )}
              >
                {/* Radio fake */}
                <span
                  className={cn(
                    'mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 bg-white',
                    isSelected ? 'border-store' : 'border-nxi3',
                  )}
                >
                  {isSelected && <span className="h-2 w-2 rounded-full bg-store" />}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {addr.label && (
                      <span className="text-[11px] font-bold uppercase tracking-wide text-nxi3">
                        {addr.label}
                      </span>
                    )}
                    {addr.is_default === 1 && (
                      <span className="rounded-full bg-nxbg px-1.5 py-0.5 text-[9.5px] font-bold uppercase text-nxi2">
                        Padrão
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[13px] font-bold text-nxi1">{addr.name}</p>
                  <p className="text-[12px] text-nxi2">
                    {addr.street}
                    {addr.number ? `, ${addr.number}` : ''}
                    {addr.complement ? ` — ${addr.complement}` : ''}
                  </p>
                  <p className="text-[12px] text-nxi2">
                    {addr.neighborhood ? `${addr.neighborhood}, ` : ''}
                    {addr.city} - {addr.state}, {addr.zipcode}
                  </p>
                </div>

                {isSelected && <Check size={16} className="mt-0.5 shrink-0 text-store-ink" />}
              </button>
            )
          })}

        {/* Botão "Entregar em outro endereço" (autenticado) */}
        {isAuthenticated && !showAddressForm && (
          <button
            type="button"
            onClick={() => {
              setShowAddressForm(true)
              setUseManualAddress(false)
            }}
            className={cn(
              'flex items-center gap-2.5 rounded-xl border p-3.5 text-left text-[13px] font-semibold transition-colors',
              showAddressForm
                ? 'border-store bg-store/[0.05] text-store-ink'
                : 'border-dashed border-nxborder text-nxi2 hover:border-nxi3',
            )}
          >
            <Plus size={16} />
            Entregar em outro endereço
          </button>
        )}

        {/* Guest: toggle para mostrar formulário */}
        {!isAuthenticated && !useManualAddress && (
          <button
            type="button"
            onClick={() => setUseManualAddress(true)}
            className="flex items-center gap-2.5 rounded-xl border border-dashed border-nxborder p-3.5 text-left text-[13px] font-semibold text-nxi2 transition-colors hover:border-nxi3"
          >
            <Plus size={16} />
            Entregar em outro endereço
          </button>
        )}

        {/* Formulário de endereço */}
        {showForm && addressFormContent}

        {/* Erro global de endereço */}
        {addressError && <p className="text-[11.5px] font-semibold text-nxd">{addressError}</p>}
      </div>
    </SectionCard>
  )
}
