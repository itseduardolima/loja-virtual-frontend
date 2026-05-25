'use client'

import { usePlanoPage } from './usePlanoPage'
import { Card, CardContent, CardHeader, CardTitle, Button, LoadingSpinner } from '@/components'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { RenewSubscriptionModal } from '@/components/Subscription/RenewSubscriptionModal'
import { RefundModal } from '@/components/Subscription/RefundModal'
import { ChangePlanModal } from '@/components/Subscription/ChangePlanModal'
import { useGetPaymentLink } from '@/hooks/useGetPaymentLink'
import { formatPrice, formatBillingCycle } from '@/lib/utils'
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Package,
  X,
  RefreshCw,
  RotateCcw,
  ArrowLeftRight,
  Clock,
  Receipt,
  ChevronLeft,
  ChevronRight,
  Ticket,
} from 'lucide-react'
import { Payment } from '@/types/subscription'

const PAYMENT_STATUS_MAP: Record<string, { label: string; className: string }> = {
  paid: { label: 'Pago', className: 'bg-green-100 text-green-800' },
  pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
  failed: { label: 'Falhou', className: 'bg-red-100 text-red-800' },
  refunded: { label: 'Reembolsado', className: 'bg-purple-100 text-purple-800' },
  refund_requested: { label: 'Reembolso em análise', className: 'bg-orange-100 text-orange-800' },
}

const PAYMENT_METHOD_MAP: Record<string, string> = {
  credit_card: 'Cartão de crédito',
  pix: 'PIX',
  boleto: 'Boleto',
}

function PayProrationButton({ paymentId }: { paymentId: string }) {
  const { mutate: getLink, isPending } = useGetPaymentLink()
  return (
    <Button
      size="sm"
      onClick={() => getLink(paymentId)}
      disabled={isPending}
      className="bg-orange-600 hover:bg-orange-700 text-white"
    >
      {isPending ? 'Carregando...' : 'Pagar agora'}
    </Button>
  )
}

function PaymentRow({ payment }: { payment: Payment }) {
  const statusInfo = PAYMENT_STATUS_MAP[payment.status] ?? { label: payment.status, className: 'bg-gray-100 text-gray-800' }
  const methodLabel = PAYMENT_METHOD_MAP[payment.payment_method ?? ''] ?? (payment.payment_method ?? 'N/A')
  const date = payment.paid_at ?? payment.created_at
  const { mutate: getLink, isPending: isFetchingLink } = useGetPaymentLink()
  const isPayable = payment.status === 'pending' && !!payment.payment_id

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-gray-900">{methodLabel}</span>
        <span className="text-xs text-gray-500">
          {new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC',
          })}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-900">
          {Number(payment.amount).toLocaleString('pt-BR', { style: 'currency', currency: payment.currency || 'BRL' })}
        </span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
        {isPayable && (
          <Button
            size="sm"
            variant="outline"
            disabled={isFetchingLink}
            onClick={() => getLink(payment.payment_id!)}
            className="h-7 text-xs"
          >
            {isFetchingLink ? '...' : 'Pagar agora'}
          </Button>
        )}
      </div>
    </div>
  )
}

export default function PlanoPage() {
  const {
    subscription,
    plan,
    billingCycle,
    features,
    planPrice,
    planFullPrice,
    isFreeAccess,
    paymentsData,
    isLoading,
    error,
    isCanceling,
    isLoadingPayments,
    isCancelScheduled,
    refundDaysRemaining,
    hasRefundRequested,
    showCancelConfirm,
    setShowCancelConfirm,
    showRenewModal,
    setShowRenewModal,
    showRefundModal,
    setShowRefundModal,
    showChangePlanModal,
    setShowChangePlanModal,
    showRenewWithPlanModal,
    setShowRenewWithPlanModal,
    showPaymentsModal,
    setShowPaymentsModal,
    paymentsPage,
    setPaymentsPage,
    handleCancel,
    handleCancelScheduledChange,
    isCancelingScheduled,
    openPaymentsModal,
  } = usePlanoPage()

  const getStatusBadge = (status: string) => {
    if (isCancelScheduled) {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-orange-100 text-orange-800 border-orange-200">
          <Clock className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-semibold">Cancelamento Agendado</span>
        </div>
      )
    }

    const statusConfig = {
      active: { label: 'Ativa', icon: CheckCircle2, className: 'bg-green-100 text-green-800 border-green-200', iconClassName: 'text-green-600' },
      canceled: { label: 'Cancelada', icon: XCircle, className: 'bg-red-100 text-red-800 border-red-200', iconClassName: 'text-red-600' },
      expired: { label: 'Expirada', icon: AlertCircle, className: 'bg-yellow-100 text-yellow-800 border-yellow-200', iconClassName: 'text-yellow-600' },
      pending: { label: 'Pendente', icon: AlertCircle, className: 'bg-blue-100 text-blue-800 border-blue-200', iconClassName: 'text-blue-600' },
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma assinatura encontrada</h2>
            <p className="text-gray-600 mb-6">Você ainda não possui uma assinatura ativa.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gerenciar Plano</h1>
        <p className="text-gray-600">Visualize e gerencie sua assinatura</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plano Atual */}
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
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan?.name || 'Plano Vendedor'}</h3>
                {(subscription.applied_coupon_code || isFreeAccess) && planFullPrice > planPrice && (
                  <div className="text-sm text-gray-400 line-through mb-1">
                    De {formatPrice(planFullPrice)}
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">{formatPrice(planPrice)}</span>
                  <span className="text-gray-600">/ {formatBillingCycle(billingCycle)}</span>
                </div>
                {subscription.applied_coupon_code && (
                  <div className="mt-3 inline-flex items-center gap-2 bg-green-50 text-green-800 text-xs font-medium px-2.5 py-1.5 rounded-full border border-green-200">
                    <Ticket className="h-3 w-3" />
                    Cupom <span className="font-mono font-bold">{subscription.applied_coupon_code}</span> ativo
                    {subscription.discount_remaining_periods != null && subscription.discount_remaining_periods > 0
                      ? ` por mais ${subscription.discount_remaining_periods} ${subscription.discount_remaining_periods === 1 ? 'ciclo' : 'ciclos'}`
                      : subscription.discount_remaining_periods == null
                        ? ' (vitalício)'
                        : ''}
                  </div>
                )}
                {subscription.free_access_until && subscription.free_access_reason === 'trial' && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-blue-600 shrink-0" />
                      <p className="text-sm font-semibold text-blue-900">Trial gratuito ativo</p>
                    </div>
                    <p className="text-xs text-blue-800">
                      Termina em{' '}
                      <strong>
                        {new Date(subscription.free_access_until).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          timeZone: 'UTC',
                        })}
                      </strong>
                      . Adicione um método de pagamento para continuar usando após esse período.
                    </p>
                  </div>
                )}
                {plan?.description && <p className="text-gray-600 mt-2">{plan.description}</p>}
              </div>

              {features.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">Recursos Incluídos</h4>
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

              <div className="pt-4 border-t">
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
              </div>
            </CardContent>
          </Card>

          {/* Detalhes da Assinatura */}
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
                      ? new Date(subscription.current_period_start).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' })
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Próxima Renovação</p>
                  <p className="text-base font-semibold text-gray-900">
                    {subscription.current_period_end
                      ? new Date(subscription.current_period_end).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' })
                      : 'N/A'}
                  </p>
                </div>
                {subscription.canceled_at && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Cancelado em</p>
                    <p className="text-base font-semibold text-gray-900">
                      {new Date(subscription.canceled_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' })}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Método de Pagamento</p>
                  <p className="text-base font-semibold text-gray-900 capitalize">
                    {subscription.payment_provider === 'free'
                      ? 'Sem cobrança'
                      : subscription.payment_provider || 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna lateral */}
        <div className="space-y-6">
          {/* Ações */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription.pending_upgrade_payment_id && subscription.scheduled_plan && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowLeftRight className="w-4 h-4 text-orange-600 shrink-0" />
                    <p className="text-sm font-semibold text-orange-900">Upgrade pendente de pagamento</p>
                  </div>
                  <p className="text-sm text-orange-800 mb-3">
                    Você iniciou um upgrade para <strong>{subscription.scheduled_plan.name}</strong>.
                    Os recursos do novo plano só serão liberados após a confirmação do pagamento da
                    proração.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <PayProrationButton paymentId={subscription.pending_upgrade_payment_id} />
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-orange-300 text-orange-700 hover:bg-orange-100"
                      onClick={handleCancelScheduledChange}
                      disabled={isCancelingScheduled}
                    >
                      {isCancelingScheduled ? 'Cancelando...' : 'Cancelar upgrade'}
                    </Button>
                  </div>
                </div>
              )}

              {subscription.scheduled_plan && subscription.scheduled_change_at && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowLeftRight className="w-4 h-4 text-blue-600 shrink-0" />
                    <p className="text-sm font-semibold text-blue-900">Troca de plano agendada</p>
                  </div>
                  <p className="text-sm text-blue-800">
                    Sua assinatura mudará para <strong>{subscription.scheduled_plan.name}</strong>
                    {subscription.scheduled_billing_cycle && (
                      <> ({subscription.scheduled_billing_cycle === 'yearly' ? 'Anual' : 'Mensal'})</>
                    )}{' '}em{' '}
                    <strong>
                      {new Date(subscription.scheduled_change_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        timeZone: 'UTC',
                      })}
                    </strong>
                    .
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 border-blue-300 text-blue-700 hover:bg-blue-100"
                    onClick={handleCancelScheduledChange}
                    disabled={isCancelingScheduled}
                  >
                    {isCancelingScheduled ? 'Cancelando...' : 'Cancelar agendamento'}
                  </Button>
                </div>
              )}

              {subscription.status === 'active' && isCancelScheduled && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-orange-600 shrink-0" />
                    <p className="text-sm font-semibold text-orange-900">Cancelamento agendado</p>
                  </div>
                  <p className="text-sm text-orange-800">
                    Sua assinatura será encerrada em{' '}
                    <strong>
                      {new Date(subscription.current_period_end).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' })}
                    </strong>
                    . Você mantém acesso completo até lá.
                  </p>
                </div>
              )}

              {subscription.status === 'active' && !isCancelScheduled && (
                <>
                  {hasRefundRequested && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-yellow-600 shrink-0" />
                        <p className="text-sm font-semibold text-yellow-900">Reembolso em análise</p>
                      </div>
                      <p className="text-xs text-yellow-700">
                        Sua solicitação de reembolso está sendo analisada. Você será notificado em breve.
                      </p>
                    </div>
                  )}

                  {!hasRefundRequested && refundDaysRemaining > 0 && !isFreeAccess && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                        <p className="text-sm font-semibold text-blue-900">Reembolso disponível</p>
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

                  {!isFreeAccess &&
                    !subscription.pending_upgrade_payment_id &&
                    !subscription.scheduled_plan_id && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setShowChangePlanModal(true)}
                      >
                        <ArrowLeftRight className="w-4 h-4 mr-2" />
                        Trocar de Plano
                      </Button>
                    )}

                  {!showCancelConfirm ? (
                    <Button variant="destructive" className="w-full" onClick={() => setShowCancelConfirm(true)}>
                      <X className="w-4 h-4 mr-2" />
                      Cancelar Assinatura
                    </Button>
                  ) : (
                    <div className="space-y-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-semibold text-red-900">Confirmar Cancelamento</p>
                      <p className="text-sm text-red-700">
                        Tem certeza que deseja cancelar sua assinatura? Você perderá o acesso ao painel de vendedor após o período atual.
                      </p>
                      <div className="flex gap-2">
                        <Button variant="destructive" size="sm" onClick={handleCancel} disabled={isCanceling} className="flex-1">
                          {isCanceling ? 'Cancelando...' : 'Confirmar'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowCancelConfirm(false)} disabled={isCanceling} className="flex-1">
                          Voltar
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {(subscription.status === 'canceled' || subscription.status === 'expired') && (
                <>
                  <div className={`p-4 border rounded-lg ${subscription.status === 'canceled' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                    <p className={`text-sm font-semibold mb-2 ${subscription.status === 'canceled' ? 'text-yellow-900' : 'text-red-900'}`}>
                      {subscription.status === 'canceled' ? 'Assinatura Cancelada' : 'Assinatura Expirada'}
                    </p>
                    <p className={`text-sm ${subscription.status === 'canceled' ? 'text-yellow-800' : 'text-red-800'}`}>
                      {subscription.status === 'canceled'
                        ? 'Sua assinatura foi cancelada. Renove para continuar usando o serviço.'
                        : 'Sua assinatura expirou. Renove para continuar usando o serviço.'}
                    </p>
                  </div>
                  <Button className="w-full" onClick={() => setShowRenewModal(true)}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Renovar Assinatura
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowRenewWithPlanModal(true)}
                  >
                    <ArrowLeftRight className="w-4 h-4 mr-2" />
                    Escolher Outro Plano
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

          {/* Informações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• O cancelamento é imediato, mas você mantém acesso até o final do período pago.</p>
                <p>• Você pode reativar sua assinatura a qualquer momento.</p>
                <p>• Reembolso integral disponível nos primeiros 7 dias após assinar ou renovar.</p>
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Pagamentos */}
          {subscription.payments && subscription.payments.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    
                    Histórico de Pagamentos
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm text-primary hover:text-primary"
                    onClick={openPaymentsModal}
                  >
                    Ver todos
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {subscription.payments.slice(0, 3).map((payment) => (
                    <PaymentRow key={payment.id} payment={payment} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de Renovação */}
      {plan && (
        <RenewSubscriptionModal
          open={showRenewModal}
          onOpenChange={setShowRenewModal}
          planPrice={planPrice}
        />
      )}

      {/* Modal de Reembolso */}
      {plan && (
        <RefundModal
          open={showRefundModal}
          onOpenChange={setShowRefundModal}
          planPrice={planPrice}
          daysRemaining={refundDaysRemaining}
        />
      )}

      {/* Modal de Troca de Plano */}
      {plan && (
        <ChangePlanModal
          open={showChangePlanModal}
          onOpenChange={setShowChangePlanModal}
          currentPlanId={plan.id}
          currentBillingCycle={billingCycle}
          hasActiveCoupon={!!subscription.applied_coupon_code}
          currentPrice={planPrice}
          currentPeriodEnd={subscription.current_period_end}
        />
      )}

      {/* Modal de Renovação com escolha de outro plano */}
      {plan && (
        <ChangePlanModal
          mode="renew"
          open={showRenewWithPlanModal}
          onOpenChange={setShowRenewWithPlanModal}
          currentPlanId={plan.id}
          currentBillingCycle={billingCycle}
          hasActiveCoupon={false}
        />
      )}

      {/* Modal — Todos os Pagamentos */}
      <Dialog open={showPaymentsModal} onOpenChange={setShowPaymentsModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Histórico de Pagamentos
            </DialogTitle>
          </DialogHeader>

          {isLoadingPayments ? (
            <div className="flex justify-center py-10">
              <LoadingSpinner size="lg" />
            </div>
          ) : paymentsData && paymentsData.data.length > 0 ? (
            <>
              <div className="divide-y">
                {paymentsData.data.map((payment) => (
                  <PaymentRow key={payment.id} payment={payment} />
                ))}
              </div>

              {paymentsData.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-gray-500">
                    Página {paymentsData.pagination.page} de {paymentsData.pagination.totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={paymentsPage === 1}
                      onClick={() => setPaymentsPage((p) => p - 1)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={paymentsPage === paymentsData.pagination.totalPages}
                      onClick={() => setPaymentsPage((p) => p + 1)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-gray-500 py-8 text-sm">Nenhum pagamento encontrado.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
