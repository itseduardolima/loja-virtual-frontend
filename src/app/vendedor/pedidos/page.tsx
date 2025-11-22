'use client'

import { Table } from '@/components/Table'
import { ErrorState } from '@/components/ErrorState'
import LoadingPage from '@/components/LoadingPage'
import { TableFilters } from '@/components/TableFilters'
import { useOrdersPage } from './useOrdersPage'

export default function OrdersPage() {
  const {
    authLoading,
    isAuthenticated,
    user,
    filters,
    searchTerm,
    setSearchTerm,
    handleFilterChange,
    orders,
    meta,
    isLoading,
    error,
    handlePageChange,
    columns,
    hasFilters,
    ORDER_STATUS,
    SORT_OPTIONS,
  } = useOrdersPage()

  const statusOptions = [
    { value: 'all', label: 'Todos os status' },
    ...Object.entries(ORDER_STATUS).map(([key, status]) => ({
      value: parseInt(key),
      label: status.label,
    })),
  ]
  const isSearching = false 

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingPage />
      </div>
    )
  }

  if (!isAuthenticated || user?.profile !== 'Vendedor') {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingPage />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorState
          message="Erro ao carregar pedidos"
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        <div>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Pedidos</h1>
                <p className="text-gray-600 mb-4">
                  Gerencie todos os pedidos da sua loja
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Filtros */}
        <div className="mb-6">
          <TableFilters
            filters={filters}
            setFilters={(updater) => {
              const newFilters = typeof updater === 'function' ? updater(filters) : updater
              Object.entries(newFilters).forEach(([key, value]) => {
                if (key !== 'search') {
                  handleFilterChange(key as keyof typeof filters, value)
                }
              })
            }}
            onSearchChange={setSearchTerm}
            isSearching={isSearching}
            searchPlaceholder="Cliente ou código do pedido"
            sortOptions={SORT_OPTIONS}
            statusOptions={statusOptions}
            showLimit={true}
            defaultLimit={10}
          />
        </div>

        {/* Lista de Pedidos */}
        <Table
          columns={columns}
          data={orders}
          hasFilters={hasFilters}
          meta={meta}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
