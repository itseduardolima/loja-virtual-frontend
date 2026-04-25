'use client'

import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdminUser } from '@/hooks/useAdminUsers'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function AdminUsuarioDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: user, isLoading } = useAdminUser(Number(id))

  const profileNames: Record<number, string> = { 1: 'Administrador', 2: 'Vendedor', 3: 'Cliente' }

  if (isLoading) return <div className="text-center py-16 text-gray-400">Carregando...</div>
  if (!user) return <div className="text-center py-16 text-gray-400">Usuário não encontrado.</div>

  return (
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Detalhes do Usuário</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-5 w-5" />
            Informações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Nome</p>
              <p className="font-medium">{user.name ?? '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="font-medium">{user.email ?? '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Telefone</p>
              <p className="font-medium">{(user as any).phone ?? '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Perfil</p>
              <p className="font-medium">{profileNames[user.profile_id] ?? '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {user.status === 1 ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">ID</p>
              <p className="font-medium">#{user.id}</p>
            </div>
            {user.created_at && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Cadastrado em</p>
                <p className="font-medium">
                  {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
