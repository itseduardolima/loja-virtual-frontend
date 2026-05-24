'use client'

import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useWishlist } from '@/hooks/useWishlist'
import { formatPrice, buildImageUrl } from '@/lib/utils'
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
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-[#F0EBE3]">
            <div className="flex items-center">
              <Heart className="w-4 h-4 text-[#5A3C1E] fill-[#5A3C1E]" />
              <h2 className="text-[15px] font-semibold text-[#1C1008] ml-2.5">Meus Favoritos</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F7F3EF] flex items-center justify-center text-[#7C6B5C] hover:text-[#1C1008] transition-colors border-none cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {!isAuthenticated ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <Heart className="w-10 h-10 text-[#C4B4A4]" />
                <p className="text-[15px] font-semibold text-[#1C1008] mt-4">
                  Faça login para ver seus favoritos
                </p>
                <p className="text-[13px] text-[#A8998A] mt-1.5">
                  Produtos salvos offline:{' '}
                  <span className="font-semibold">{wishlistIds.length}</span>
                </p>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3 p-4 border-b border-[#F7F3EF]">
                    <div className="w-[72px] h-[88px] rounded-xl bg-[#F0EBE3] animate-pulse flex-shrink-0" />
                    <div className="flex-1 flex flex-col justify-center gap-2.5 py-1">
                      <div className="h-3 bg-[#F0EBE3] rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-[#F0EBE3] rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <Heart className="w-10 h-10 text-[#C4B4A4]" />
                <p className="text-[15px] font-semibold text-[#1C1008] mt-4">
                  Nenhum favorito ainda
                </p>
                <p className="text-[13px] text-[#A8998A] mt-1.5">
                  Toque no coração de um produto para salvar aqui.
                </p>
              </div>
            ) : (
              <div>
                {items.map((item) => {
                  const imageUrl = getFirstImage(item.images)

                  return (
                    <div
                      key={item.product_id}
                      className="flex gap-3 p-4 border-b border-[#F7F3EF] hover:bg-[#FAFAFA] transition-colors"
                    >
                      {/* Image */}
                      <button
                        onClick={() => handleViewProduct(item.store_slug, item.product_id)}
                        className="w-[72px] h-[88px] rounded-xl overflow-hidden bg-[#F7F3EF] relative flex-shrink-0"
                      >
                        {imageUrl ? (
                          <Image
                            src={buildImageUrl(imageUrl)}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-[#C4B4A4]" />
                          </div>
                        )}
                      </button>

                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="text-[13px] font-semibold text-[#1C1008] leading-tight line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-[14px] font-bold text-[#1C1008] mt-1">
                          {formatPrice(item.price)}
                        </p>
                        <button
                          onClick={() => handleViewProduct(item.store_slug, item.product_id)}
                          className="text-[11px] text-[#A8998A] hover:text-[#5A3C1E] transition-colors mt-1 text-left"
                        >
                          Ver produto
                        </button>
                      </div>

                      {/* Remove */}
                      <div className="flex items-start pt-1 flex-shrink-0">
                        <button
                          onClick={() => toggleWishlist(item.product_id)}
                          className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center text-[#C4B4A4] hover:text-red-500 transition-colors"
                          title="Remover dos favoritos"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
