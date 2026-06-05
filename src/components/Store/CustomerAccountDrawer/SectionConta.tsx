'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, Lock, LogOut, BadgeCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { useCustomerProfile } from '@/hooks/useCustomerProfile'
import { updateCustomerProfileSchema } from '@/schemas'
import { UpdateCustomerProfileDto } from '@/types/customer'
import { UField } from './shared'

export function SectionConta({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const { user, setUser, logout } = useAuth()
  const { updateProfileAsync, isUpdating, fetchProfile } = useCustomerProfile()

  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [initialForm, setInitialForm] = useState({ name: '', email: '', phone: '' })
  const [dirty, setDirty] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({})

  useEffect(() => {
    if (!isOpen || !user) return
    let cancelled = false
    const loadProfile = async () => {
      try {
        const response = await fetchProfile()
        if (cancelled || !response?.data) return
        const loaded = {
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
        }
        setForm(loaded)
        setInitialForm(loaded)
      } catch {
        if (cancelled) return
        const loaded = {
          name: user.name || '',
          email: user.email || '',
          phone: '',
        }
        setForm(loaded)
        setInitialForm(loaded)
      }
    }
    loadProfile()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user])

  useEffect(() => {
    const isDirty =
      form.name !== initialForm.name ||
      form.email !== initialForm.email ||
      form.phone !== initialForm.phone
    setDirty(isDirty)
  }, [form, initialForm])

  const handleFieldChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleSave = async () => {
    const payload = { name: form.name, email: form.email, phone: form.phone }
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
          localStorage.setItem(
            'user-data',
            JSON.stringify({
              ...parsedUser,
              name: response.data.name || parsedUser.name,
              email: response.data.email || parsedUser.email,
            }),
          )
        }
      }
      const saved = {
        name: response?.data?.name || form.name,
        email: response?.data?.email || form.email,
        phone: form.phone,
      }
      setInitialForm(saved)
      setForm(saved)
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'inner' in err &&
        Array.isArray((err as { inner: unknown[] }).inner)
      ) {
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

  const handleCancel = () => {
    setForm(initialForm)
    setErrors({})
  }

  const handleLogout = () => {
    logout()
    onClose()
    router.push('/login')
  }

  const displayName = form.name.trim() || user?.name?.trim() || ''
  const initials = displayName
    ? displayName
        .split(' ')
        .slice(0, 2)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U'

  return (
    <div className="scrollbar-thin flex-1 overflow-y-auto px-6 py-1">
      {/* Avatar + nome */}
      <div className="mb-7 mt-5 flex flex-col items-center border-b border-nxborder pb-7 text-center">
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-nxp text-[24px] font-extrabold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.2)]">
          {initials}
        </div>
        <p className="mt-3.5 text-[19px] font-extrabold tracking-tight text-nxi1">
          {displayName || 'Cliente'}
        </p>
        <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-nxbg px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.06em] text-nxi2">
          <BadgeCheck size={12} className="text-nxs" />
          Cliente Nexo
        </span>
      </div>

      {/* Campos do formulário */}
      <div className="flex flex-col gap-6">
        <UField
          label="Nome completo"
          value={form.name}
          onChange={(v) => handleFieldChange('name', v)}
          icon={User}
          error={errors.name}
        />
        <UField
          label="E-mail"
          value={form.email}
          onChange={(v) => handleFieldChange('email', v)}
          type="email"
          icon={Mail}
          error={errors.email}
        />
        <UField
          label="Telefone / WhatsApp"
          value={form.phone}
          onChange={(v) => handleFieldChange('phone', v)}
          type="tel"
          icon={Phone}
          error={errors.phone}
        />
      </div>

      {/* Card Senha */}
      <div className="mt-8 flex items-center justify-between rounded-2xl border border-nxborder bg-white p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-nxbg text-nxi2">
            <Lock size={16} />
          </span>
          <div>
            <p className="text-[13px] font-bold text-nxi1">Senha</p>
            <p className="text-[11px] text-nxi3">Mantenha sua conta segura</p>
          </div>
        </div>
        <button
          disabled
          className="rounded-lg border border-nxborder px-3.5 py-2 text-[12px] font-bold text-nxi1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Alterar
        </button>
      </div>

      {/* Barra dirty */}
      {dirty && (
        <div className="ac-rise mt-7 flex gap-2.5">
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="h-12 flex-1 rounded-full bg-nxp text-[13.5px] font-bold text-white transition-transform active:scale-[0.99] disabled:opacity-60"
          >
            {isUpdating ? 'Salvando...' : 'Salvar alterações'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isUpdating}
            className="h-12 rounded-full border border-nxborder px-5 text-[13px] font-semibold text-nxi2 transition-colors hover:border-nxi3"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Sair da conta */}
      <button
        onClick={handleLogout}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-full border border-nxborder py-3 text-[13px] font-semibold text-nxi2 transition-colors hover:border-nxd hover:text-nxd"
      >
        <LogOut size={16} />
        Sair da conta
      </button>

      <div className="h-6" />
    </div>
  )
}
