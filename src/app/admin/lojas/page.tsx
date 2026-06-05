'use client'

import { Store } from 'lucide-react'
import { Table, Column } from '@/components'
import { AdminStore } from '@/types/admin'
import { Meta } from '@/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { SearchInput } from '@/components/ui/search-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLojasPage } from './useLojasPage'
import { SectionCard } from '../_shared'
import { LoadingPage } from '@/components/Layout'

export default function AdminLojasPage() {
  const { stores, meta, isLoading, page, setPage, search, setSearch, statusFilter, setStatusFilter, handleToggle } = useLojasPage()

  const columns: Column<AdminStore>[] = [
    { key: 'name',     header: 'Nome',        accessor: 'name' },
    { key: 'slug',     header: 'Slug',        accessor: 'slug' },
    { key: 'owner',    header: 'Dono',        accessor: (row) => row.user?.name ?? '-' },
    { key: 'email',    header: 'Email',       accessor: (row) => row.user?.email ?? '-' },
    { key: 'location', header: 'Cidade/Estado', accessor: (row) => [row.city, row.state].filter(Boolean).join(' / ') || '-' },
    {
      key: 'created_at',
      header: 'Criada em',
      accessor: (row) => row.created_at ? format(new Date(row.created_at), 'dd/MM/yyyy', { locale: ptBR }) : '-',
      type: 'date',
    },
    {
      key: 'actions',
      header: 'Status',
      accessor: 'id',
      type: 'actions',
      options: {
        align: 'right',
        actions: [{ type: 'switch', getChecked: (row) => row.status === 1, onClick: handleToggle }],
      },
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">Lojas</h1>
        <p className="mt-0.5 text-[13px] text-nxi2">Gerencie todas as lojas da plataforma</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          onClear={() => { setSearch(''); setPage(1) }}
          placeholder="Buscar por nome ou slug…"
          className="w-full sm:max-w-xs bg-white h-12 rounded-xl"
        />
        <Select value={statusFilter || 'all'} onValueChange={(v) => { setStatusFilter(v === 'all' ? '' : v); setPage(1) }}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="1">Ativa</SelectItem>
            <SelectItem value="0">Inativa</SelectItem>
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
            data={stores}
            meta={meta as Meta}
            onPageChange={setPage}
            emptyState={{ icon: Store, title: 'Nenhuma loja encontrada' }}
          />
        )}
      </SectionCard>
    </div>
  )
}
