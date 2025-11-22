'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button, ErrorState } from '@/components'
import { TableFilters } from '@/components/TableFilters'
import { Table } from '@/components/Table'
import { Plus, Tag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCategoriesPage } from './useCategoriesPage'
import LoadingPage from '@/components/LoadingPage'

export default function CategoriesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const {
    filters,
    categories,
    isLoading,
    error,
    meta,

    handlePageChange,
    handleSearchChange,
    handleSortChange,
    setFilters,
    isSearching,

    columns,
  } = useCategoriesPage()

  if (authLoading) {
    return <LoadingPage />
  }

  if (!user) {
    return <ErrorState message="Você precisa estar logado para gerenciar categorias" />
  }

  if (isLoading) {
    return <LoadingPage />
  }

  if (error) {
    return <ErrorState message="Erro ao carregar categorias" />
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto py-8">
        {/* Título */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Categorias</h1>
            <p className="text-gray-600">Gerencie as categorias dos seus produtos</p>
          </div>

          <Button
            onClick={() => router.push('/vendedor/categorias/criar')}
            className="flex items-center  gap-2  px-6 py-2 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Nova Categoria
          </Button>
        </div>



        {/* Filtros */}
        <div className="mb-8">
          <TableFilters
            filters={filters}
            setFilters={setFilters}
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
            isSearching={isSearching}
          />
        </div>

        {/* Lista de Categorias em Tabela */}
        {!isLoading && (
          <Table
            columns={columns}
            data={categories}
            hasFilters={!!filters.search || filters.status !== undefined}
            meta={meta}
            onPageChange={handlePageChange}
            emptyState={{
              icon: Tag,
              title: 'Nenhuma categoria encontrada',
              description: (hasFilters) =>
                hasFilters
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece criando sua primeira categoria para organizar seus produtos',
              action: {
                label: 'Criar Primeira Categoria',
                icon: Plus,
                onClick: () => router.push('/vendedor/categorias/criar'),
                show: (hasFilters) => !hasFilters,
              },
            }}
          />
        )}
      </div>

    </div>
  )
}
