'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from 'lucide-react'
import { ORDER_STATUS } from '@/types/order'
import { useUpdateOrderStatus } from '@/hooks/useUpdateOrderStatus'
import { STATUS_FLOW, STATUS_OPTIONS } from '@/lib/orderPanelUtils'

interface UpdateOrderStatusModalProps {
  orderId: number
  currentStatus: number
  orderNumber: string
}

export function UpdateOrderStatusModal({ orderId, currentStatus, orderNumber }: UpdateOrderStatusModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const allowedNext = STATUS_FLOW[currentStatus] ?? []
  const firstAllowed = allowedNext[0]
  const [selectedStatus, setSelectedStatus] = useState<number | null>(firstAllowed ?? currentStatus)
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus()

  const optionsToShow = useMemo(
    () => STATUS_OPTIONS.filter((opt) => allowedNext.includes(opt.value)),
    [allowedNext]
  )

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(firstAllowed ?? currentStatus)
    }
  }, [isOpen, currentStatus, firstAllowed])

  const getStatusIcon = (status: number) => {
    const statusInfo = ORDER_STATUS[status as keyof typeof ORDER_STATUS] || ORDER_STATUS[1]
    switch (statusInfo.icon) {
      case 'clock': return <Clock className="h-4 w-4" />
      case 'check-circle': return <CheckCircle className="h-4 w-4" />
      case 'truck': return <Truck className="h-4 w-4" />
      case 'x-circle': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: number) => {
    const statusInfo = ORDER_STATUS[status as keyof typeof ORDER_STATUS] || ORDER_STATUS[1]
    return statusInfo.color
  }

  const handleStatusUpdate = () => {
    if (selectedStatus === null) return
    updateStatus(
      { orderId, status: selectedStatus },
      {
        onSuccess: () => {
          setIsOpen(false)
        }
      }
    )
  }

  const isFinalStatus = allowedNext.length === 0
  const effectiveSelected = selectedStatus ?? currentStatus

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          Atualizar Status
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Atualizar Status do Pedido</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isFinalStatus ? (
            <p className="text-sm text-gray-600 py-2">
              Este pedido já está <strong>{ORDER_STATUS[currentStatus as keyof typeof ORDER_STATUS]?.label}</strong>. Não há próximo passo no fluxo.
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Próximo(s) passo(s) no fluxo:</p>
              {optionsToShow.map((option) => (
                <div
                  key={option.value}
                  className={`p-3 rounded-2xl border cursor-pointer transition-colors ${effectiveSelected === option.value
                    ? 'bg-primary'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => setSelectedStatus(option.value)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gray-100">
                      {getStatusIcon(option.value)}
                    </div>
                    <div className="flex-1">
                      <span className={`font-medium ${effectiveSelected === option.value ? 'text-primary-foreground' : 'text-gray-900'}`}>
                        {option.label}
                      </span>
                      <p className={`text-sm mt-0.5 ${effectiveSelected === option.value ? 'text-primary-foreground' : 'text-gray-600'}`}>
                        {option.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              Status atual:
              <span
                className={`ml-2 font-medium ${
                  getStatusColor(currentStatus) === 'yellow' ? 'text-yellow-700' :
                  getStatusColor(currentStatus) === 'blue' ? 'text-blue-700' :
                  getStatusColor(currentStatus) === 'purple' ? 'text-purple-700' :
                  getStatusColor(currentStatus) === 'green' ? 'text-green-700' :
                  'text-red-700'
                }`}
              >
                {ORDER_STATUS[currentStatus as keyof typeof ORDER_STATUS]?.label}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={isPending || isFinalStatus || selectedStatus === null || selectedStatus === currentStatus}
              className="flex-1"
            >
              {isPending ? 'Atualizando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
