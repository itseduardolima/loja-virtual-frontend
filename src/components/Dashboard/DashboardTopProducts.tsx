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
  hasDateFilter?: boolean
  isViewingToday?: boolean
}

const RANK_LABELS = ['🥇', '🥈', '🥉']

export function DashboardTopProducts({ products, hasDateFilter, isViewingToday }: DashboardTopProductsProps) {
  const [showAllMobile, setShowAllMobile] = useState(false)
  const initialMobileLimit = 4
  const displayedMobile = showAllMobile ? products : products.slice(0, initialMobileLimit)
  const hasMore = products.length > initialMobileLimit

  const emptyMessage = isViewingToday
    ? 'Nenhuma venda hoje'
    : hasDateFilter
      ? 'Nenhuma venda no período selecionado'
      : 'Nenhum produto vendido ainda'

  if (products.length === 0) {
    return (
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-primary">
            Produtos Mais Vendidos
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
          <CardTitle className="text-lg font-bold text-primary">Produtos Mais Vendidos</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-2">
          {displayedMobile.map((product, index) => {
            const imageUrl = getFirstProductImage(product.images)
            return (
              <Link key={product.product_id} href={`/vendedor/produtos/${product.product_id}`} className="block">
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  {/* Rank */}
                  <span className="text-lg w-7 text-center flex-shrink-0 leading-none">
                    {index < 3
                      ? RANK_LABELS[index]
                      : <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
                    }
                  </span>

                  {/* Imagem */}
                  {imageUrl ? (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image src={buildImageUrl(imageUrl)} alt={product.product_name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <Package className="h-5 w-5 text-gray-400" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary truncate leading-tight">
                      {product.product_name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {product.total_sold} vendidos · {product.total_orders} pedidos
                    </p>
                  </div>

                  {/* Receita */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-green-600">{formatPrice(product.revenue)}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">receita</p>
                  </div>
                </div>
              </Link>
            )
          })}

          {hasMore && (
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
                      <td className="p-4 max-w-0 w-[50%]">
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
