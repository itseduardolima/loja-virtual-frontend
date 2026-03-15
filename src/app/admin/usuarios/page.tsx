'use client'

import { Users, Eye, Search } from 'lucide-react'
import { Table, Column } from '@/components'
import { AdminUser } from '@/types/admin'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserDetailDrawer } from '@/components/Admin/UserDetailDrawer'
import { useUsuariosPage } from './useUsuariosPage'

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
    { key: 'name', header: 'Nome', accessor: 'name' },
    { key: 'email', header: 'Email', accessor: 'email' },
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
          admin: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
          vendor: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
          client: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
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
            type: 'switch',
            getChecked: (row) => row.status === 1,
            onClick: handleToggleStatus,
          },
          {
            type: 'button',
            icon: Eye,
            variant: 'ghost',
            onClick: (row) => setSelectedUserId(row.id),
          },
        ],
      },
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie todos os usuários da plataforma</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-9"
          />
        </div>
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

      {isLoading ? (
        <div className="text-center py-16 text-gray-400">Carregando...</div>
      ) : (
        <Table
          columns={columns}
          data={Array.isArray(users) ? users : []}
          meta={meta as any}
          onPageChange={setPage}
          emptyState={{ icon: Users, title: 'Nenhum usuário encontrado', description: 'Nenhum usuário corresponde aos filtros.' }}
        />
      )}
      <UserDetailDrawer
        userId={selectedUserId}
        open={selectedUserId !== null}
        onClose={() => setSelectedUserId(null)}
      />
    </div>
  )
}
