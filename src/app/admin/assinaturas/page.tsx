'use client'

import { Receipt, Search } from 'lucide-react'
import { Table, Column } from '@/components'
import { AdminSubscription } from '@/types/admin'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAssinaturasPage } from './useAssinaturasPage'

export default function AdminAssinaturasPage() {
  const { subs, meta, isLoading, page, setPage, search, setSearch, statusFilter, setStatusFilter, statusMap } = useAssinaturasPage()

  const columns: Column<AdminSubscription>[] = [
    { key: 'user', header: 'Usuário', accessor: (row) => row.user?.name ?? '-' },
    { key: 'email', header: 'Email', accessor: (row) => row.user?.email ?? '-' },
    { key: 'plan', header: 'Plano', accessor: (row) => row.plan?.name ?? '-' },
    {
      key: 'status',
      header: 'Status',
      accessor: (row) => {
        const s = statusMap[row.status] ?? { label: row.status, color: 'default' }
        return { label: s.label, color: s.color }
      },
      type: 'badge',
      options: {
        badgeColors: {
          active: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
          pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
          expired: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
          canceled: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
          default: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
        },
      },
    },
    {
      key: 'period',
      header: 'Período',
      accessor: (row) => {
        if (!row.current_period_start) return '-'
        return `${format(new Date(row.current_period_start), 'dd/MM/yy', { locale: ptBR })} - ${format(new Date(row.current_period_end), 'dd/MM/yy', { locale: ptBR })}`
      },
    },
    { key: 'provider', header: 'Provedor', accessor: 'payment_provider' },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assinaturas</h1>
        <p className="text-gray-500 text-sm mt-1">Visão geral de todas as assinaturas</p>
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
        <Select value={statusFilter || 'all'} onValueChange={(v) => { setStatusFilter(v === 'all' ? '' : v); setPage(1) }}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativa</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="expired">Expirada</SelectItem>
            <SelectItem value="canceled">Cancelada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-400">Carregando...</div>
      ) : (
        <Table
          columns={columns}
          data={subs}
          meta={meta as any}
          onPageChange={setPage}
          emptyState={{ icon: Receipt, title: 'Nenhuma assinatura encontrada' }}
        />
      )}
    </div>
  )
}
