'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCheckout } from '@/hooks/useCheckout'
import { useAuth } from '@/contexts/AuthContext'
import { CreditCard, User, Mail, MessageSquare, Phone } from 'lucide-react'

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
  
  // Buscar dados do usuário do contexto ou localStorage
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

  const userData = getUserData()
  
  const [formData, setFormData] = useState({
    customer_name: userData?.name || '',
    customer_email: userData?.email || '',
    customer_phone: '',
    notes: ''
  })

  // Atualizar dados quando o modal abrir ou o usuário mudar
  useEffect(() => {
    if (isOpen) {
      const currentUserData = getUserData()
      setFormData({
        customer_name: currentUserData?.name || '',
        customer_email: currentUserData?.email || '',
        customer_phone: '',
        notes: ''
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customer_name.trim() || !formData.customer_email.trim() || !formData.customer_phone.trim()) {
      return
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
    const currentUserData = getUserData()
    setFormData({
      customer_name: currentUserData?.name || '',
      customer_email: currentUserData?.email || '',
      customer_phone: '',
      notes: ''
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Finalizar Pedido
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome do Cliente */}
          <div className="space-y-2">
            <Label htmlFor="customer_name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nome Completo *
            </Label>
            <Input
              id="customer_name"
              type="text"
              value={formData.customer_name}
              onChange={(e) => handleInputChange('customer_name', e.target.value)}
              placeholder="Digite seu nome completo"
              required
              disabled
              className="w-full bg-gray-100"
            />
          </div>

          {/* Email do Cliente */}
          <div className="space-y-2">
            <Label htmlFor="customer_email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email *
            </Label>
            <Input
              id="customer_email"
              type="email"
              value={formData.customer_email}
              onChange={(e) => handleInputChange('customer_email', e.target.value)}
              placeholder="Digite seu email"
              required
              disabled
              className="w-full bg-gray-100"
            />
          </div>

          {/* Telefone do Cliente */}
          <div className="space-y-2">
            <Label htmlFor="customer_phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Telefone *
            </Label>
            <Input
              id="customer_phone"
              type="tel"
              value={formData.customer_phone}
              onChange={(e) => handleInputChange('customer_phone', e.target.value)}
              placeholder="(11) 99999-9999"
              required
              className="w-full"
            />
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
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
