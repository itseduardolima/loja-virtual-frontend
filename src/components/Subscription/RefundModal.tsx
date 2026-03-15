'use client'

import { AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRefundSubscription } from '@/hooks/useRefundSubscription'
import { formatPrice } from '@/lib/utils'

interface RefundModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planPrice: number
  daysRemaining: number
}

export function RefundModal({ open, onOpenChange, planPrice, daysRemaining }: RefundModalProps) {
  const { mutate: requestRefund, isPending } = useRefundSubscription()

  const handleConfirm = () => {
    requestRefund(undefined, {
      onSuccess: () => onOpenChange(false),
      onError: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-orange-500" />
            Solicitar Reembolso
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Aviso principal */}
          <div className="flex gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-orange-900">
                Esta ação não pode ser desfeita
              </p>
              <p className="text-sm text-orange-800">
                Ao confirmar, sua assinatura será cancelada imediatamente e o valor de{' '}
                <strong>{formatPrice(planPrice)}</strong> será devolvido para o método de pagamento original.
              </p>
            </div>
          </div>

          {/* Prazo restante */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
            <p>
              Você ainda tem{' '}
              <strong className="text-gray-900">
                {daysRemaining} dia{daysRemaining !== 1 ? 's' : ''}
              </strong>{' '}
              dentro da janela de reembolso de 7 dias.
            </p>
          </div>

          {/* Consequências */}
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              Acesso ao painel de vendedor será removido imediatamente.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              Sua loja e produtos serão desativados.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-0.5">•</span>
              O reembolso pode levar até 7 dias úteis dependendo do método de pagamento.
            </li>
          </ul>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleConfirm}
              disabled={isPending}
            >
              {isPending ? 'Processando...' : 'Confirmar Reembolso'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
