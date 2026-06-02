'use client'

import { Receipt, RefreshCw } from 'lucide-react'
import { Table, Column } from '@/components'
import { AdminSubscription } from '@/types/admin'
import { format, differenceInCalendarDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { SearchInput } from '@/components/ui/search-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAssinaturasPage } from './useAssinaturasPage'
import { SectionCard, NxButton } from '../_shared'
import LoadingPage from '@/components/Layout/LoadingPage'

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
    { key: 'user',  header: 'Usuário', accessor: (row) => row.user?.name ?? '-' },
    { key: 'email', header: 'Email',   accessor: (row) => row.user?.email ?? '-' },
    { key: 'plan',  header: 'Plano',   accessor: (row) => row.plan?.name ?? '-' },
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
          active:   { bg: 'bg-nxs/[0.08]',  text: 'text-nxs',  border: 'ring-1 ring-nxs/20' },
          pending:  { bg: 'bg-nxw/[0.08]',  text: 'text-nxw',  border: 'ring-1 ring-nxw/20' },
          expired:  { bg: 'bg-nxd/[0.08]',  text: 'text-nxd',  border: 'ring-1 ring-nxd/20' },
          canceled: { bg: 'bg-nxi3/[0.08]', text: 'text-nxi3', border: 'ring-1 ring-nxborder' },
          default:  { bg: 'bg-nxi3/[0.08]', text: 'text-nxi3', border: 'ring-1 ring-nxborder' },
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
          expires_today: { bg: 'bg-nxd/[0.08]', text: 'text-nxd', border: 'ring-1 ring-nxd/20' },
          expires_soon:  { bg: 'bg-nxw/[0.08]', text: 'text-nxw', border: 'ring-1 ring-nxw/20' },
        },
      },
    },
    {
      key: 'period',
      header: 'Período',
      accessor: (row) => {
        if (!row.current_period_start) return '-'
        return `${format(new Date(row.current_period_start), 'dd/MM/yy', { locale: ptBR })} – ${format(new Date(row.current_period_end), 'dd/MM/yy', { locale: ptBR })}`
      },
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">Assinaturas</h1>
          <p className="mt-0.5 text-[13px] text-nxi2">Visão geral de todas as assinaturas</p>
        </div>
        <NxButton variant="ghost" onClick={handleSync} disabled={isSyncing} className="shrink-0">
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Sincronizando…' : 'Sincronizar'}
        </NxButton>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          onClear={() => { setSearch(''); setPage(1) }}
          placeholder="Buscar por usuário…"
          className="w-full sm:max-w-xs bg-white h-12 rounded-xl"
        />
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

      <SectionCard flush>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <LoadingPage />
          </div>
        ) : (
          <Table
            columns={columns}
            data={subs}
            meta={meta as any}
            onPageChange={setPage}
            emptyState={{ icon: Receipt, title: 'Nenhuma assinatura encontrada' }}
          />
        )}
      </SectionCard>
    </div>
  )
}
