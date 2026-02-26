'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { useCustomerProfile } from '@/hooks/useCustomerProfile'
import { UpdateCustomerProfileDto } from '@/types/customer'
import { updateCustomerProfileSchema } from '@/schemas'
import { LoadingSpinner } from '../Layout/LoadingSpinner'

interface UpdateProfileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function UpdateProfileDrawer({ isOpen, onClose }: UpdateProfileDrawerProps) {
  const { user, setUser } = useAuth()
  const { updateProfileAsync, isUpdating, fetchProfile, isLoadingProfile } = useCustomerProfile()
  const [formData, setFormData] = useState<UpdateCustomerProfileDto>({
    name: '',
    email: '',
    phone: '',
    address_street: '',
    address_city: '',
    address_state: '',
    address_zipcode: '',
    address_country: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Carregar dados do perfil só quando o drawer abrir (evita refetch a cada re-render do header)
  useEffect(() => {
    if (!isOpen || !user) return
    let cancelled = false
    const loadProfile = async () => {
      try {
        const response = await fetchProfile()
        if (cancelled || !response?.data) return
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address_street: response.data.address_street || '',
          address_city: response.data.address_city || '',
          address_state: response.data.address_state || '',
          address_zipcode: response.data.address_zipcode || '',
          address_country: response.data.address_country || 'Brasil'
        })
      } catch (error) {
        if (cancelled) return
        console.error('Erro ao carregar perfil:', error)
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: '',
          address_street: '',
          address_city: '',
          address_state: '',
          address_zipcode: '',
          address_country: 'Brasil'
        })
      }
    }
    loadProfile()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch só ao abrir; fetchProfile não deve re-disparar o efeito
  }, [isOpen, user])

  const handleInputChange = (field: keyof UpdateCustomerProfileDto, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const canSubmit =
    (formData.name?.trim() ?? '').length > 0 &&
    (formData.email?.trim() ?? '').length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      name: formData.name ?? '',
      email: formData.email ?? '',
      phone: formData.phone ?? '',
      address_street: formData.address_street ?? '',
      address_city: formData.address_city ?? '',
      address_state: formData.address_state ?? '',
      address_zipcode: formData.address_zipcode ?? '',
      address_country: formData.address_country ?? '',
    }

    try {
      const validated = await updateCustomerProfileSchema.validate(payload, {
        abortEarly: false,
      })
      setErrors({})
      const dataToSend: UpdateCustomerProfileDto = {
        name: validated.name.trim(),
        email: validated.email.trim(),
      }
      if (validated.phone && validated.phone.trim()) {
        dataToSend.phone = validated.phone.trim().replace(/[^\d+]/g, '')
      }
      if (validated.address_street?.trim()) dataToSend.address_street = validated.address_street.trim()
      if (validated.address_city?.trim()) dataToSend.address_city = validated.address_city.trim()
      if (validated.address_state?.trim()) dataToSend.address_state = validated.address_state.trim()
      if (validated.address_zipcode?.trim()) dataToSend.address_zipcode = validated.address_zipcode.trim().replace(/\D/g, '')
      if (validated.address_country?.trim()) dataToSend.address_country = validated.address_country.trim()

      const response = await updateProfileAsync(dataToSend)
      if (response?.data && user) {
        setUser({
          ...user,
          name: response.data.name || user.name,
          email: response.data.email || user.email
        })
        const userData = localStorage.getItem('user-data')
        if (userData) {
          const parsedUser = JSON.parse(userData)
          const updatedUser = {
            ...parsedUser,
            name: response.data.name || parsedUser.name,
            email: response.data.email || parsedUser.email
          }
          localStorage.setItem('user-data', JSON.stringify(updatedUser))
        }
      }
      onClose()
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'inner' in err && Array.isArray((err as { inner: unknown[] }).inner)) {
        const validationErrors: Record<string, string> = {}
        ;(err as { inner: Array<{ path?: string; message: string }> }).inner.forEach((e) => {
          if (e.path) validationErrors[e.path] = e.message
        })
        setErrors(validationErrors)
        const firstMessage = (err as { inner: Array<{ message: string }> }).inner[0]?.message
        if (firstMessage) toast.error(firstMessage)
      }
      // Erros da API são exibidos no toast pelo hook useCustomerProfile
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Atualizar Cadastro</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {isLoadingProfile ? (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações Pessoais */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-gray-900">Informações Pessoais</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Seu nome completo"
                        required
                        className={errors.name ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="seu@email.com"
                        required
                        className={errors.email ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="5511999999999"
                        className={errors.phone ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-base font-semibold text-gray-900">Endereço</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address_zipcode">CEP</Label>
                      <Input
                        id="address_zipcode"
                        value={formData.address_zipcode}
                        onChange={(e) => handleInputChange('address_zipcode', e.target.value)}
                        placeholder="12345-678"
                        className={errors.address_zipcode ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                      {errors.address_zipcode && (
                        <p className="mt-1 text-sm text-red-600">{errors.address_zipcode}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="address_country">País</Label>
                      <Input
                        id="address_country"
                        value={formData.address_country}
                        onChange={(e) => handleInputChange('address_country', e.target.value)}
                        placeholder="Brasil"
                        className={errors.address_country ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                      {errors.address_country && (
                        <p className="mt-1 text-sm text-red-600">{errors.address_country}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address_street">Rua/Endereço</Label>
                      <Input
                        id="address_street"
                        value={formData.address_street}
                        onChange={(e) => handleInputChange('address_street', e.target.value)}
                        placeholder="Rua, número, complemento"
                        className={errors.address_street ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                      {errors.address_street && (
                        <p className="mt-1 text-sm text-red-600">{errors.address_street}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="address_city">Cidade</Label>
                      <Input
                        id="address_city"
                        value={formData.address_city}
                        onChange={(e) => handleInputChange('address_city', e.target.value)}
                        placeholder="Cidade"
                        className={errors.address_city ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                      {errors.address_city && (
                        <p className="mt-1 text-sm text-red-600">{errors.address_city}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="address_state">Estado (UF)</Label>
                      <Input
                        id="address_state"
                        value={formData.address_state}
                        onChange={(e) => handleInputChange('address_state', e.target.value.toUpperCase())}
                        placeholder="SP"
                        maxLength={2}
                        className={errors.address_state ? 'border-red-500 focus:ring-red-500' : ''}
                      />
                      {errors.address_state && (
                        <p className="mt-1 text-sm text-red-600">{errors.address_state}</p>
                      )}
                    </div>


                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={isUpdating}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isUpdating || !canSubmit}
                  >
                    {isUpdating ? (
                      <>
                        <LoadingSpinner className="mr-2" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Alterações'
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

