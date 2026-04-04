'use client'

import { User } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { useAdminUser } from '@/hooks/useAdminUsers'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface UserDetailDrawerProps {
  userId: number | null
  open: boolean
  onClose: () => void
}

const profileNames: Record<number, string> = {
  1: 'Administrador',
  2: 'Vendedor',
  3: 'Cliente',
}

export function UserDetailDrawer({ userId, open, onClose }: UserDetailDrawerProps) {
  const { data: user, isLoading } = useAdminUser(userId ?? 0)

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <SheetContent side="right" className="flex flex-col p-0 w-full sm:max-w-md">
        <SheetHeader className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-500" />
            <SheetTitle>Detalhes do Usuário</SheetTitle>
          </div>
          <SheetDescription>
            Informações completas do usuário selecionado
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              Carregando...
            </div>
          ) : !user ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              Usuário não encontrado.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Avatar / nome */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-lg">
                    {user.name?.charAt(0)?.toUpperCase() ?? '?'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.name ?? '-'}</p>
                  <p className="text-sm text-gray-500">{user.email ?? '-'}</p>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="ID" value={`#${user.id}`} />
                <InfoItem label="Perfil" value={profileNames[user.profile_id] ?? '-'} />
                <InfoItem label="Telefone" value={(user as any).phone ?? '-'} />
                <InfoItem
                  label="Status"
                  value={
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {user.status === 1 ? 'Ativo' : 'Inativo'}
                    </span>
                  }
                />
                {user.created_at && (
                  <InfoItem
                    label="Cadastrado em"
                    value={format(new Date(user.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  />
                )}
                <InfoItem
                  label="Primeiro acesso"
                  value={(user as any).first_access ? 'Pendente' : 'Concluído'}
                />
              </div>

            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function InfoItem({
  label,
  value,
  className,
}: {
  label: string
  value: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  )
}
