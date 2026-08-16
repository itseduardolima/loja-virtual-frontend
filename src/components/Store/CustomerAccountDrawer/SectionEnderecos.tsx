'use client'

import { useRef, useState } from 'react'
import { Briefcase, Check, ChevronLeft, Home, MapPin, Pencil, Plus, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useAddresses, type Address, type CreateAddressData } from '@/hooks/useAddresses'
import { Empty, SectionSpinner } from './shared'

/* ─── Constante de form vazio ───────────────────────────────────────────── */

const emptyAddressForm: CreateAddressData = {
  label: '',
  name: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zipcode: '',
  is_default: 0,
}

/* ─── Ícone de rótulo ───────────────────────────────────────────────────── */

function LabelIcon({ label }: { label?: string }) {
  if (label === 'Casa') return <Home size={15} />
  if (label === 'Trabalho') return <Briefcase size={15} />
  return <MapPin size={15} />
}

/* ─── Input boxed reutilizável ──────────────────────────────────────────── */

function BoxInput({
  label,
  required,
  colSpan = 1,
  children,
}: {
  label: string
  required?: boolean
  colSpan?: 1 | 2
  children: React.ReactNode
}) {
  return (
    <div className={cn(colSpan === 2 ? 'col-span-2' : 'col-span-1')}>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.06em] text-nxi3">
        {label}
        {required && ' *'}
      </label>
      {children}
    </div>
  )
}

const inputCls = (filled?: boolean) =>
  cn(
    'h-11 w-full rounded-xl border border-nxborder bg-white px-3.5 text-[13.5px] text-nxi1 placeholder:text-nxi3',
    'focus:border-store focus:outline-none focus:ring-2 focus:ring-store/15',
    filled && 'bg-nxs/[0.04]',
  )

/* ─── Componente principal ──────────────────────────────────────────────── */

export function SectionEnderecos({ isOpen }: { isOpen: boolean }) {
  const { isAuthenticated } = useAuth()
  const {
    addresses,
    isLoading,
    createAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
    isCreating,
    isUpdating,
  } = useAddresses(isAuthenticated && isOpen)

  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<CreateAddressData>(emptyAddressForm)
  const [isFetchingCep, setIsFetchingCep] = useState(false)
  const [cepError, setCepError] = useState('')
  const [filled, setFilled] = useState(false)
  const numberInputRef = useRef<HTMLInputElement>(null)

  /* ── Handlers ─────────────────────────────────────────────────────────── */

  const handleEdit = (addr: Address) => {
    setEditId(addr.id)
    setForm({
      label: addr.label ?? '',
      name: addr.name,
      street: addr.street,
      number: addr.number ?? '',
      complement: addr.complement ?? '',
      neighborhood: addr.neighborhood ?? '',
      city: addr.city,
      state: addr.state,
      zipcode: addr.zipcode,
      is_default: addr.is_default,
    })
    setCepError('')
    setFilled(false)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.street || !form.city || !form.state || !form.zipcode) return
    if (editId) {
      await updateAddress({ id: editId, data: form })
    } else {
      await createAddress(form)
    }
    setShowForm(false)
    setEditId(null)
    setForm(emptyAddressForm)
    setCepError('')
    setFilled(false)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditId(null)
    setForm(emptyAddressForm)
    setCepError('')
    setFilled(false)
  }

  const handleZipcodeChange = async (value: string) => {
    const formatted = value.slice(0, 9)
    setForm((p) => ({ ...p, zipcode: formatted }))
    setCepError('')
    setFilled(false)

    const digits = formatted.replace(/\D/g, '')
    if (digits.length === 8) {
      setIsFetchingCep(true)
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
        const data = await res.json()
        if (data.erro) {
          setCepError('CEP não encontrado')
        } else {
          setForm((p) => ({
            ...p,
            zipcode: formatted,
            street: data.logradouro || p.street,
            neighborhood: data.bairro || p.neighborhood,
            city: data.localidade || p.city,
            state: data.uf || p.state,
          }))
          setFilled(true)
          setTimeout(() => numberInputRef.current?.focus(), 50)
        }
      } catch {
        setCepError('Erro ao consultar o CEP')
      } finally {
        setIsFetchingCep(false)
      }
    }
  }

  /* ── Estado de loading ────────────────────────────────────────────────── */

  if (isLoading) {
    return <SectionSpinner />
  }

  /* ── Empty state (sem endereços e sem form aberto) ────────────────────── */

  if (!showForm && addresses.length === 0) {
    return (
      <Empty
        icon={MapPin}
        title="Nenhum endereço salvo"
        desc="Cadastre um endereço para agilizar suas próximas compras."
        cta="Adicionar endereço"
        onCta={() => {
          setForm(emptyAddressForm)
          setEditId(null)
          setCepError('')
          setFilled(false)
          setShowForm(true)
        }}
      />
    )
  }

  /* ── Wrapper comum ────────────────────────────────────────────────────── */

  return (
    <div className="scrollbar-thin flex-1 overflow-y-auto p-5">
      {/* ── Formulário (novo / editar) ─────────────────────────────────── */}
      {showForm ? (
        <div className="ac-slide">
          {/* Voltar */}
          <button
            type="button"
            onClick={handleCancel}
            className="mb-4 flex items-center gap-1.5 text-[12.5px] font-semibold text-nxi2 hover:text-store"
          >
            <ChevronLeft size={16} />
            Voltar
          </button>

          {/* Título */}
          <p className="mb-4 text-[15px] font-extrabold tracking-tight text-nxi1">
            {editId ? 'Editar endereço' : 'Novo endereço'}
          </p>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
            {/* CEP */}
            <BoxInput label="CEP" required colSpan={1}>
              <div className="relative">
                <input
                  type="text"
                  value={form.zipcode}
                  onChange={(e) => handleZipcodeChange(e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                  required
                  className={inputCls()}
                />
                {isFetchingCep && (
                  <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-nxi3 border-t-transparent" />
                )}
                {filled && !isFetchingCep && (
                  <Check size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-nxs" />
                )}
              </div>
              {cepError && <p className="mt-1 text-[11px] text-nxd">{cepError}</p>}
            </BoxInput>

            {/* Rótulo */}
            <BoxInput label="Rótulo" colSpan={1}>
              <input
                type="text"
                value={form.label ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, label: e.target.value.slice(0, 30) }))}
                placeholder="Casa, Trabalho..."
                maxLength={30}
                className={inputCls()}
              />
            </BoxInput>

            {/* Nome do destinatário — col-span-2, API exige, design omitiu */}
            <BoxInput label="Nome do destinatário" required colSpan={2}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value.slice(0, 80) }))}
                placeholder="Nome completo"
                maxLength={80}
                required
                className={inputCls()}
              />
            </BoxInput>

            {/* Logradouro */}
            <BoxInput label="Logradouro" required colSpan={2}>
              <input
                type="text"
                value={form.street}
                onChange={(e) => setForm((p) => ({ ...p, street: e.target.value.slice(0, 100) }))}
                placeholder="Rua, avenida…"
                maxLength={100}
                required
                className={inputCls(filled)}
              />
            </BoxInput>

            {/* Número */}
            <BoxInput label="Número" colSpan={1}>
              <input
                ref={numberInputRef}
                type="text"
                value={form.number ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, number: e.target.value.slice(0, 10) }))}
                placeholder="123"
                maxLength={10}
                className={inputCls()}
              />
            </BoxInput>

            {/* Complemento */}
            <BoxInput label="Complemento" colSpan={1}>
              <input
                type="text"
                value={form.complement ?? ''}
                onChange={(e) =>
                  setForm((p) => ({ ...p, complement: e.target.value.slice(0, 50) }))
                }
                placeholder="Apto, bloco…"
                maxLength={50}
                className={inputCls()}
              />
            </BoxInput>

            {/* Bairro */}
            <BoxInput label="Bairro" colSpan={2}>
              <input
                type="text"
                value={form.neighborhood ?? ''}
                onChange={(e) =>
                  setForm((p) => ({ ...p, neighborhood: e.target.value.slice(0, 60) }))
                }
                placeholder="Bairro"
                maxLength={60}
                className={inputCls(filled)}
              />
            </BoxInput>

            {/* Cidade */}
            <BoxInput label="Cidade" required colSpan={1}>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm((p) => ({ ...p, city: e.target.value.slice(0, 60) }))}
                placeholder="São Paulo"
                maxLength={60}
                required
                className={inputCls(filled)}
              />
            </BoxInput>

            {/* UF */}
            <BoxInput label="UF" required colSpan={1}>
              <input
                type="text"
                value={form.state}
                onChange={(e) =>
                  setForm((p) => ({ ...p, state: e.target.value.toUpperCase().slice(0, 2) }))
                }
                placeholder="SP"
                maxLength={2}
                required
                className={inputCls(filled)}
              />
            </BoxInput>

            {/* Checkbox padrão — col-span-2 */}
            <label className="col-span-2 mt-3 flex items-center gap-2 text-[12.5px] font-semibold text-nxi2">
              <input
                type="checkbox"
                className="h-4 w-4 accent-store"
                checked={form.is_default === 1}
                onChange={(e) => setForm((p) => ({ ...p, is_default: e.target.checked ? 1 : 0 }))}
              />
              Definir como endereço padrão
            </label>

            {/* Submit — col-span-2 */}
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="col-span-2 mt-5 h-12 w-full rounded-full bg-store text-[13.5px] font-bold text-white transition-transform active:scale-[0.99] disabled:opacity-60"
            >
              {isCreating || isUpdating ? 'Salvando...' : 'Salvar endereço'}
            </button>
          </form>

          <div className="h-2" />
        </div>
      ) : (
        /* ── Lista de endereços ─────────────────────────────────────────── */
        <>
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={cn(
                  'ac-rise rounded-2xl border bg-white p-4',
                  addr.is_default === 1 ? 'border-store/40' : 'border-nxborder',
                )}
              >
                {/* Topo */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Chip ícone */}
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-store/[0.08] text-store">
                      <LabelIcon label={addr.label} />
                    </span>

                    <div>
                      {/* Rótulo + badge Padrão */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12.5px] font-extrabold text-nxi1">
                          {addr.label || addr.name}
                        </span>
                        {addr.is_default === 1 && (
                          <span className="inline-flex rounded-full bg-store/10 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.03em] text-store">
                            Padrão
                          </span>
                        )}
                      </div>
                      {/* Nome */}
                      <p className="text-[11px] text-nxi3">{addr.name}</p>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(addr)}
                      title="Editar"
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-nxi3 transition-colors hover:bg-nxbg hover:text-store"
                    >
                      <Pencil size={14} />
                    </button>
                    {/* Excluir oculto no endereço padrão */}
                    {addr.is_default !== 1 && (
                      <button
                        type="button"
                        onClick={() => removeAddress(addr.id)}
                        title="Excluir"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-nxi3 transition-colors hover:bg-nxd/10 hover:text-nxd"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Endereço */}
                <p className="mt-2.5 text-[12.5px] leading-relaxed text-nxi2">
                  {addr.street}, {addr.number}
                  {addr.complement ? ` — ${addr.complement}` : ''}
                  <br />
                  {[addr.neighborhood, `${addr.city} - ${addr.state}`, addr.zipcode]
                    .filter(Boolean)
                    .join(', ')}
                </p>

                {/* Tornar padrão — só nos não-padrão */}
                {addr.is_default !== 1 && (
                  <button
                    type="button"
                    onClick={() => setDefaultAddress(addr.id)}
                    className="mt-2.5 text-[11.5px] font-bold text-store hover:underline"
                  >
                    Tornar padrão
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Botão adicionar */}
          <button
            type="button"
            onClick={() => {
              setForm(emptyAddressForm)
              setEditId(null)
              setCepError('')
              setFilled(false)
              setShowForm(true)
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-nxborder py-3.5 text-[13px] font-bold text-nxi2 transition-colors hover:border-store hover:text-store"
          >
            <Plus size={16} />
            Adicionar endereço
          </button>

          <div className="h-2" />
        </>
      )}
    </div>
  )
}
