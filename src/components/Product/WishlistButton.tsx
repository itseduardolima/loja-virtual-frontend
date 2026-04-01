'use client'

import { Heart } from 'lucide-react'
import { useWishlist } from '@/hooks/useWishlist'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  productId: number
  className?: string
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist, isLoading } = useWishlist()
  const favorited = isInWishlist(productId)

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        toggleWishlist(productId)
      }}
      disabled={isLoading}
      aria-label={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className={cn(
        'flex items-center justify-center w-8 h-8 rounded-full bg-white/90 shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-60',
        className
      )}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-all duration-200',
          favorited
            ? 'fill-red-500 text-red-500'
            : 'fill-transparent text-gray-400 hover:text-red-400'
        )}
      />
    </button>
  )
}
