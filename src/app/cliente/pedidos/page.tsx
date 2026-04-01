'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { useCustomerOrders } from '@/hooks/useCustomerOrders'
import { useAuth } from '@/contexts/AuthContext'
import { CUSTOMER_ORDER_STATUS } from '@/types/customer'
import { formatDate, formatPrice, buildImageUrl } from '@/lib/utils'
import { SidebarCliente } from '@/components/Layout/SidebarCliente'
import { UserHeaderCliente } from '@/components/Layout/UserHeaderCliente'
import {
  ShoppingBag,
  Search,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Store,
  Navigation,
} from 'lucide-react'

const STATUS_COLORS: Record<number, string> = {
  1: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  2: 'bg-blue-100 text-blue-800 border-blue-200',
  3: 'bg-purple-100 text-purple-800 border-purple-200',
  4: 'bg-green-100 text-green-800 border-green-200',
  5: 'bg-red-100 text-red-800 border-red-200',
}

const STATUS_ICONS: Record<number, React.ReactNode> = {
  1: <Clock className="h-3.5 w-3.5" />,
  2: <CheckCircle className="h-3.5 w-3.5" />,
  3: <Truck className="h-3.5 w-3.5" />,
  4: <CheckCircle className="h-3.5 w-3.5" />,
  5: <XCircle className="h-3.5 w-3.5" />,
}

export default function MeusPedidosPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<number | undefined>(undefined)
  const [page, setPage] = useState(1)

  const { data, isLoading } = useCustomerOrders({ page, limit: 10, status, search })

  const orders = data?.data ?? []
  const meta = data?.meta

  // Proteção de rota
  if (!authLoading && !isAuthenticated) {
    router.replace('/login?redirect=/cliente/pedidos')
    return null
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput.trim())
    setPage(1)
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setStatus(val ? Number(val) : undefined)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarCliente currentPath="/cliente/pedidos" />

      <div className="flex-1 flex flex-col min-w-0">
        <UserHeaderCliente currentPath="/cliente/pedidos" />

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Título */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Meus Pedidos</h1>
                <p className="text-sm text-gray-500">Acompanhe o status dos seus pedidos</p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex flex-1 gap-2">
                <Input
                  placeholder="Buscar por código..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1 rounded-xl border-gray-200"
                />
                <Button type="submit" variant="outline" className="rounded-xl px-4 gap-2 shrink-0">
                  <Search className="h-4 w-4" />
                  Buscar
                </Button>
              </div>

              <select
                value={status ?? ''}
                onChange={handleStatusChange}
                className="h-10 rounded-xl border border-gray-200 px-3 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Todos os status</option>
                {Object.entries(CUSTOMER_ORDER_STATUS).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </form>
          </div>

          {/* Lista */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-36" />
                      <div className="h-4 bg-gray-200 rounded w-24" />
                    </div>
                    <div className="h-7 bg-gray-200 rounded-full w-24" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <Package className="h-14 w-14 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Nenhum pedido encontrado</h2>
              <p className="text-gray-500 text-sm">
                {search || status ? 'Tente ajustar os filtros.' : 'Você ainda não fez nenhum pedido.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusConfig = CUSTOMER_ORDER_STATUS[order.status as keyof typeof CUSTOMER_ORDER_STATUS]
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-900">{order.order_code}</span>
                          {order.order_number && (
                            <span className="text-sm text-gray-500">#{order.order_number}</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{formatDate(order.created_at)}</p>
                      </div>

                      {statusConfig && (
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[order.status]}`}
                        >
                          {STATUS_ICONS[order.status]}
                          {statusConfig.label}
                        </span>
                      )}
                    </div>

                    {/* Loja */}
                    {order.store && (
                      <div className="flex items-center gap-2 mb-4">
                        {order.store.logo ? (
                          <img
                            src={buildImageUrl(order.store.logo)}
                            alt={order.store.name}
                            className="w-6 h-6 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Store className="h-3.5 w-3.5 text-gray-400" />
                          </div>
                        )}
                        <span className="text-sm text-gray-600">{order.store.name}</span>
                      </div>
                    )}

                    {/* Itens - prévia */}
                    {order.items && order.items.length > 0 && (
                      <div className="mb-4">
                        <div className="flex gap-2 flex-wrap">
                          {order.items.slice(0, 3).map((item) => (
                            <div key={item.id} className="flex items-center gap-1.5 bg-gray-50 rounded-lg px-2 py-1">
                              <span className="text-xs text-gray-600">
                                {item.quantity}x {item.product?.name ?? 'Produto'}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <span className="text-xs text-gray-400 self-center">
                              +{order.items.length - 3} item(s)
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Rodapé */}
                    <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-gray-100">
                      <span className="font-bold text-primary text-lg">{formatPrice(order.total)}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl gap-2"
                        onClick={() => router.push(`/rastrear?code=${order.order_code}`)}
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        Rastrear
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Paginação */}
          {meta && meta.lastPage > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-xl gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>

              <span className="text-sm text-gray-600 px-2">
                {page} de {meta.lastPage}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.lastPage}
                onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
                className="rounded-xl gap-1"
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
