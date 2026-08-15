'use client'

import {
  Search,
  ChevronDown,
  Users,
  SearchX,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getInitials, avatarHueFor } from '@/lib/vendor'
import type { AdminUser } from '@/types/admin'
import { UserDetailDrawer } from '@/components/Admin'
import { useUsuariosPage } from './useUsuariosPage'

// ─── helpers ──────────────────────────────────────────────────────────────────

const PROFILE_NAMES: Record<number, string> = {
  1: 'Administrador',
  2: 'Vendedor',
  3: 'Cliente',
}

function roleBadgeStyle(profileId: number): React.CSSProperties {
  if (profileId === 1)
    return {
      color: '#2A2D7C',
      background: 'rgba(42,45,124,0.08)',
      boxShadow: 'inset 0 0 0 1px rgba(42,45,124,0.18)',
    }
  if (profileId === 2)
    return {
      color: '#5557A8',
      background: 'rgba(42,45,124,0.05)',
      boxShadow: 'inset 0 0 0 1px rgba(42,45,124,0.12)',
    }
  return {
    color: '#6B6E82',
    background: 'rgba(138,140,163,0.1)',
    boxShadow: 'inset 0 0 0 1px rgba(138,140,163,0.2)',
  }
}

// ─── sub-components ───────────────────────────────────────────────────────────

function Sk({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-[#ECEDF2]', className)} />
}

function Toggle({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onToggle()
      }}
      className="flex h-[23px] w-[40px] shrink-0 items-center rounded-full border-none p-[2px] transition-colors"
      style={{
        background: checked ? '#3F8A66' : '#D7D9E3',
        justifyContent: checked ? 'flex-end' : 'flex-start',
      }}
    >
      <span className="h-[19px] w-[19px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
    </button>
  )
}

const GRID = 'grid grid-cols-[1.7fr_2fr_1.3fr_1.2fr_1fr_64px] gap-3 items-center'

function TableHeader() {
  return (
    <div
      className={cn(
        GRID,
        'bg-[#FBFBFD] px-[18px] py-3 text-[10.5px] font-extrabold uppercase tracking-[.05em] text-nxi3',
      )}
    >
      <div>Nome</div>
      <div>E-mail</div>
      <div>Telefone</div>
      <div>Perfil</div>
      <div>Status</div>
      <div className="text-center">Ver</div>
    </div>
  )
}

function SkRow({ borderTop = true }: { borderTop?: boolean }) {
  return (
    <div className={cn(GRID, 'px-[18px] py-[13px]', borderTop && 'border-t border-[#F0F1F5]')}>
      <div className="flex items-center gap-[10px]">
        <Sk className="h-8 w-8 rounded-[9px]" />
        <Sk className="h-[13px] w-[65%]" />
      </div>
      <Sk className="h-3 w-[85%]" />
      <Sk className="h-3 w-[70%]" />
      <Sk className="h-5 w-[76px] rounded-full" />
      <Sk className="h-[23px] w-[40px] rounded-full" />
      <div className="flex justify-center">
        <Sk className="h-8 w-8 rounded-[9px]" />
      </div>
    </div>
  )
}

function UserRow({
  user,
  isSelected,
  onSelect,
  onToggle,
}: {
  user: AdminUser
  isSelected: boolean
  onSelect: () => void
  onToggle: () => void
}) {
  return (
    <div
      className={cn(
        GRID,
        'border-t border-[#F0F1F5] px-[18px] py-[13px] transition-colors',
        isSelected ? 'bg-[#F4F5FB]' : 'bg-white hover:bg-[#FAFAFE]',
      )}
    >
      <div className="flex min-w-0 items-center gap-[10px]">
        <span
          className="flex h-8 w-8 flex-none items-center justify-center rounded-[9px] text-[12px] font-extrabold text-white"
          style={{ background: avatarHueFor(user.name ?? '') }}
        >
          {getInitials(user.name ?? '')}
        </span>
        <span className="truncate text-[13px] font-bold text-nxi1">{user.name}</span>
      </div>
      <div className="truncate text-[13px] font-semibold text-nxi2">{user.email}</div>
      <div className="text-[13px] font-semibold text-nxi2">{user.phone || '—'}</div>
      <div>
        <span
          className="inline-flex items-center rounded-full px-[9px] py-[3px] text-[10.5px] font-extrabold uppercase tracking-[.04em]"
          style={roleBadgeStyle(user.profile_id)}
        >
          {PROFILE_NAMES[user.profile_id] ?? '—'}
        </span>
      </div>
      <Toggle checked={user.status === 1} onToggle={onToggle} />
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onSelect}
          title="Ver detalhes"
          className="flex h-8 w-8 items-center justify-center rounded-[9px] border border-nxborder bg-white transition-colors hover:bg-nxbg"
        >
          <ArrowRight size={15} className="text-nxp" />
        </button>
      </div>
    </div>
  )
}

function ListEmpty({ hasFilter, onClear }: { hasFilter: boolean; onClear: () => void }) {
  if (hasFilter) {
    return (
      <div className="flex flex-col items-center border-t border-[#F0F1F5] py-14 text-center">
        <SearchX size={44} className="text-nxi3" />
        <p className="mt-[14px] text-[15px] font-extrabold text-nxi1">
          Nenhum usuário corresponde aos filtros
        </p>
        <p className="mt-1 text-[13px] font-semibold text-nxi2">
          Ajuste a busca, o perfil ou o status.
        </p>
        <button
          type="button"
          onClick={onClear}
          className="mt-[14px] flex items-center gap-[7px] rounded-[9px] border border-nxborder bg-white px-4 h-[38px] text-[13px] font-bold text-nxi2"
        >
          Limpar filtros
        </button>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center border-t border-[#F0F1F5] py-14 text-center">
      <Users size={44} className="text-nxi3" />
      <p className="mt-[14px] text-[15px] font-extrabold text-nxi1">Nenhum usuário encontrado</p>
      <p className="mt-1 text-[13px] font-semibold text-nxi2">
        Ainda não há usuários cadastrados na plataforma.
      </p>
    </div>
  )
}

function ListError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center border-t border-[#F0F1F5] py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[rgba(193,58,46,0.08)]">
        <AlertCircle size={24} className="text-[#C13A2E]" />
      </span>
      <p className="mt-[14px] text-[15px] font-extrabold text-nxi1">Erro ao carregar a lista</p>
      <p className="mt-1 text-[13px] font-semibold text-nxi2">
        Não foi possível buscar os usuários da plataforma.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-[14px] flex items-center gap-[7px] rounded-[9px] bg-nxp px-4 h-[38px] text-[13px] font-bold text-white"
      >
        <RefreshCw size={14} />
        Tentar novamente
      </button>
    </div>
  )
}

function TablePagination({
  currentPage,
  lastPage,
  total,
  perPage,
  onPageChange,
}: {
  currentPage: number
  lastPage: number
  total: number
  perPage: number
  onPageChange: (p: number) => void
}) {
  const start = (currentPage - 1) * perPage + 1
  const end = Math.min(currentPage * perPage, total)

  const pages: number[] = []
  let from = Math.max(1, currentPage - 1)
  let to = Math.min(lastPage, currentPage + 1)
  if (to - from < 2) {
    if (from === 1) to = Math.min(lastPage, 3)
    else from = Math.max(1, to - 2)
  }
  for (let p = from; p <= to; p++) pages.push(p)

  const btn =
    'flex h-[38px] w-[38px] items-center justify-center rounded-[9px] text-[13px] font-bold'

  return (
    <div className="flex items-center justify-between">
      <span className="text-[12.5px] font-semibold text-nxi3">
        Mostrando {start}–{end} de {total} usuários
      </span>
      <div className="flex gap-[6px]">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(btn, 'border border-nxborder bg-white text-nxi2 disabled:opacity-40')}
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={cn(
              btn,
              p === currentPage
                ? 'bg-nxp text-white'
                : 'border border-nxborder bg-white text-nxi2',
            )}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className={cn(btn, 'border border-nxborder bg-white text-nxi2 disabled:opacity-40')}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function AdminUsuariosPage() {
  const {
    users,
    meta,
    isLoading,
    isError,
    refetch,
    page,
    setPage,
    search,
    setSearch,
    profileFilter,
    setProfileFilter,
    statusFilter,
    setStatusFilter,
    selectedUserId,
    setSelectedUserId,
    handleToggleStatus,
    hasActiveFilters,
    clearFilters,
  } = useUsuariosPage()

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">Usuários</h1>
          <p className="mt-0.5 text-[13px] font-semibold text-nxi2">
            Gerencie todos os usuários da plataforma
          </p>
        </div>
        {!isLoading && meta != null && (
          <span className="flex shrink-0 items-center gap-[6px] h-[30px] rounded-full border border-nxborder bg-white px-3 text-[12px] font-extrabold text-nxi2">
            <Users size={14} />
            {meta.total} usuários
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[400px]">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-nxi3"
          />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Buscar por nome ou e-mail…"
            className="h-[40px] w-full rounded-[10px] border border-nxborder bg-white pl-9 pr-3 text-[13px] font-semibold text-nxi1 placeholder:text-nxi3 outline-none focus:ring-2 focus:ring-[rgba(42,45,124,0.15)]"
          />
        </div>
        <div className="relative">
          <select
            value={profileFilter || 'all'}
            onChange={(e) => {
              setProfileFilter(e.target.value === 'all' ? '' : e.target.value)
              setPage(1)
            }}
            className="h-[40px] cursor-pointer appearance-none rounded-[10px] border border-nxborder bg-white pl-3 pr-8 text-[13px] font-bold text-nxi1 outline-none focus:ring-2 focus:ring-[rgba(42,45,124,0.15)]"
          >
            <option value="all">Todos os perfis</option>
            <option value="1">Administrador</option>
            <option value="2">Vendedor</option>
            <option value="3">Cliente</option>
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-[11px] top-1/2 -translate-y-1/2 text-nxi3"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter || 'all'}
            onChange={(e) => {
              setStatusFilter(e.target.value === 'all' ? '' : e.target.value)
              setPage(1)
            }}
            className="h-[40px] cursor-pointer appearance-none rounded-[10px] border border-nxborder bg-white pl-3 pr-8 text-[13px] font-bold text-nxi1 outline-none focus:ring-2 focus:ring-[rgba(42,45,124,0.15)]"
          >
            <option value="all">Todos os status</option>
            <option value="1">Ativo</option>
            <option value="0">Inativo</option>
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-[11px] top-1/2 -translate-y-1/2 text-nxi3"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <TableHeader />
            {isLoading ? (
              [0, 1, 2, 3].map((i) => <SkRow key={i} borderTop={i > 0} />)
            ) : isError ? (
              <ListError onRetry={() => refetch()} />
            ) : users.length === 0 ? (
              <ListEmpty hasFilter={hasActiveFilters} onClear={clearFilters} />
            ) : (
              users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  isSelected={selectedUserId === user.id}
                  onSelect={() => setSelectedUserId(user.id)}
                  onToggle={() => handleToggleStatus(user)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && !isError && meta && meta.lastPage > 1 && users.length > 0 && (
        <TablePagination
          currentPage={meta.currentPage}
          lastPage={meta.lastPage}
          total={meta.total}
          perPage={meta.perPage}
          onPageChange={setPage}
        />
      )}

      {/* Detail drawer */}
      <UserDetailDrawer
        userId={selectedUserId}
        open={selectedUserId !== null}
        onClose={() => setSelectedUserId(null)}
      />
    </div>
  )
}
