'use client'

import { useState, useEffect, useCallback } from 'react'

const LOCAL_STORAGE_KEY = 'recently_viewed'
const MAX_ITEMS = 8

export interface RecentlyViewedProduct {
  id: number
  name: string
  price: string
  images: string[]
  storeSlug: string
}

function getStoredItems(): RecentlyViewedProduct[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedProduct[]>([])

  useEffect(() => {
    setRecentlyViewed(getStoredItems())
  }, [])

  const addRecentlyViewed = useCallback((product: RecentlyViewedProduct) => {
    setRecentlyViewed((prev) => {
      // Remove duplicatas
      const filtered = prev.filter((p) => p.id !== product.id)
      // Mais recente primeiro, limitado a MAX_ITEMS
      const updated = [product, ...filtered].slice(0, MAX_ITEMS)
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
      } catch {
        // ignora erros de storage
      }
      return updated
    })
  }, [])

  return { recentlyViewed, addRecentlyViewed }
}
