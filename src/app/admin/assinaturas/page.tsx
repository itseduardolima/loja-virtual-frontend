'use client'

import { Receipt, Search, RefreshCw } from 'lucide-react'
import { Table, Column } from '@/components'
import { AdminSubscription } from '@/types/admin'
import { format, differenceInCalendarDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useAssinaturasPage } from './useAssinaturasPage'

function getExpiryBadge(row: AdminSubscription): { label: string; color: string } | null {
  if (row.status !== 'active' || !row.current_period_end) return null
  const days = differenceInCalendarDays(new Date(row.current_period_end), new Date())
  if (days < 0) return null
  if (days === 0) return { label: 'Vence hoje', color: 'expires_today' }
  if (days <= 7) return { label: `Vence em ${days}d`, color: 'expires_soon' }
  return null
}

export default function AdminAssinaturasPage() {
  const { subs, meta, isLoading, page, setPage, search, setSearch, statusFilter, setStatusFilter, statusMap, handleSync, isSyncing } = useAssinaturasPage()

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
      key: 'expiry',
      header: 'Alerta',
      accessor: (row) => getExpiryBadge(row),
      type: 'badge',
      options: {
        badgeColors: {
          expires_today: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
          expires_soon: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
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
  ]

  return (
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assinaturas</h1>
          <p className="text-gray-500 text-sm mt-1">Visão geral de todas as assinaturas</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSync}
          disabled={isSyncing}
          className="shrink-0"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
        </Button>
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
