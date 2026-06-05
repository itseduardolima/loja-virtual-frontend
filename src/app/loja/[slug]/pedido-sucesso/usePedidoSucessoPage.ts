'use client'

import { useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useStoreProducts } from '@/hooks/useStoreProducts'
import { useCart } from '@/hooks/useCart'
import { Product } from '@/types/product'

export function usePedidoSucessoPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = params.slug as string
  const orderCode = searchParams.get('codigo') ?? ''

  const [isCartOpen, setIsCartOpen] = useState(false)

  const { storeInfo, loading: storeLoading, error: storeError, refetch: refetchStore } = useStoreInfo(slug)
  const { products, loading: productsLoading } = useStoreProducts({
    slug,
    limit: 8,
    page: 1,
    sort: 'DESC',
    sort_field: 'created_at',
  })
  const storeId = storeInfo?.id
  useCart(storeId)

  const handleViewDetails = (product: Product) => {
    router.push(`/loja/${slug}/produto/${product.id}`)
  }

  return {
    slug,
    orderCode,
    isCartOpen,
    setIsCartOpen,
    storeInfo,
    storeLoading,
    storeError,
    refetchStore,
    storeId,
    products,
    productsLoading,
    handleViewDetails,
  }
}
