'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useStoreProducts } from '@/hooks/useStoreProducts'
import { useCart } from '@/hooks/useCart'
import { useToastContext } from '@/contexts/ToastContext'
import { type OrderSnapshot, orderSnapshotKey } from '@/hooks/useCheckout'

export function usePedidoSucessoPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = params.slug as string
  const orderCode = searchParams.get('codigo') ?? ''

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [snapshot, setSnapshot] = useState<OrderSnapshot | null>(null)

  const {
    storeInfo,
    loading: storeLoading,
    error: storeError,
    refetch: refetchStore,
  } = useStoreInfo(slug)
  const { products, loading: productsLoading } = useStoreProducts({
    slug,
    limit: 8,
    page: 1,
    sort: 'DESC',
    sort_field: 'created_at',
  })
  const storeId = storeInfo?.id
  useCart(storeId)

  const { success: toastSuccess } = useToastContext()

  // Lê-e-remove o snapshot do sessionStorage (refresh/aba nova caem no fallback sem recap)
  useEffect(() => {
    if (!orderCode) return
    try {
      const raw = sessionStorage.getItem(orderSnapshotKey(orderCode))
      if (raw) {
        setSnapshot(JSON.parse(raw) as OrderSnapshot)
        sessionStorage.removeItem(orderSnapshotKey(orderCode))
      }
    } catch {
      // storage indisponível — sem recap, sem erro
    }
  }, [orderCode])

  // whatsappHref: prefere o link da resposta do checkout (snapshot); fallback: número bruto da loja
  const whatsappHref: string | null = (() => {
    if (snapshot?.whatsapp_link) return snapshot.whatsapp_link
    if (storeInfo?.whatsapp) {
      const phone = storeInfo.whatsapp.replace(/\D/g, '')
      return `https://wa.me/${phone}`
    }
    return null
  })()

  const handleCopyCode = () => {
    if (!orderCode) return
    navigator.clipboard
      .writeText(orderCode)
      .then(() => toastSuccess('Código copiado!'))
      .catch(() => {
        // clipboard indisponível (permissão/contexto inseguro) — o código segue visível na tela
      })
  }

  const handleTrack = () => {
    if (!orderCode) return
    router.push('/rastrear?code=' + orderCode)
  }

  // Sugestões: primeiros 4 produtos da loja
  const suggestions = products.slice(0, 4)

  const handleOpenProduct = (productId: number) => {
    router.push(`/loja/${slug}/produto/${productId}`)
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
    productsLoading,
    snapshot,
    whatsappHref,
    handleCopyCode,
    handleTrack,
    handleOpenProduct,
    suggestions,
  }
}
