'use client'

import { useOrderStatusHistory } from '@/hooks/useOrderStatusHistory'

interface TimelineStep {
  id: number
  title: string
  description: string
}

interface OrderTrackingTimelineProps {
  currentStatus: number
  orderId?: number | null
  showTitle?: boolean
  className?: string
  isVendor?: boolean
  // Mantido para compatibilidade, mas não será usado se orderId for fornecido
  orderDates?: {
    created_at?: string
    updated_at?: string
    [key: string]: string | undefined
  }
}

const formatDateTime = (dateString?: string): string => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const statusTimeline: TimelineStep[] = [
  { id: 1, title: 'Pedido recebido', description: 'Estamos aguardando a confirmação do pedido.' },
  { id: 2, title: 'Pagamento confirmado', description: 'O pagamento foi identificado e o pedido está em preparo.' },
  { id: 3, title: 'Pedido enviado', description: 'O pedido saiu para entrega.' },
  { id: 4, title: 'Pedido entregue', description: 'O pedido foi entregue.' },
  { id: 5, title: 'Pedido cancelado', description: 'O pedido foi cancelado.' }
]

export function OrderTrackingTimeline({ 
  currentStatus, 
  orderId,
  showTitle = true,
  className = '',
  isVendor = true,
  orderDates
}: OrderTrackingTimelineProps) {
  // Busca o histórico de status se orderId for fornecido
  const { data: historyData, isLoading: isLoadingHistory } = useOrderStatusHistory(
    orderId || null, 
    isVendor
  )

  // Obter os status que realmente ocorreram (do histórico)
  const completedStatuses = historyData?.data 
    ? new Set(historyData.data.map(item => item.status))
    : new Set<number>()

  // Se não temos histórico mas temos orderDates, assume que status 1 (recebido) ocorreu
  // pois todo pedido começa com esse status
  if (!historyData?.data && orderDates?.created_at) {
    completedStatuses.add(1)
  }

  // Filtrar timeline: quando cancelado, mostrar apenas as etapas que ocorreram
  const filteredTimeline = statusTimeline.filter(step => {
    // Sempre mostra o status de cancelado se o pedido foi cancelado
    if (step.id === 5) {
      return currentStatus === 5
    }
    
    // Se o pedido foi cancelado, mostra apenas os status que realmente ocorreram
    if (currentStatus === 5) {
      return completedStatuses.has(step.id)
    }
    
    // Para pedidos não cancelados, mostra todas as etapas
    return true
  })

  const currentStatusIndex = filteredTimeline.findIndex(step => step.id === currentStatus)

  // Função para obter a data de cada status do histórico
  const getStatusDate = (statusId: number): string | undefined => {
    // Se temos histórico, usa ele
    if (historyData?.data && Array.isArray(historyData.data) && historyData.data.length > 0) {
      // Pega o primeiro registro do status (mais antigo)
      const historyItem = historyData.data.find(item => item.status === statusId)
      if (historyItem?.created_at) {
        return historyItem.created_at
      }
    }
    
    // Fallback para orderDates (compatibilidade)
    if (orderDates) {
      // Status 1 (Pedido recebido) usa created_at
      if (statusId === 1) {
        return orderDates.created_at
      }
      
      // Para outros status, se o status foi completado, usa updated_at
      if (statusId <= currentStatus) {
        return orderDates.updated_at
      }
    }
    
    return undefined
  }

  return (
    <div className={className}>
      {showTitle && (
        <h3 className="font-semibold mb-4">Rastreamento do Pedido</h3>
      )}
      <div className="relative">
        <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200" />
        <div className="space-y-5">
          {filteredTimeline.map((step, index) => {
            const isCompleted = index < currentStatusIndex
            const isCurrent = step.id === currentStatus
            const isUpcoming = index > currentStatusIndex
            const statusDate = getStatusDate(step.id)
            const statusDateTime = formatDateTime(statusDate)

            return (
              <div key={step.id} className="flex gap-4 relative">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 ${
                    isCompleted || isCurrent
                      ? 'bg-primary border-primary'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  {/* Círculo menor sem numeração */}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`font-semibold ${isCompleted || isCurrent ? 'text-primary' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                    {statusDateTime && (isCompleted || isCurrent) && (
                      <span className="text-xs text-gray-500">
                        {statusDateTime}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${isUpcoming ? 'text-gray-400' : 'text-gray-600'}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

