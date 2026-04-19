'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice, buildImageUrl } from '@/lib/utils'
import { getFirstProductImage } from '@/lib/imageUtils'
import { RecentOrder } from '@/hooks/useDashboard'
import Image from 'next/image'
import { Package, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const STATUS_STYLE: Record<number, string> = {
  1: 'bg-yellow-100 text-yellow-700',
  2: 'bg-blue-100 text-blue-700',
  3: 'bg-purple-100 text-purple-700',
  4: 'bg-green-100 text-green-700',
  5: 'bg-red-100 text-red-700',
}

interface DashboardRecentOrdersProps {
  orders: RecentOrder[]
  hasDateFilter?: boolean
  isViewingToday?: boolean
}

export function DashboardRecentOrders({ orders, hasDateFilter, isViewingToday }: DashboardRecentOrdersProps) {
  const router = useRouter()
  const [showAllMobile, setShowAllMobile] = useState(false)
  const initialMobileLimit = 4
  const displayedOrdersMobile = showAllMobile ? orders : orders.slice(0, initialMobileLimit)
  const hasMoreOrders = orders.length > initialMobileLimit

  const emptyMessage = isViewingToday
    ? 'Nenhum pedido hoje'
    : hasDateFilter
      ? 'Nenhum pedido no período selecionado'
      : 'Nenhum pedido recente'

  if (!orders || orders.length === 0) {
    return (
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-primary">
            Pedidos Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
            <Package className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4" />
            <p className="text-sm sm:text-base text-gray-500">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Mobile */}
      <Card className="border-0 shadow-sm rounded-2xl block md:hidden">
        <CardHeader className="pb-3 pt-5 px-4">
          <CardTitle className="text-lg font-bold text-primary">Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-2">
          {displayedOrdersMobile.map((order) => {
            const firstItem = order.items?.[0] ?? null
            const totalQuantity = order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
            const firstImageUrl = firstItem ? getFirstProductImage(firstItem.images) : null
            const statusStyle = STATUS_STYLE[order.status] ?? 'bg-gray-100 text-gray-600'

            return (
              <Link key={order.id} href={`/vendedor/pedidos?orderId=${order.id}`} className="block">
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
                  {/* Imagem */}
                  {firstImageUrl ? (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image src={buildImageUrl(firstImageUrl)} alt={firstItem?.product_name ?? ''} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary truncate leading-tight">
                      {firstItem?.product_name ?? 'Sem produto'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {totalQuantity} {totalQuantity === 1 ? 'item' : 'itens'}
                    </p>
                    <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle}`}>
                      {order.status_text}
                    </span>
                  </div>

                  {/* Total */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-primary">{formatPrice(order.total)}</p>
                  </div>
                </div>
              </Link>
            )
          })}

          {hasMoreOrders && (
            <Button
              variant="ghost"
              onClick={() => setShowAllMobile(!showAllMobile)}
              className="w-full h-9 text-sm text-gray-500 gap-1"
            >
              {showAllMobile ? 'Ver menos' : 'Ver mais'}
              <ChevronDown className={`h-4 w-4 transition-transform ${showAllMobile ? 'rotate-180' : ''}`} />
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Versão Desktop - Tabela Original */}
      <Card className="border-0 hidden md:block">
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
                  <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider w-[45%] max-w-0">
                    Produto
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Preço
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Qtd.
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => {
                  const firstItem = order.items && order.items.length > 0 ? order.items[0] : null
                  const totalQuantity = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
                  const firstImageUrl = firstItem ? getFirstProductImage(firstItem.images) : null
                  const bgColor = index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFB]'

                  return (
                    <tr
                      key={order.id}
                      className={`border-gray-100 ${bgColor} cursor-pointer hover:bg-blue-50 transition-colors`}
                      onClick={() => router.push(`/vendedor/pedidos?orderId=${order.id}`)}
                    >
                      <td className="p-4 max-w-0 w-[45%]">
                        {firstItem ? (
                          <div className="flex items-center gap-2 overflow-hidden">
                            {firstImageUrl ? (
                              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image
                                  src={buildImageUrl(firstImageUrl)}
                                  alt={firstItem.product_name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <Package className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                            <span className="text-sm text-primary truncate min-w-0">
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
                      <td className="p-4">
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
    </>
  )
}

