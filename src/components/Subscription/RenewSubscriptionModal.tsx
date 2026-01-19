'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button, Input, Label } from '@/components'
import { CreditCard, QrCode, FileText, Loader2 } from 'lucide-react'
import { useRenewSubscription } from '@/hooks/useRenewSubscription'
import { BillingType } from '@/types/subscription'

interface RenewSubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planPrice: number
}

export function RenewSubscriptionModal({
  open,
  onOpenChange,
  planPrice,
}: RenewSubscriptionModalProps) {
  const [billingType, setBillingType] = useState<BillingType>('CREDIT_CARD')
  const [cpf, setCpf] = useState('')
  const [cnpj, setCnpj] = useState('')
  const { mutate: renewSubscription, isPending } = useRenewSubscription()

  const handleRenew = () => {
    const data: any = { billing_type: billingType }
    
    if (billingType === 'PIX' || billingType === 'BOLETO') {
      if (!cpf && !cnpj) {
        alert('Para pagamento via PIX ou BOLETO, é necessário informar CPF ou CNPJ')
        return
      }
      if (cpf) data.cpf = cpf
      if (cnpj) data.cnpj = cnpj
    }

    renewSubscription(data, {
      onSuccess: () => {
        onOpenChange(false)
        // Reset form
        setCpf('')
        setCnpj('')
        setBillingType('CREDIT_CARD')
      },
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Renovar Assinatura</DialogTitle>
          <DialogDescription>
            Escolha o método de pagamento para renovar sua assinatura
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Valor */}
          <div className="text-center py-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Valor da Assinatura</p>
            <p className="text-3xl font-bold text-primary">{formatPrice(planPrice)}</p>
            <p className="text-sm text-gray-500 mt-1">por mês</p>
          </div>

          {/* Métodos de Pagamento */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Método de Pagamento</Label>
            
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setBillingType('CREDIT_CARD')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  billingType === 'CREDIT_CARD'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className={`w-6 h-6 mx-auto mb-2 ${
                  billingType === 'CREDIT_CARD' ? 'text-primary' : 'text-gray-400'
                }`} />
                <p className={`text-xs font-medium ${
                  billingType === 'CREDIT_CARD' ? 'text-primary' : 'text-gray-600'
                }`}>
                  Cartão
                </p>
              </button>

              <button
                type="button"
                onClick={() => setBillingType('PIX')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  billingType === 'PIX'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <QrCode className={`w-6 h-6 mx-auto mb-2 ${
                  billingType === 'PIX' ? 'text-primary' : 'text-gray-400'
                }`} />
                <p className={`text-xs font-medium ${
                  billingType === 'PIX' ? 'text-primary' : 'text-gray-600'
                }`}>
                  PIX
                </p>
              </button>

              <button
                type="button"
                onClick={() => setBillingType('BOLETO')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  billingType === 'BOLETO'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FileText className={`w-6 h-6 mx-auto mb-2 ${
                  billingType === 'BOLETO' ? 'text-primary' : 'text-gray-400'
                }`} />
                <p className={`text-xs font-medium ${
                  billingType === 'BOLETO' ? 'text-primary' : 'text-gray-600'
                }`}>
                  Boleto
                </p>
              </button>
            </div>
          </div>

          {/* CPF/CNPJ para PIX e BOLETO */}
          {(billingType === 'PIX' || billingType === 'BOLETO') && (
            <div className="space-y-4 pt-4 border-t">
              <div>
                <Label htmlFor="cpf">CPF (opcional se informar CNPJ)</Label>
                <Input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  disabled={isPending}
                  maxLength={14}
                />
              </div>
              
              <div>
                <Label htmlFor="cnpj">CNPJ (opcional se informar CPF)</Label>
                <Input
                  id="cnpj"
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  disabled={isPending}
                  maxLength={18}
                />
              </div>

              <p className="text-xs text-gray-500">
                * Para pagamento via {billingType === 'PIX' ? 'PIX' : 'Boleto'}, é obrigatório informar CPF ou CNPJ
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleRenew}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              'Renovar Assinatura'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

