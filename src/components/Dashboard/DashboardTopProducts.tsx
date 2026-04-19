'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice, buildImageUrl } from '@/lib/utils'
import { getFirstProductImage } from '@/lib/imageUtils'
import { TopProduct } from '@/hooks/useDashboard'
import Image from 'next/image'
import { Package, ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface DashboardTopProductsProps {
  products: TopProduct[]
}

const RANK_LABELS = ['🥇', '🥈', '🥉']

export function DashboardTopProducts({ products }: DashboardTopProductsProps) {
  const [showAllMobile, setShowAllMobile] = useState(false)
  const initialMobileLimit = 4
  const displayedMobile = showAllMobile ? products : products.slice(0, initialMobileLimit)
  const hasMore = products.length > initialMobileLimit

  if (products.length === 0) {
    return (
      <Card className="border-0 hidden md:block">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-primary">
            Produtos Mais Vendidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
            <Package className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-4" />
            <p className="text-sm sm:text-base text-gray-500">Nenhum produto vendido ainda</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Mobile */}
      <Card className="border-0 block md:hidden bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between pb-3 sm:pb-4 px-0">
          <CardTitle className="text-lg sm:text-xl font-bold text-primary">
            Produtos Mais Vendidos
          </CardTitle>
        </CardHeader>
        <CardContent
          className="h-auto overflow-y-auto scrollbar-thin pb-2 p-0"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#D1D5DB transparent' }}
        >
          <div className="space-y-3">
            {displayedMobile.map((product, index) => {
              const imageUrl = getFirstProductImage(product.images)
              return (
                <Link key={product.product_id} href={`/vendedor/produtos/${product.product_id}`} className="block">
                  <div className="rounded-xl p-3 sm:p-4 bg-white border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-lg w-7 text-center flex-shrink-0">
                        {index < 3 ? RANK_LABELS[index] : <span className="text-sm text-gray-500">#{index + 1}</span>}
                      </span>
                      {imageUrl ? (
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image src={buildImageUrl(imageUrl)} alt={product.product_name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Package className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-semibold text-primary truncate">
                          {product.product_name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                          {product.total_sold} un. · {product.total_orders} pedidos
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Receita gerada</span>
                      <span className="text-sm font-bold text-primary">{formatPrice(product.revenue)}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
          {hasMore && (
            <div className="pt-2">
              <Button
                variant="outline"
                onClick={() => setShowAllMobile(!showAllMobile)}
                className="w-full flex items-center justify-center gap-2 text-sm"
              >
                {showAllMobile ? 'Exibir menos' : 'Exibir mais'}
                <ChevronDown className={`h-4 w-4 transition-transform ${showAllMobile ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Desktop */}
      <Card className="border-0 hidden md:block">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-primary">
            Produtos Mais Vendidos
          </CardTitle>
        </CardHeader>
        <CardContent
          className="h-[500px] overflow-y-auto scrollbar-thin"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#D1D5DB transparent' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Receita
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Vendidos
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                    Pedidos
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => {
                  const imageUrl = getFirstProductImage(product.images)
                  const bgColor = index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFB]'
                  return (
                    <tr key={product.product_id} className={`border-gray-100 ${bgColor}`}>
                      <td className="p-4 rounded-xl max-w-0 w-[50%]">
                        <Link href={`/vendedor/produtos/${product.product_id}`}>
                          <div className="flex items-center gap-3 overflow-hidden">
                            <span className="text-base w-6 text-center flex-shrink-0">
                              {index < 3 ? RANK_LABELS[index] : <span className="text-xs font-bold text-gray-400">#{index + 1}</span>}
                            </span>
                            {imageUrl ? (
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                <Image src={buildImageUrl(imageUrl)} alt={product.product_name} fill className="object-cover" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <Package className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                            <span className="text-sm text-primary truncate">{product.product_name}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-primary">{formatPrice(product.revenue)}</span>
                      </td>
                      <td className="p-2">
                        <div className="flex justify-center">
                          <div className="bg-blue-50 rounded-lg px-5 py-2 flex items-center justify-center">
                            <span className="text-sm font-bold text-[#26C0E2]">{product.total_sold}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-primary">{product.total_orders}</span>
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
