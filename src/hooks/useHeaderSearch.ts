import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { getFirstProductImage } from '@/lib/imageUtils'
import type { Product } from '@/types/product'
import type { Order } from '@/types/order'

interface ProductHit {
  id: number
  name: string
  price: string
  image: string | null
}

interface OrderHit {
  id: number
  order_code: string
  customer_name: string
  total: string
  status: number
  image: string | null
}

interface SearchResults {
  products: ProductHit[]
  orders: OrderHit[]
}

const MIN_QUERY = 2

export function useHeaderSearch(query: string) {
  const trimmed = query.trim()
  const enabled = trimmed.length >= MIN_QUERY

  return useQuery<SearchResults>({
    queryKey: ['header-search', trimmed],
    enabled,
    staleTime: 30_000,
    queryFn: async () => {
      const [productsRes, ordersRes] = await Promise.all([
        api.get('/products/my-products', {
          params: { search: trimmed, page: 1, limit: 5 },
        }),
        api.get('/orders', {
          params: { search: trimmed, page: 1, limit: 5 },
        }),
      ])

      const products: ProductHit[] = (productsRes.data?.data ?? []).map((p: Product) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image:
          getFirstProductImage(p.images_by_color) ??
          getFirstProductImage(p.images as any) ??
          null,
      }))

      const orders: OrderHit[] = (ordersRes.data?.data ?? []).map((o: Order) => {
        const firstItem = o.items?.[0]
        const productImages = firstItem?.product?.images
        return {
          id: o.id,
          order_code: o.order_code,
          customer_name: o.customer_name,
          total: o.total,
          status: o.status,
          image: getFirstProductImage(productImages as any),
        }
      })

      return { products, orders }
    },
  })
}

export type { ProductHit, OrderHit, SearchResults }
