'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { SidebarCliente } from '@/components/Layout/SidebarCliente'
import { UserHeaderCliente } from '@/components/Layout/UserHeaderCliente'
import { useAddresses, CreateAddressData, Address } from '@/hooks/useAddresses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { MapPin, Plus, Pencil, Trash2, Star } from 'lucide-react'

const emptyForm: CreateAddressData = {
  label: '',
  name: '',
  phone: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zipcode: '',
  is_default: 0,
}

export default function EnderecosPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { addresses, isLoading, createAddress, updateAddress, removeAddress, setDefaultAddress, isCreating, isUpdating } = useAddresses(isAuthenticated)

  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<CreateAddressData>(emptyForm)

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" /></div>
  }

  if (!isAuthenticated) {
    router.replace('/login?redirect=/cliente/enderecos')
    return null
  }

  const handleEdit = (addr: Address) => {
    setEditId(addr.id)
    setForm({
      label: addr.label ?? '',
      name: addr.name,
      phone: addr.phone ?? '',
      street: addr.street,
      number: addr.number ?? '',
      complement: addr.complement ?? '',
      neighborhood: addr.neighborhood ?? '',
      city: addr.city,
      state: addr.state,
      zipcode: addr.zipcode,
      is_default: addr.is_default,
    })
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
    setForm(emptyForm)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditId(null)
    setForm(emptyForm)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeaderCliente />
      <div className="flex">
        <SidebarCliente currentPath="/cliente/enderecos" />
        <main className="flex-1 p-6 max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Meus Endereços</h1>
              <p className="text-sm text-gray-500 mt-1">Gerencie seus endereços de entrega</p>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" /> Novo Endereço
              </Button>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
              <h2 className="font-bold text-gray-900 mb-4">{editId ? 'Editar Endereço' : 'Novo Endereço'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label>Rótulo (ex: Casa, Trabalho)</Label>
                    <Input value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} placeholder="Casa" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Nome do destinatário *</Label>
                    <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Nome completo" required />
                  </div>
                  <div>
                    <Label>Telefone de contato</Label>
                    <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="(11) 99999-9999" />
                  </div>
                  <div>
                    <Label>CEP *</Label>
                    <Input value={form.zipcode} onChange={e => setForm(p => ({ ...p, zipcode: e.target.value }))} placeholder="00000-000" required />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Logradouro *</Label>
                    <Input value={form.street} onChange={e => setForm(p => ({ ...p, street: e.target.value }))} placeholder="Rua, Avenida..." required />
                  </div>
                  <div>
                    <Label>Número</Label>
                    <Input value={form.number} onChange={e => setForm(p => ({ ...p, number: e.target.value }))} placeholder="123" />
                  </div>
                  <div>
                    <Label>Complemento</Label>
                    <Input value={form.complement} onChange={e => setForm(p => ({ ...p, complement: e.target.value }))} placeholder="Apto 4B" />
                  </div>
                  <div>
                    <Label>Bairro</Label>
                    <Input value={form.neighborhood} onChange={e => setForm(p => ({ ...p, neighborhood: e.target.value }))} placeholder="Bairro" />
                  </div>
                  <div>
                    <Label>Cidade *</Label>
                    <Input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} placeholder="São Paulo" required />
                  </div>
                  <div>
                    <Label>UF *</Label>
                    <Input value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value.toUpperCase().slice(0, 2) }))} placeholder="SP" maxLength={2} required />
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_default"
                      checked={form.is_default === 1}
                      onChange={e => setForm(p => ({ ...p, is_default: e.target.checked ? 1 : 0 }))}
                      className="rounded"
                    />
                    <label htmlFor="is_default" className="text-sm text-gray-700">Definir como endereço padrão</label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isCreating || isUpdating}>
                    {editId ? 'Salvar alterações' : 'Salvar endereço'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
                </div>
              </form>
            </div>
          )}

          {/* List */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Nenhum endereço salvo</h3>
              <p className="text-sm text-gray-500">Salve endereços para agilizar seus próximos pedidos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map(addr => (
                <div key={addr.id} className={`bg-white border rounded-xl p-4 flex items-start justify-between gap-3 ${addr.is_default === 1 ? 'border-gray-900' : 'border-gray-200'}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {addr.label && <span className="text-xs font-semibold text-gray-500 uppercase">{addr.label}</span>}
                      <span className="font-medium text-gray-900">{addr.name}</span>
                      {addr.is_default === 1 && <Badge variant="default" className="text-xs">Padrão</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">
                      {addr.street}{addr.number ? `, ${addr.number}` : ''}{addr.complement ? ` - ${addr.complement}` : ''}
                    </p>
                    <p className="text-sm text-gray-600">
                      {addr.neighborhood ? `${addr.neighborhood}, ` : ''}{addr.city} - {addr.state}, {addr.zipcode}
                    </p>
                    {addr.phone && <p className="text-xs text-gray-500 mt-1">{addr.phone}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {addr.is_default !== 1 && (
                      <Button size="sm" variant="ghost" title="Tornar padrão" onClick={() => setDefaultAddress(addr.id)}>
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(addr)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeAddress(addr.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
