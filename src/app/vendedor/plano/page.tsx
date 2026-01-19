'use client'

import { useMySubscription } from '@/hooks/useMySubscription'
import { useCancelSubscription } from '@/hooks/useCancelSubscription'
import { Card, CardContent, CardHeader, CardTitle, Button, LoadingSpinner } from '@/components'
import { 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Package,
  Store,
  TrendingUp,
  X
} from 'lucide-react'
import { useState } from 'react'

export default function PlanoPage() {
  const { data: subscription, isLoading, error } = useMySubscription()
  const { mutate: cancelSubscription, isPending: isCanceling } = useCancelSubscription()
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const handleCancel = () => {
    if (!subscription) return
    
    cancelSubscription(undefined, {
      onSuccess: () => {
        setShowCancelConfirm(false)
      }
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: {
        label: 'Ativa',
        icon: CheckCircle2,
        className: 'bg-green-100 text-green-800 border-green-200',
        iconClassName: 'text-green-600'
      },
      canceled: {
        label: 'Cancelada',
        icon: XCircle,
        className: 'bg-red-100 text-red-800 border-red-200',
        iconClassName: 'text-red-600'
      },
      expired: {
        label: 'Expirada',
        icon: AlertCircle,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        iconClassName: 'text-yellow-600'
      },
      pending: {
        label: 'Pendente',
        icon: AlertCircle,
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        iconClassName: 'text-blue-600'
      }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.className}`}>
        <Icon className={`w-4 h-4 ${config.iconClassName}`} />
        <span className="text-sm font-semibold">{config.label}</span>
      </div>
    )
  }

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numPrice)
  }

  const formatBillingCycle = (cycle: string) => {
    const cycles: { [key: string]: string } = {
      monthly: 'Mensal',
      yearly: 'Anual'
    }
    return cycles[cycle] || cycle
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !subscription) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Nenhuma assinatura encontrada
            </h2>
            <p className="text-gray-600 mb-6">
              Você ainda não possui uma assinatura ativa.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const plan = subscription.plan
  const features = plan?.features ? (typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features) : []

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Plano</h1>
        <p className="text-gray-600">
          Visualize e gerencie sua assinatura
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card do Plano */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações do Plano */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Plano Atual
                </CardTitle>
                {getStatusBadge(subscription.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nome e Preço do Plano */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {plan?.name || 'Plano Vendedor'}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(plan?.price || 0)}
                  </span>
                  <span className="text-gray-600">
                    / {formatBillingCycle(plan?.billing_cycle || 'monthly')}
                  </span>
                </div>
                {plan?.description && (
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                )}
              </div>

              {/* Features do Plano */}
              {features.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    Recursos Incluídos
                  </h4>
                  <ul className="space-y-2">
                    {features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Limites do Plano */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Produtos</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {plan?.max_products === null ? 'Ilimitados' : (plan?.max_products || 0)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Store className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lojas</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {plan?.max_stores || 1}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações da Assinatura */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Detalhes da Assinatura
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Período Atual</p>
                  <p className="text-base font-semibold text-gray-900">
                    {subscription.current_period_start
                      ? new Date(subscription.current_period_start).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Próxima Renovação</p>
                  <p className="text-base font-semibold text-gray-900">
                    {subscription.current_period_end
                      ? new Date(subscription.current_period_end).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })
                      : 'N/A'}
                  </p>
                </div>
                {subscription.canceled_at && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Cancelado em</p>
                    <p className="text-base font-semibold text-gray-900">
                      {new Date(subscription.canceled_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Método de Pagamento</p>
                  <p className="text-base font-semibold text-gray-900 capitalize">
                    {subscription.payment_provider || 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Card de Ações */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription.status === 'active' && (
                <>
                  {!showCancelConfirm ? (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => setShowCancelConfirm(true)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar Assinatura
                    </Button>
                  ) : (
                    <div className="space-y-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-semibold text-red-900">
                        Confirmar Cancelamento
                      </p>
                      <p className="text-sm text-red-700">
                        Tem certeza que deseja cancelar sua assinatura? 
                        Você perderá o acesso ao painel de vendedor após o período atual.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleCancel}
                          disabled={isCanceling}
                          className="flex-1"
                        >
                          {isCanceling ? 'Cancelando...' : 'Confirmar'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowCancelConfirm(false)}
                          disabled={isCanceling}
                          className="flex-1"
                        >
                          Voltar
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {subscription.status === 'canceled' && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Sua assinatura foi cancelada. Você terá acesso até o final do período atual.
                  </p>
                </div>
              )}

              {subscription.status === 'expired' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    Sua assinatura expirou. Renove para continuar usando o serviço.
                  </p>
                </div>
              )}

              {subscription.status === 'pending' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Aguardando confirmação de pagamento. Sua assinatura será ativada assim que o pagamento for confirmado.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações Adicionais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  • O cancelamento é imediato, mas você mantém acesso até o final do período pago.
                </p>
                <p>
                  • Após o cancelamento, seu perfil será revertido para Cliente.
                </p>
                <p>
                  • Você pode reativar sua assinatura a qualquer momento.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

