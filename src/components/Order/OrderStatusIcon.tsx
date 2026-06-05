'use client'

import { Clock, CheckCircle, Truck, XCircle } from 'lucide-react'
import { ORDER_STATUS } from '@/types/order'

export function getStatusIcon(status: number) {
  const info = ORDER_STATUS[status as keyof typeof ORDER_STATUS] || ORDER_STATUS[1]
  switch (info.icon) {
    case 'clock':
      return <Clock className="h-4 w-4" strokeWidth={3} />
    case 'check-circle':
      return <CheckCircle className="h-4 w-4" strokeWidth={3} />
    case 'truck':
      return <Truck className="h-4 w-4" strokeWidth={3} />
    case 'x-circle':
      return <XCircle className="h-4 w-4" strokeWidth={3} />
    default:
      return <Clock className="h-4 w-4" strokeWidth={3} />
  }
}
