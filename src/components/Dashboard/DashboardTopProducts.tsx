'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice, buildImageUrl } from '@/lib/utils'
import { TopProduct } from '@/hooks/useDashboard'
import Image from 'next/image'
import { Package } from 'lucide-react'
import Link from 'next/link'

interface DashboardTopProductsProps {
  products: TopProduct[]
}

export function DashboardTopProducts({ products }: DashboardTopProductsProps) {
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
    <Card className="border-0 shadow-sm rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-3 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
          Produtos Mais Vendidos
        </CardTitle>
      </CardHeader>
      <CardContent 
        className="h-auto sm:h-[500px] overflow-y-auto space-y-2 sm:space-y-3 scrollbar-thin pb-2 sm:pb-0"
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
            <div className="rounded-xl p-2 sm:p-3">
              <div className="flex items-center gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-gray-200">
                {/* Imagem do Produto */}
                <div className="flex-shrink-0">
                  {product.images && product.images.length > 0 ? (
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-white shadow-sm">
                      <Image
                        src={buildImageUrl(product.images[0])}
                        alt={product.product_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-white shadow-sm flex items-center justify-center">
                      <Package className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Informações do Produto */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-primary truncate mb-1 sm:mb-2">
                    {product.product_name}
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="text-sm sm:text-base font-bold text-gray-900">
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
  )
}

