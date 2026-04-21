'use client'

import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useWishlist } from '@/hooks/useWishlist'
import { formatPrice, buildImageUrl } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { LoadingSpinner } from '../Layout/LoadingSpinner'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface WishlistProduct {
  product_id: number
  name: string
  price: number
  images: Record<string, string[]> | string[] | null
  store_slug: string
  added_at: string
}

interface WishlistResponse {
  data: WishlistProduct[]
}

interface CustomerFavoritesDrawerProps {
  isOpen: boolean
  onClose: () => void
}

function getFirstImage(images: WishlistProduct['images']): string | null {
  if (!images) return null
  if (Array.isArray(images) && images.length > 0) return images[0]
  if (typeof images === 'object' && !Array.isArray(images)) {
    const firstColor = Object.keys(images)[0]
    if (firstColor && Array.isArray(images[firstColor]) && images[firstColor].length > 0) {
      return images[firstColor][0]
    }
  }
  return null
}

export function CustomerFavoritesDrawer({ isOpen, onClose }: CustomerFavoritesDrawerProps) {
  const { isAuthenticated } = useAuth()
  const { wishlistIds, toggleWishlist } = useWishlist()
  const router = useRouter()

  const { data, isLoading } = useQuery<WishlistResponse>({
    queryKey: ['customer-wishlist-items'],
    queryFn: async () => {
      const response = await api.get<WishlistResponse>('/customers/wishlist')
      return response.data
    },
    enabled: isAuthenticated && isOpen,
  })

  const items = data?.data ?? []

  const handleViewProduct = (storeSlug: string, productId: number) => {
    onClose()
    router.push(`/loja/${storeSlug}/produto/${productId}`)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <h2 className="text-lg font-semibold text-gray-900">Meus Favoritos</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Conteúdo */}
          <div className="flex-1 overflow-y-auto">
            {!isAuthenticated ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <Heart className="w-12 h-12 text-gray-300 mb-4" />
                <p className="font-medium text-gray-700 mb-1">Faça login para ver seus favoritos</p>
                <p className="text-sm text-gray-500">
                  Produtos salvos offline:{' '}
                  <span className="font-semibold">{wishlistIds.length}</span>
                </p>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <Heart className="w-12 h-12 text-gray-300 mb-4" />
                <p className="font-medium text-gray-700 mb-1">Nenhum favorito ainda</p>
                <p className="text-sm text-gray-500">
                  Toque no coração de um produto para salvar aqui.
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {items.map((item) => {
                  const imageUrl = getFirstImage(item.images)

                  return (
                    <div
                      key={item.product_id}
                      className="flex gap-3 p-3 border border-gray-200 rounded-xl hover:border-primary/40 transition-colors"
                    >
                      {/* Imagem */}
                      <button
                        onClick={() => handleViewProduct(item.store_slug, item.product_id)}
                        className="flex-shrink-0"
                      >
                        {imageUrl ? (
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-100">
                            <Image
                              src={buildImageUrl(imageUrl)}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </button>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <button
                          onClick={() => handleViewProduct(item.store_slug, item.product_id)}
                          className="text-left w-full"
                        >
                          <p className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 hover:text-primary transition-colors">
                            {item.name}
                          </p>
                        </button>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="font-semibold text-primary text-sm">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      </div>

                      {/* Remover */}
                      <button
                        onClick={() => toggleWishlist(item.product_id)}
                        className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remover dos favoritos"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
