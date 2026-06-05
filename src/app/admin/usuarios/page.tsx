'use client'

import { Users, Eye } from 'lucide-react'
import { Table, Column } from '@/components'
import { AdminUser } from '@/types/admin'
import { Meta } from '@/types'
import { SearchInput } from '@/components/ui/search-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserDetailDrawer } from '@/components/Admin'
import { useUsuariosPage } from './useUsuariosPage'
import { SectionCard } from '../_shared'
import { LoadingPage } from '@/components/Layout'

export default function AdminUsuariosPage() {
  const {
    users, meta, isLoading,
    page, setPage,
    search, setSearch,
    profileFilter, setProfileFilter,
    statusFilter, setStatusFilter,
    selectedUserId, setSelectedUserId,
    handleToggleStatus,
    profileNames,
  } = useUsuariosPage()

  const columns: Column<AdminUser>[] = [
    { key: 'name',  header: 'Nome',     accessor: 'name' },
    { key: 'email', header: 'Email',    accessor: 'email' },
    { key: 'phone', header: 'Telefone', accessor: 'phone', type: 'phone' },
    {
      key: 'profile',
      header: 'Perfil',
      accessor: (row) => ({
        label: profileNames[row.profile_id] ?? '-',
        color: row.profile_id === 1 ? 'admin' : row.profile_id === 2 ? 'vendor' : 'client',
      }),
      type: 'badge',
      options: {
        badgeColors: {
          admin:  { bg: 'bg-nxp/[0.08]',  text: 'text-nxp',  border: 'ring-1 ring-nxp/20' },
          vendor: { bg: 'bg-nxp/[0.05]',  text: 'text-nxp',  border: 'ring-1 ring-nxp/15' },
          client: { bg: 'bg-nxi3/[0.08]', text: 'text-nxi2', border: 'ring-1 ring-nxborder' },
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
          { type: 'switch', getChecked: (row) => row.status === 1, onClick: handleToggleStatus },
          { type: 'button', icon: Eye, variant: 'ghost', onClick: (row) => setSelectedUserId(row.id) },
        ],
      },
    },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">Usuários</h1>
          <p className="mt-0.5 text-[13px] text-nxi2">Gerencie todos os usuários da plataforma</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          onClear={() => { setSearch(''); setPage(1) }}
          placeholder="Buscar por nome ou email…"
          className="w-full sm:max-w-xs bg-white h-12 rounded-xl"
        />
        <Select value={profileFilter || 'all'} onValueChange={(v) => { setProfileFilter(v === 'all' ? '' : v); setPage(1) }}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Todos os perfis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os perfis</SelectItem>
            <SelectItem value="1">Administrador</SelectItem>
            <SelectItem value="2">Vendedor</SelectItem>
            <SelectItem value="3">Cliente</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter || 'all'} onValueChange={(v) => { setStatusFilter(v === 'all' ? '' : v); setPage(1) }}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="1">Ativo</SelectItem>
            <SelectItem value="0">Inativo</SelectItem>
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
            data={Array.isArray(users) ? users : []}
            meta={meta as Meta}
            onPageChange={setPage}
            emptyState={{ icon: Users, title: 'Nenhum usuário encontrado', description: 'Nenhum usuário corresponde aos filtros.' }}
          />
        )}
      </SectionCard>

      <UserDetailDrawer
        userId={selectedUserId}
        open={selectedUserId !== null}
        onClose={() => setSelectedUserId(null)}
      />
    </div>
  )
}
