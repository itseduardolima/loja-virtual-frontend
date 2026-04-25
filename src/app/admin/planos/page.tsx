'use client'

import { useRouter } from 'next/navigation'
import { CreditCard, Plus, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table, Column, ConfirmDialog } from '@/components'
import { AdminPlan } from '@/types/admin'
import { usePlanosPage } from './usePlanosPage'

export default function AdminPlanosPage() {
  const router = useRouter()
  const { plans, meta, isLoading, page, setPage, confirmDelete, setConfirmDelete, handleDelete } = usePlanosPage()

  const columns: Column<AdminPlan>[] = [
    { key: 'name', header: 'Nome', accessor: 'name' },
    { key: 'slug', header: 'Slug', accessor: 'slug' },
    {
      key: 'price',
      header: 'Preço',
      accessor: (row) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(row.price)),
      type: 'price',
    },
    { key: 'billing_cycle', header: 'Ciclo', accessor: (row) => row.billing_cycle === 'monthly' ? 'Mensal' : 'Anual' },
    { key: 'max_products', header: 'Produtos Máx.', accessor: (row) => row.max_products ?? 'Ilimitado' },
    {
      key: 'status',
      header: 'Status',
      accessor: (row) => ({ label: row.status === 1 ? 'Ativo' : 'Inativo', color: row.status === 1 ? 'active' : 'inactive' }),
      type: 'badge',
      options: {
        badgeColors: {
          active: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
          inactive: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
        },
      },
    },
    {
      key: 'actions',
      header: 'Ações',
      accessor: 'id',
      type: 'actions',
      options: {
        align: 'right',
        actions: [
          {
            type: 'button',
            icon: Pencil,
            variant: 'ghost',
            onClick: (row) => router.push(`/admin/planos/editar/${row.id}`),
          },
        ],
      },
    },
  ]

  return (
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planos</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os planos de assinatura</p>
        </div>
        <Button onClick={() => router.push('/admin/planos/criar')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Plano
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-400">Carregando...</div>
      ) : (
        <Table
          columns={columns}
          data={plans}
          meta={meta as any}
          onPageChange={setPage}
          emptyState={{ icon: CreditCard, title: 'Nenhum plano encontrado', description: 'Crie um plano para começar.' }}
        />
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(open) => { if (!open) setConfirmDelete(null) }}
        title="Desativar Plano"
        description={`Tem certeza que deseja desativar o plano "${confirmDelete?.name}"?`}
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  )
}
