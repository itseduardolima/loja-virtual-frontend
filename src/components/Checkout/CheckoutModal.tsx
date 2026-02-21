'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCheckout } from '@/hooks/useCheckout'
import { useAuth } from '@/contexts/AuthContext'
import { useCustomerProfile } from '@/hooks/useCustomerProfile'
import { checkoutFormSchema } from '@/schemas/checkoutSchemas'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  sessionId: string
  storeId: number
  storeSlug?: string
  totalPrice: number
}

export function CheckoutModal({ isOpen, onClose, sessionId, storeId, storeSlug, totalPrice }: CheckoutModalProps) {
  const { checkout, isCheckoutLoading } = useCheckout()
  const { user } = useAuth()
  const { fetchProfile } = useCustomerProfile()

  const getUserData = () => {
    if (user) return user
    const userDataStr = localStorage.getItem('user-data')
    if (userDataStr) {
      try {
        return JSON.parse(userDataStr)
      } catch {
        return null
      }
    }
    return null
  }

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    notes: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isOpen) return
    const fallback = getUserData()
    setFormData(prev => ({
      ...prev,
      customer_name: fallback?.name || prev.customer_name || '',
      customer_email: fallback?.email || prev.customer_email || '',
      customer_phone: prev.customer_phone || '',
      notes: prev.notes || ''
    }))
    fetchProfile()
      .then((res) => {
        const data = res?.data
        if (data) {
          setFormData(prev => ({
            ...prev,
            customer_name: data.name || prev.customer_name,
            customer_email: data.email || prev.customer_email,
            customer_phone: data.phone || prev.customer_phone
          }))
        }
      })
      .catch(() => { })
  }, [isOpen, user])

  const handleInputChange = (field: string, value: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    try {
      await checkoutFormSchema.validate(formData, { abortEarly: false })
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'inner' in err) {
        const yupErr = err as { inner: Array<{ path?: string; message?: string }> }
        const next: Record<string, string> = {}
        for (const e of yupErr.inner || []) {
          if (e.path && e.message) next[e.path] = e.message
        }
        setErrors(next)
        return
      }
    }

    await checkout(sessionId, storeId, {
      customer_name: formData.customer_name.trim(),
      customer_email: formData.customer_email.trim(),
      customer_phone: formData.customer_phone.trim(),
      notes: formData.notes.trim() || undefined
    }, storeSlug)

    onClose()
  }

  const handleClose = () => {
    setFormData({
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      notes: ''
    })
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">

            Finalizar Pedido
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome do Cliente */}
          <div className="space-y-2">
            <Label htmlFor="customer_name" className="flex items-center gap-2">
              Nome Completo *
            </Label>
            <Input
              id="customer_name"
              type="text"
              value={formData.customer_name}
              onChange={(e) => handleInputChange('customer_name', e.target.value)}
              placeholder="Digite seu nome completo"
              required
              className={`w-full ${errors.customer_name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              aria-invalid={!!errors.customer_name}
              aria-describedby={errors.customer_name ? 'customer_name_error' : undefined}
            />
            {errors.customer_name && (
              <p id="customer_name_error" className="text-sm text-red-600">
                {errors.customer_name}
              </p>
            )}
          </div>

          {/* Email do Cliente */}
          <div className="space-y-2">
            <Label htmlFor="customer_email" className="flex items-center gap-2">
              Email *
            </Label>
            <Input
              id="customer_email"
              type="email"
              value={formData.customer_email}
              onChange={(e) => handleInputChange('customer_email', e.target.value)}
              placeholder="Digite seu email"
              required
              className={`w-full ${errors.customer_email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              aria-invalid={!!errors.customer_email}
              aria-describedby={errors.customer_email ? 'customer_email_error' : undefined}
            />
            {errors.customer_email && (
              <p id="customer_email_error" className="text-sm text-red-600">
                {errors.customer_email}
              </p>
            )}
          </div>

          {/* Telefone do Cliente */}
          <div className="space-y-2">
            <Label htmlFor="customer_phone" className="flex items-center gap-2">
              WhatsApp *
            </Label>
            <Input
              id="customer_phone"
              type="tel"
              value={formData.customer_phone}
              onChange={(e) => handleInputChange('customer_phone', e.target.value)}
              placeholder="Digite seu WhatsApp"
              required
              className={`w-full ${errors.customer_phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              aria-invalid={!!errors.customer_phone}
              aria-describedby={errors.customer_phone ? 'customer_phone_error' : undefined}
            />
            {errors.customer_phone && (
              <p id="customer_phone_error" className="text-sm text-red-600">
                {errors.customer_phone}
              </p>
            )}
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">

              Observações (opcional)
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Alguma observação sobre o pedido?"
              rows={3}
              className="w-full resize-none"
            />
          </div>

          {/* Total */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">
                Total do Pedido:
              </span>
              <span className="text-xl font-bold text-green-600">
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isCheckoutLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isCheckoutLoading || !formData.customer_name.trim() || !formData.customer_email.trim() || !formData.customer_phone.trim()}
            >
              {isCheckoutLoading ? 'Processando...' : 'Finalizar Pedido'}
            </Button>
          </div>
        </form>

        {/* Informação sobre WhatsApp */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
          <p className="text-sm text-blue-800">
            <strong>Importante:</strong> Após finalizar o pedido, você será redirecionado para o WhatsApp
            do vendedor para confirmar e finalizar a compra.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
