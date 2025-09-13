'use client'

import { ProductCard } from './ProductCard'
import { StoreCategory } from '@/app/loja/[slug]/types'
import { Product } from '@/types/product'

interface CategorySectionProps {
  category: StoreCategory
  products: Product[]
  onAddToFavorites?: (product: Product) => void
  onViewDetails?: (product: Product) => void
}

export function CategorySection({ 
  category, 
  products, 
  onAddToFavorites, 
  onViewDetails 
}: CategorySectionProps) {
  if (products.length === 0) return null

  return (
    <div className="mb-12">
      {/* Cabeçalho da Categoria */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {category.name}
        </h2>
        <p className="text-gray-600 mb-2">
          {category.description}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {products.length} produto{products.length !== 1 ? 's' : ''} disponível{products.length !== 1 ? 'is' : ''}
          </span>
          <div className="h-1 w-8 bg-pink-500 rounded-full"></div>
        </div>
      </div>

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToFavorites={onAddToFavorites}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  )
}
