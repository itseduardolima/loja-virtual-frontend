'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Edit3
} from 'lucide-react'
import { ORDER_STATUS } from '@/types/order'
import { useUpdateOrderStatus } from '@/hooks/useUpdateOrderStatus'

interface UpdateOrderStatusModalProps {
  orderId: number
  currentStatus: number
  orderNumber: string
}

export function UpdateOrderStatusModal({ orderId, currentStatus, orderNumber }: UpdateOrderStatusModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState(currentStatus)
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus()

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
    updateStatus(
      { orderId, status: selectedStatus },
      {
        onSuccess: () => {
          setIsOpen(false)
        }
      }
    )
  }

  const statusOptions = [
    { value: 1, label: 'Pendente', description: 'Aguardando pagamento' },
    { value: 2, label: 'Confirmado', description: 'Pagamento confirmado' },
    { value: 3, label: 'Enviado', description: 'Pedido enviado para entrega' },
    { value: 4, label: 'Entregue', description: 'Pedido entregue ao cliente' },
    { value: 5, label: 'Cancelado', description: 'Pedido cancelado' }
  ]

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
          <div className="space-y-3">
            {statusOptions.map((option) => (
              <div
                key={option.value}
                className={`p-3 rounded-2xl border cursor-pointer transition-colors ${selectedStatus === option.value
                  ? 'bg-primary'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
                onClick={() => setSelectedStatus(option.value)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full bg-gray-100`}>
                    {getStatusIcon(option.value)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${selectedStatus === option.value ? 'text-primary-foreground' : 'text-gray-900'}`}>{option.label}</span>
                      
                    </div>
                    <p className={`text-sm ${selectedStatus === option.value ? 'text-primary-foreground' : 'text-gray-600'}`}>{option.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-gray-600">
              Status atual:
              <span

                className={`ml-2 text-sm ${getStatusColor(currentStatus) === 'yellow' ? 'text-yellow-700' :
                  getStatusColor(currentStatus) === 'blue' ? ' text-blue-700' :
                    getStatusColor(currentStatus) === 'purple' ? ' text-purple-700' :
                      getStatusColor(currentStatus) === 'green' ? ' text-green-700' :
                        ' text-red-700'
                  }`}
              >

                <span>{ORDER_STATUS[currentStatus as keyof typeof ORDER_STATUS]?.label}</span>
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
              disabled={isPending || selectedStatus === currentStatus}
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
