'use client'

import { Store, Search } from 'lucide-react'
import { Table, Column } from '@/components'
import { AdminStore } from '@/types/admin'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLojasPage } from './useLojasPage'

export default function AdminLojasPage() {
  const { stores, meta, isLoading, page, setPage, search, setSearch, statusFilter, setStatusFilter, handleToggle } = useLojasPage()

  const columns: Column<AdminStore>[] = [
    { key: 'name', header: 'Nome', accessor: 'name' },
    { key: 'slug', header: 'Slug', accessor: 'slug' },
    { key: 'owner', header: 'Dono', accessor: (row) => row.user?.name ?? '-' },
    { key: 'email', header: 'Email', accessor: (row) => row.user?.email ?? '-' },
    {
      key: 'location',
      header: 'Cidade/Estado',
      accessor: (row) => [row.city, row.state].filter(Boolean).join(' / ') || '-',
    },
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
        actions: [
          {
            type: 'switch',
            getChecked: (row) => row.status === 1,
            onClick: handleToggle,
          },
        ],
      },
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lojas</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie todas as lojas da plataforma</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar por nome ou slug..."
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
            <SelectItem value="1">Ativa</SelectItem>
            <SelectItem value="0">Inativa</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-gray-400">Carregando...</div>
      ) : (
        <Table
          columns={columns}
          data={stores}
          meta={meta as any}
          onPageChange={setPage}
          emptyState={{ icon: Store, title: 'Nenhuma loja encontrada' }}
        />
      )}
    </div>
  )
}
