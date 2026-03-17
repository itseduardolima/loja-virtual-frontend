'use client'

import { useMySubscription } from '@/hooks/useMySubscription'
import { useCancelSubscription } from '@/hooks/useCancelSubscription'
import { Card, CardContent, CardHeader, CardTitle, Button, LoadingSpinner } from '@/components'
import { RenewSubscriptionModal } from '@/components/Subscription/RenewSubscriptionModal'
import { RefundModal } from '@/components/Subscription/RefundModal'
import { formatPrice, formatBillingCycle } from '@/lib/utils'
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Package,
  Store,
  X,
  RefreshCw,
  RotateCcw,
  Clock
} from 'lucide-react'
import { useState } from 'react'

export default function PlanoPage() {
  const { data: subscription, isLoading, error } = useMySubscription()
  const { mutate: cancelSubscription, isPending: isCanceling } = useCancelSubscription()
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showRenewModal, setShowRenewModal] = useState(false)
  const [showRefundModal, setShowRefundModal] = useState(false)

  // Calcula dias restantes na janela de reembolso (7 dias a partir do current_period_start)
  const refundDaysRemaining = (() => {
    if (!subscription?.current_period_start) return 0
    const periodStart = new Date(subscription.current_period_start)
    const now = new Date()
    const diffDays = (now.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)
    return Math.max(0, Math.ceil(7 - diffDays))
  })()

  // Detecta se já existe uma solicitação de reembolso pendente
  const hasRefundRequested = subscription?.payments?.some(p => p.status === 'refund_requested') ?? false

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
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
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
                      ? (() => {
                          const date = new Date(subscription.current_period_start);
                          return date.toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            timeZone: 'UTC'
                          });
                        })()
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Próxima Renovação</p>
                  <p className="text-base font-semibold text-gray-900">
                    {subscription.current_period_end
                      ? (() => {
                          const date = new Date(subscription.current_period_end);
                          return date.toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            timeZone: 'UTC'
                          });
                        })()
                      : 'N/A'}
                  </p>
                </div>
                {subscription.canceled_at && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Cancelado em</p>
                    <p className="text-base font-semibold text-gray-900">
                      {(() => {
                        const date = new Date(subscription.canceled_at);
                        return date.toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          timeZone: 'UTC'
                        });
                      })()}
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
                  {/* Banner de reembolso em análise */}
                  {hasRefundRequested && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-yellow-600 shrink-0" />
                        <p className="text-sm font-semibold text-yellow-900">
                          Reembolso em análise
                        </p>
                      </div>
                      <p className="text-xs text-yellow-700">
                        Sua solicitação de reembolso está sendo analisada. Você será notificado em breve.
                      </p>
                    </div>
                  )}

                  {/* Banner de reembolso disponível */}
                  {!hasRefundRequested && refundDaysRemaining > 0 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                        <p className="text-sm font-semibold text-blue-900">
                          Reembolso disponível
                        </p>
                      </div>
                      <p className="text-xs text-blue-700 mb-3">
                        Você ainda tem{' '}
                        <strong>{refundDaysRemaining} dia{refundDaysRemaining !== 1 ? 's' : ''}</strong>{' '}
                        para solicitar reembolso integral.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                        onClick={() => setShowRefundModal(true)}
                      >
                        <RotateCcw className="w-3.5 h-3.5 mr-2" />
                        Solicitar Reembolso
                      </Button>
                    </div>
                  )}

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

              {(subscription.status === 'canceled' || subscription.status === 'expired') && (
                <>
                  <div className={`p-4 border rounded-lg ${
                    subscription.status === 'canceled' 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <p className={`text-sm font-semibold mb-2 ${
                      subscription.status === 'canceled' ? 'text-yellow-900' : 'text-red-900'
                    }`}>
                      {subscription.status === 'canceled' 
                        ? 'Assinatura Cancelada' 
                        : 'Assinatura Expirada'}
                    </p>
                    <p className={`text-sm ${
                      subscription.status === 'canceled' ? 'text-yellow-800' : 'text-red-800'
                    }`}>
                      {subscription.status === 'canceled'
                        ? 'Sua assinatura foi cancelada. Renove para continuar usando o serviço.'
                        : 'Sua assinatura expirou. Renove para continuar usando o serviço.'}
                    </p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => setShowRenewModal(true)}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Renovar Assinatura
                  </Button>
                </>
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
                  • Você pode reativar sua assinatura a qualquer momento.
                </p>
                <p>
                  • Reembolso integral disponível nos primeiros 7 dias após assinar ou renovar.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Renovação */}
      {plan && (
        <RenewSubscriptionModal
          open={showRenewModal}
          onOpenChange={setShowRenewModal}
          planPrice={typeof plan.price === 'string' ? parseFloat(plan.price) : (plan.price || 0)}
        />
      )}

      {/* Modal de Reembolso */}
      {plan && (
        <RefundModal
          open={showRefundModal}
          onOpenChange={setShowRefundModal}
          planPrice={typeof plan.price === 'string' ? parseFloat(plan.price) : (plan.price || 0)}
          daysRemaining={refundDaysRemaining}
        />
      )}
    </div>
  )
}

