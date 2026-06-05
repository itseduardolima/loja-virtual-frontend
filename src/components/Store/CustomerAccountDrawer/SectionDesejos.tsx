'use client'

import { useRouter } from 'next/navigation'
import { Heart, X } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { useWishlist } from '@/hooks/useWishlist'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { Empty, SectionSpinner, Thumb } from './shared'

/* ─── Tipos locais ─────────────────────────────────────────────────────── */

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

/* ─── Helper local ─────────────────────────────────────────────────────── */

function getFirstWishlistImage(images: WishlistProduct['images']): string | null {
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

/* ─── Componente ───────────────────────────────────────────────────────── */

export function SectionDesejos({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { toggleWishlist } = useWishlist()

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

  if (isLoading) {
    return <SectionSpinner />
  }

  if (items.length === 0) {
    return (
      <Empty
        icon={Heart}
        title="Sua lista está vazia"
        desc="Toque no coração de um produto para salvar aqui e comprar depois."
        cta="Explorar produtos"
        onCta={onClose}
      />
    )
  }

  const count = items.length
  const countLabel = count === 1 ? '1 item salvo' : `${count} itens salvos`

  return (
    <div className="scrollbar-thin flex-1 overflow-y-auto p-5">
      <p className="mb-3 text-[11.5px] text-nxi3">{countLabel}</p>

      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => {
          const imageUrl = getFirstWishlistImage(item.images)
          return (
            <div
              key={item.product_id}
              className="ac-rise"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              {/* Imagem */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-nxborder bg-nxbg">
                <Thumb src={imageUrl} alt={item.name} sizes="200px" />

                {/* Botão remover */}
                <button
                  onClick={() => toggleWishlist(item.product_id)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-nxd shadow-sm backdrop-blur transition-colors hover:bg-nxd hover:text-white"
                  title="Remover dos favoritos"
                >
                  <X size={13} />
                </button>
              </div>

              {/* Infos */}
              <p className="mt-2 line-clamp-1 text-[12px] font-bold text-nxi1">{item.name}</p>
              <p className="mt-0.5 text-[13px] font-extrabold text-nxi1">
                {formatPrice(item.price)}
              </p>

              {/* CTA */}
              <button
                onClick={() => handleViewProduct(item.store_slug, item.product_id)}
                className="mt-2 w-full rounded-lg bg-nxp py-2 text-[11px] font-bold text-white transition-transform active:scale-95"
              >
                Ver produto
              </button>
            </div>
          )
        })}
      </div>

      <div className="h-2" />
    </div>
  )
}
