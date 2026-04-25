'use client'

import { RotateCcw, CheckCircle, XCircle, Search } from 'lucide-react'
import { Table, Column, ConfirmDialog } from '@/components'
import { AdminRefund } from '@/types/admin'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Input } from '@/components/ui/input'
import { useEstornosPage } from './useEstornosPage'

export default function AdminEstornosPage() {
  const {
    refunds, meta, isLoading,
    page, setPage,
    search, setSearch,
    confirmAction, setConfirmAction,
    handleAction,
    methodMap,
  } = useEstornosPage()

  const columns: Column<AdminRefund>[] = [
    { key: 'user', header: 'Usuário', accessor: (row) => row.subscription?.user?.name ?? '-' },
    { key: 'email', header: 'Email', accessor: (row) => row.subscription?.user?.email ?? '-' },
    { key: 'plan', header: 'Plano', accessor: (row) => row.subscription?.plan?.name ?? '-' },
    {
      key: 'amount',
      header: 'Valor',
      accessor: (row) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(row.amount)),
      type: 'price',
    },
    { key: 'method', header: 'Método', accessor: (row) => methodMap[row.payment_method] ?? row.payment_method },
    {
      key: 'date',
      header: 'Data',
      accessor: (row) => row.updated_at ? format(new Date(row.updated_at), 'dd/MM/yyyy', { locale: ptBR }) : '-',
      type: 'date',
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
            icon: CheckCircle,
            variant: 'ghost',
            className: 'h-8 w-8 p-0 text-green-600 hover:text-green-700',
            onClick: (row) => setConfirmAction({ refund: row, action: 'approve' }),
          },
          {
            type: 'button',
            icon: XCircle,
            variant: 'ghost',
            className: 'h-8 w-8 p-0 text-red-500 hover:text-red-600',
            onClick: (row) => setConfirmAction({ refund: row, action: 'reject' }),
          },
        ],
      },
    },
  ]

  return (
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Estornos</h1>
        <p className="text-gray-500 text-sm mt-1">Pedidos de estorno aguardando revisão</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar por usuário..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-400">Carregando...</div>
      ) : (
        <Table
          columns={columns}
          data={refunds}
          meta={meta as any}
          onPageChange={setPage}
          emptyState={{ icon: RotateCcw, title: 'Nenhum estorno encontrado', description: 'Não há pedidos de estorno no momento.' }}
        />
      )}

      <ConfirmDialog
        open={!!confirmAction}
        onOpenChange={(open) => { if (!open) setConfirmAction(null) }}
        title={confirmAction?.action === 'approve' ? 'Aprovar Estorno' : 'Rejeitar Estorno'}
        description={confirmAction?.action === 'approve'
          ? `Confirma a aprovação do estorno de ${confirmAction?.refund?.subscription?.user?.name}?`
          : `Confirma a rejeição do estorno de ${confirmAction?.refund?.subscription?.user?.name}?`}
        onConfirm={handleAction}
        variant={confirmAction?.action === 'reject' ? 'destructive' : 'default'}
      />
    </div>
  )
}
