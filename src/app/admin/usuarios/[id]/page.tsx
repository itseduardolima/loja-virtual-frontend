'use client'

import { notFound } from 'next/navigation'
import { ArrowLeft, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { LoadingPage, ErrorState } from '@/components/Layout'
import { useAdminUserDetailPage } from './useAdminUserDetailPage'

export default function AdminUsuarioDetailPage() {
  const { user, isLoading, isError, refetch, userNotFound, profileName, goBack } = useAdminUserDetailPage()

  if (isLoading) return <LoadingPage />
  if (userNotFound) return notFound()
  if (isError) {
    return (
      <div className="py-16">
        <ErrorState
          fullScreen={false}
          message="Erro ao carregar usuário"
          onRetry={() => refetch()}
          retryText="Tentar novamente"
        />
      </div>
    )
  }
  if (!user) return null

  return (
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={goBack}>
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
              <p className="font-medium">{user.phone ?? '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Perfil</p>
              <p className="font-medium">{profileName}</p>
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
