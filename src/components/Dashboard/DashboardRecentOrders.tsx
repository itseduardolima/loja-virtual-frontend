'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice, buildImageUrl } from '@/lib/utils'
import { RecentOrder } from '@/hooks/useDashboard'
import Image from 'next/image'
import { Package } from 'lucide-react'

interface DashboardRecentOrdersProps {
  orders: RecentOrder[]
}

export function DashboardRecentOrders({ orders }: DashboardRecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold font-integral text-primary">
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
    <Card className="border-0">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-primary ">
          Pedidos Recentes
        </CardTitle>

      </CardHeader>
      <CardContent
        className="h-[500px] overflow-y-auto scrollbar-thin"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#D1D5DB transparent'
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    Nome do Produto

                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    Preço

                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    Total de Pedidos

                  </div>
                </th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    Valor Total

                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const firstItem = order.items && order.items.length > 0 ? order.items[0] : null
                const totalQuantity = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
                const bgColor = index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFB]'

                return (
                  <tr
                    key={order.id}
                    className={` border-gray-100 ${bgColor}`}
                  >
                    <td className="p-4 rounded-xl">
                      {firstItem ? (
                        <div className="flex items-center gap-3">
                          {firstItem.images && firstItem.images.length > 0 ? (
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={buildImageUrl(firstItem.images[0])}
                                alt={firstItem.product_name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <span className="text-sm text-primary">
                            {firstItem.product_name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Sem produto</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-primary">
                        {firstItem ? formatPrice(firstItem.price) : '-'}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex justify-center">
                        <div className="bg-blue-50 rounded-lg px-5 py-2 flex items-center justify-center">
                          <span className="text-sm font-bold text-[#26C0E2]">
                            {totalQuantity}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 rounded-xl">
                      <span className="text-sm font-bold text-primary">
                        {formatPrice(order.total)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

