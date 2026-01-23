'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice, buildImageUrl } from '@/lib/utils'
import { TopProduct } from '@/hooks/useDashboard'
import Image from 'next/image'
import { Package, ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface DashboardTopProductsProps {
  products: TopProduct[]
}

export function DashboardTopProducts({ products }: DashboardTopProductsProps) {
  const [showAllMobile, setShowAllMobile] = useState(false)
  const initialMobileLimit = 4
  const displayedProductsMobile = showAllMobile ? products : products.slice(0, initialMobileLimit)
  const hasMoreProducts = products.length > initialMobileLimit

  if (products.length === 0) {
    return (
      <Card className="border-0 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
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
      {/* Versão Mobile - Cards */}
      <Card className="border-0 block md:hidden bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between pb-3 sm:pb-4 px-0">
          <CardTitle className="text-lg sm:text-xl font-bold text-primary">
            Produtos Mais Vendidos
          </CardTitle>
        </CardHeader>
        <CardContent
          className="h-auto overflow-y-auto scrollbar-thin pb-2 p-0"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#D1D5DB transparent'
          }}
        >
          <div className="space-y-3">
            {displayedProductsMobile.map((product) => (
              <Link
                key={product.product_id}
                href={`/vendedor/produtos/${product.product_id}`}
                className="block"
              >
                <div className="rounded-xl p-3 sm:p-4 bg-white border border-gray-100">
                  {/* Produto */}
                  <div className="flex items-center gap-3 mb-3">
                    {product.images && product.images.length > 0 ? (
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={buildImageUrl(product.images[0])}
                          alt={product.product_name}
                          fill
                          className="object-cover"
                        />
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
                        Preço: {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>

                  {/* Informações adicionais */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Vendidos:</span>
                      <div className="bg-blue-50 rounded-lg px-3 py-1.5 flex items-center justify-center">
                        <span className="text-xs sm:text-sm font-bold text-[#26C0E2]">
                          {product.total_sold || 0}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-600 block mb-0.5">Preço</span>
                      <span className="text-sm sm:text-base font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {hasMoreProducts && (
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

      {/* Versão Desktop - Original */}
      <Card className="border-0 shadow-sm rounded-2xl hidden md:block">
        <CardHeader className="flex flex-row items-center justify-between pb-3 sm:pb-4">
          <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
            Produtos Mais Vendidos
          </CardTitle>
        </CardHeader>
        <CardContent 
          className="h-[500px] overflow-y-auto space-y-3 scrollbar-thin"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#D1D5DB transparent'
          }}
        >
          {products.map((product) => (
            <Link
              key={product.product_id}
              href={`/vendedor/produtos/${product.product_id}`}
              className="block"
            >
              <div className="rounded-xl p-3">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                  {/* Imagem do Produto */}
                  <div className="flex-shrink-0">
                    {product.images && product.images.length > 0 ? (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white shadow-sm">
                        <Image
                          src={buildImageUrl(product.images[0])}
                          alt={product.product_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-white shadow-sm flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Informações do Produto */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-primary truncate mb-2">
                      {product.product_name}
                    </h4>
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {product.total_sold || 0} vendidos
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </>
  )
}

