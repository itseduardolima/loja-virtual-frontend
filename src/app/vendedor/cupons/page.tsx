'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button, ErrorState, ConfirmDialog } from '@/components'
import { Table } from '@/components/Table/Table'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Tag, TrendingUp, Ban, Clock, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCuponsPage } from './useCuponsPage'
import LoadingPage from '@/components/Layout/LoadingPage'

export default function CuponsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const {
    coupons,
    isLoading,
    error,
    stats,
    search,
    setSearch,
    columns,
    deleteDialogOpen,
    setDeleteDialogOpen,
    couponToDelete,
    handleDeleteConfirm,
    isDeleting,
  } = useCuponsPage()

  if (authLoading) return <LoadingPage />
  if (!user) return <ErrorState message="Você precisa estar logado para gerenciar cupons" />
  if (isLoading) return <LoadingPage />
  if (error) return <ErrorState message="Erro ao carregar cupons" />

  const statsCards = [
    {
      value: stats.total,
      label: ['Total de', 'Cupons'],
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-400',
      textColor: 'text-blue-700',
      icon: Tag,
    },
    {
      value: stats.active,
      label: ['Cupons', 'Ativos'],
      bgColor: 'bg-green-50',
      borderColor: 'border-green-400',
      textColor: 'text-green-700',
      icon: TrendingUp,
    },
    {
      value: stats.expired,
      label: ['Cupons', 'Expirados'],
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-400',
      textColor: 'text-orange-700',
      icon: Clock,
    },
    {
      value: stats.inactive,
      label: ['Cupons', 'Inativos'],
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-600',
      icon: Ban,
    },
  ]

  return (
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      {/* Título */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Cupons de Desconto</h1>
          <p className="text-gray-600">Crie e gerencie cupons para seus clientes</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            onClick={() => router.push('/vendedor/cupons/criar')}
            className="flex items-center gap-2 px-6 py-2 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Novo Cupom
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="mb-4 sm:mb-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          {statsCards.map((card, index) => {
            const Icon = card.icon
            return (
              <Card
                key={index}
                className={`${card.bgColor} ${card.borderColor} border-2 transition-shadow`}
              >
                <CardContent className="p-3 sm:p-4 lg:p-6">
                  <div className="flex items-center justify-between gap-2 sm:gap-3 lg:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
                      <p className={`text-4xl sm:text-5xl lg:text-7xl font-bold ${card.textColor} leading-none`}>
                        {card.value}
                      </p>
                      <div className="flex flex-col min-w-0">
                        {card.label.map((line, i) => (
                          <p key={i} className={`text-xs sm:text-sm font-bold ${card.textColor} leading-tight`}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                    <Icon className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 ${card.textColor} flex-shrink-0`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Busca */}
      <div className="relative w-full sm:max-w-md mb-4 sm:mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        <Input
          type="text"
          placeholder="Buscar por código..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 sm:pl-10 py-2 sm:py-3 text-sm sm:text-base"
        />
      </div>

      {/* Tabela */}
      <Table
        columns={columns}
        data={coupons}
        hasFilters={!!search}
        emptyState={{
          icon: Tag,
          title: 'Nenhum cupom encontrado',
          description: (hasFilters) =>
            hasFilters
              ? 'Tente ajustar a busca'
              : 'Comece criando seu primeiro cupom de desconto',
          action: {
            label: 'Criar Primeiro Cupom',
            icon: Plus,
            onClick: () => router.push('/vendedor/cupons/criar'),
            show: (hasFilters) => !hasFilters,
          },
        }}
      />

      {/* Confirmação de exclusão */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Excluir Cupom"
        description={`Tem certeza que deseja excluir o cupom "${couponToDelete?.code}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  )
}
