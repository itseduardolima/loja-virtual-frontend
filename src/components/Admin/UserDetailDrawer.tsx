'use client'

import { X, RefreshCw, ArrowLeft, UserX, UserCheck, AlertCircle } from 'lucide-react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useAdminUser, useAdminToggleUserStatus } from '@/hooks/useAdminUsers'
import { getInitials, avatarHueFor } from '@/lib/vendor'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { AxiosError } from 'axios'
import { useToastContext } from '@/contexts/ToastContext'

interface UserDetailDrawerProps {
  userId: number | null
  open: boolean
  onClose: () => void
}

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

function Sk({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={cn('animate-pulse rounded-lg bg-[#ECEDF2]', className)} style={style} />
}

function InfoRow({
  label,
  value,
  last = false,
}: {
  label: string
  value: React.ReactNode
  last?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between py-[10px]',
        !last && 'border-b border-[#F0F1F5]',
      )}
    >
      <span className="text-[12.5px] font-bold text-nxi3">{label}</span>
      <span className="text-[13px] font-bold text-nxi1">{value}</span>
    </div>
  )
}

export function UserDetailDrawer({ userId, open, onClose }: UserDetailDrawerProps) {
  const { success, error: showError } = useToastContext()
  const { data: user, isLoading, isError, error, refetch } = useAdminUser(userId ?? 0)
  const toggleStatus = useAdminToggleUserStatus()

  const isNotFound =
    isError && (error as AxiosError | null)?.response?.status === 404

  const isActive = user?.status === 1

  const handleToggle = async () => {
    if (!userId) return
    try {
      await toggleStatus.mutateAsync(userId)
      success('Status atualizado com sucesso')
    } catch {
      showError('Erro ao atualizar status do usuário')
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <SheetContent
        side="right"
        className="flex flex-col p-0 w-full sm:w-[440px] sm:max-w-[440px] [&>button]:hidden"
      >
        {/* ── Loading ── */}
        {isLoading && (
          <>
            <div className="border-b border-nxborder px-[22px] py-[22px]">
              <div className="flex items-start gap-[14px]">
                <Sk className="h-[54px] w-[54px] rounded-[14px]" />
                <div className="flex-1 pt-0.5">
                  <Sk className="h-[18px] w-[70%]" />
                  <Sk className="mt-2 h-3 w-[85%]" />
                </div>
              </div>
              <div className="mt-[14px] flex gap-2">
                <Sk className="h-6 w-[100px] rounded-full" />
                <Sk className="h-6 w-[70px] rounded-full" />
              </div>
            </div>
            <div className="flex-1 px-[22px] py-[18px]">
              <Sk className="h-[10px] w-[80px]" />
              <div className="mt-[14px] flex flex-col gap-[18px]">
                {[
                  { l: 60, v: 130 },
                  { l: 70, v: 100 },
                  { l: 65, v: 90 },
                ].map((s, i) => (
                  <div key={i} className="flex justify-between">
                    <Sk className="h-3" style={{ width: s.l }} />
                    <Sk className="h-3" style={{ width: s.v }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-nxborder px-[22px] py-4">
              <Sk className="h-[42px] rounded-[9px]" />
            </div>
          </>
        )}

        {/* ── Not found ── */}
        {!isLoading && isNotFound && (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-nxbg">
              <UserX size={24} className="text-nxi3" />
            </span>
            <p className="mt-[14px] text-[15px] font-extrabold text-nxi1">
              Usuário não encontrado
            </p>
            <p className="mt-1 text-[13px] font-semibold text-nxi2">
              Este registro não existe ou pode ter sido removido.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-[14px] flex items-center gap-[7px] rounded-[9px] border border-nxborder bg-white px-4 h-[38px] text-[13px] font-bold text-nxi2"
            >
              <ArrowLeft size={14} />
              Voltar para a lista
            </button>
          </div>
        )}

        {/* ── Error ── */}
        {!isLoading && isError && !isNotFound && (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[rgba(193,58,46,0.08)]">
              <AlertCircle size={24} className="text-[#C13A2E]" />
            </span>
            <p className="mt-[14px] text-[15px] font-extrabold text-nxi1">
              Erro ao carregar o usuário
            </p>
            <p className="mt-1 text-[13px] font-semibold text-nxi2">
              Não foi possível buscar os dados deste usuário.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-[14px] flex items-center gap-[7px] rounded-[9px] bg-nxp px-4 h-[38px] text-[13px] font-bold text-white"
            >
              <RefreshCw size={14} />
              Tentar novamente
            </button>
          </div>
        )}

        {/* ── Loaded ── */}
        {!isLoading && !isError && user && (
          <>
            <div className="border-b border-nxborder px-[22px] py-[22px]">
              <div className="flex items-start gap-[14px]">
                <span
                  className="flex h-[54px] w-[54px] flex-none items-center justify-center rounded-[14px] text-[19px] font-extrabold text-white"
                  style={{ background: avatarHueFor(user.name ?? '') }}
                >
                  {getInitials(user.name ?? '')}
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-[18px] font-extrabold leading-snug tracking-[-0.02em] text-nxi1">
                    {user.name}
                  </p>
                  <p className="mt-0.5 truncate text-[13px] font-semibold text-nxi2">
                    {user.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 flex-none items-center justify-center rounded-[9px] border border-nxborder bg-white"
                >
                  <X size={17} className="text-nxi2" />
                </button>
              </div>
              <div className="mt-[14px] flex gap-2">
                <span
                  className="inline-flex items-center rounded-full px-[10px] py-1 text-[10.5px] font-extrabold uppercase tracking-[.04em]"
                  style={roleBadgeStyle(user.profile_id)}
                >
                  {PROFILE_NAMES[user.profile_id] ?? '—'}
                </span>
                <span
                  className="inline-flex items-center gap-[5px] rounded-full px-[10px] py-1 text-[10.5px] font-extrabold uppercase tracking-[.04em]"
                  style={
                    isActive
                      ? {
                          color: '#2E6B4E',
                          background: 'rgba(63,138,102,0.08)',
                          boxShadow: 'inset 0 0 0 1px rgba(63,138,102,0.18)',
                        }
                      : {
                          color: '#8A8CA3',
                          background: 'rgba(138,140,163,0.1)',
                          boxShadow: 'inset 0 0 0 1px rgba(138,140,163,0.2)',
                        }
                  }
                >
                  <span
                    className="h-[6px] w-[6px] rounded-full"
                    style={{ background: isActive ? '#2E6B4E' : '#8A8CA3' }}
                  />
                  {isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-auto px-[22px] py-[18px]">
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[.06em] text-nxi3">
                Informações
              </p>
              <InfoRow label="Telefone" value={user.phone || 'Não informado'} />
              <InfoRow
                label="ID interno"
                value={
                  <span className="font-mono text-[12px] text-nxi2">USR-{user.id}</span>
                }
              />
              <InfoRow
                label="Cadastro"
                value={
                  user.created_at
                    ? format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR })
                    : '—'
                }
                last
              />
            </div>

            <div className="border-t border-nxborder px-[22px] py-4">
              <button
                type="button"
                onClick={handleToggle}
                disabled={toggleStatus.isPending}
                className={cn(
                  'flex w-full h-[42px] items-center justify-center gap-[7px] rounded-[9px] text-[13px] font-bold text-white disabled:opacity-60',
                  isActive ? 'bg-[#C13A2E]' : 'bg-nxp',
                )}
              >
                {isActive ? (
                  <>
                    <UserX size={15} />
                    Desativar usuário
                  </>
                ) : (
                  <>
                    <UserCheck size={15} />
                    Ativar usuário
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
