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
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

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
        })
      } catch {
        if (cancelled) return
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: '',
        })
      }
    }
    loadProfile()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user])

  const handleInputChange = (field: keyof UpdateCustomerProfileDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
    }

    try {
      const validated = await updateCustomerProfileSchema.validate(payload, { abortEarly: false })
      setErrors({})

      const dataToSend: UpdateCustomerProfileDto = {
        name: validated.name.trim(),
        email: validated.email.trim(),
      }
      if (validated.phone?.trim()) {
        dataToSend.phone = validated.phone.trim().replace(/[^\d+]/g, '')
      }

      const response = await updateProfileAsync(dataToSend)
      if (response?.data && user) {
        setUser({
          ...user,
          name: response.data.name || user.name,
          email: response.data.email || user.email,
        })
        const userData = localStorage.getItem('user-data')
        if (userData) {
          const parsedUser = JSON.parse(userData)
          localStorage.setItem('user-data', JSON.stringify({
            ...parsedUser,
            name: response.data.name || parsedUser.name,
            email: response.data.email || parsedUser.email,
          }))
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
    }
  }

  const initials = user?.name
    ? user.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : 'U'

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EBE3]">
            <h2 className="text-[15px] font-semibold text-[#1C1008]">Atualizar Cadastro</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 text-[#7C6B5C] hover:bg-[#F7F3EF] hover:text-[#1C1008]">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {isLoadingProfile ? (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f5e8f0] to-[#d4a8c8] flex items-center justify-center text-xl font-semibold text-[#5a2040] italic mb-3">
                    {initials}
                  </div>
                  {user?.name && (
                    <p className="text-[14px] font-semibold text-[#1C1008]">{user.name}</p>
                  )}
                  {user?.email && (
                    <p className="text-[12px] text-[#A8998A]">{user.email}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#A8998A] mb-4">Informações Pessoais</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Seu nome completo"
                        required
                        className={errors.name ? 'border-red-500 focus:ring-red-500' : 'border-[#F0EBE3] focus:border-[#5A3C1E] focus:ring-0'}
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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
                        className={errors.email ? 'border-red-500 focus:ring-red-500' : 'border-[#F0EBE3] focus:border-[#5A3C1E] focus:ring-0'}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="5511999999999"
                        className={errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-[#F0EBE3] focus:border-[#5A3C1E] focus:ring-0'}
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-[#F0EBE3]">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1 border-[#F0EBE3] text-[#7C6B5C] hover:bg-[#F7F3EF] hover:text-[#1C1008]"
                    disabled={isUpdating}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#1C1008] hover:bg-[#5A3C1E] text-white"
                    disabled={isUpdating || !canSubmit}
                  >
                    {isUpdating ? (
                      <><LoadingSpinner className="mr-2" />Salvando...</>
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
