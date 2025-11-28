'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatDate, buildImageUrl } from '@/lib/utils'
import { RecentOrder } from '@/hooks/useDashboard'
import Image from 'next/image'
import { Package, Clock } from 'lucide-react'
import Link from 'next/link'

interface DashboardRecentOrdersProps {
  orders: RecentOrder[]
}

const statusColors: Record<number, { bg: string; text: string }> = {
  1: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  2: { bg: 'bg-blue-100', text: 'text-blue-800' },
  3: { bg: 'bg-purple-100', text: 'text-purple-800' },
  4: { bg: 'bg-green-100', text: 'text-green-800' },
  5: { bg: 'bg-red-100', text: 'text-red-800' },
}

export function DashboardRecentOrders({ orders }: DashboardRecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Pedidos Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Nenhum pedido recente</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Pedidos Recentes
        </CardTitle>
        <Link
          href="/vendedor/pedidos"
          className="text-sm text-primary hover:underline"
        >
          Ver todos
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <Link
              key={order.id}
              href={`/vendedor/pedidos/${order.id}`}
              className="block p-4 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    
                    <Badge
                      className={`${statusColors[order.status]?.bg || 'bg-gray-100'} ${statusColors[order.status]?.text || 'text-gray-800'}`}
                    >
                      {order.status_text}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(order.created_at)}
                    </span>
                    <span>{order.customer_name}</span>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      {order.items[0].images && order.items[0].images.length > 0 && (
                        <div className="relative w-10 h-10 rounded-md overflow-hidden border border-gray-200">
                          <Image
                            src={buildImageUrl(order.items[0].images[0])}
                            alt={order.items[0].product_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate">
                          {order.items[0].product_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.items_count} {order.items_count === 1 ? 'item' : 'itens'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

