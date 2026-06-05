'use client'

import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Search,
  Package,
  XCircle,
  Store,
  AlertTriangle,
} from 'lucide-react'
import { buildImageUrl, formatDate, formatPrice } from '@/lib/utils'
import { useRastrearPage } from './useRastrearPage'
import { OrderSkeleton } from './_components/OrderSkeleton'
import { STATUS_CONFIG } from './_components/statusConfig'

function RastrearPedidoContent() {
  const {
    inputCode,
    setInputCode,
    handleSearch,
    order,
    isLoading,
    error,
    showCancelDialog,
    cancelReason,
    setCancelReason,
    isCancelling,
    cancelResult,
    canCancel,
    handleOpenCancelDialog,
    handleCloseCancelDialog,
    handleConfirmCancel,
  } = useRastrearPage()

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-4">
            <Package className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Rastrear Pedido</h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Digite o código do pedido para acompanhar o status da sua entrega
          </p>
        </div>

        {/* Formulário de busca */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Ex: PED-20240001"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="flex-1 h-12 rounded-xl border-gray-200"
          />
          <Button
            type="submit"
            disabled={!inputCode.trim() || isLoading}
            className="h-12 px-5 rounded-xl gap-2"
          >
            <Search className="h-4 w-4" />
            Buscar
          </Button>
        </form>

        {/* Loading skeleton */}
        {isLoading && <OrderSkeleton />}

        {/* Erro */}
        {error && !isLoading && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <XCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
            <h2 className="font-semibold text-red-800 text-lg mb-1">Pedido não encontrado</h2>
            <p className="text-red-600 text-sm">
              Verifique o código informado e tente novamente.
            </p>
          </div>
        )}

        {/* Resultado */}
        {order && !isLoading && (
          <div className="mt-6 space-y-4">
            {/* Card do pedido */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {/* Info da loja */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                {order.store.logo ? (
                  <img
                    src={buildImageUrl(order.store.logo)}
                    alt={order.store.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Store className="h-5 w-5 text-gray-400" />
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500">Loja</p>
                  <p className="font-semibold text-gray-900">{order.store.name}</p>
                </div>
              </div>

              {/* Número e código */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Código do pedido</p>
                  <p className="font-bold text-gray-900 text-lg">{order.order_code}</p>
                </div>

                {/* Badge de status */}
                {STATUS_CONFIG[order.status] && (
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${STATUS_CONFIG[order.status].color}`}
                  >
                    {STATUS_CONFIG[order.status].icon}
                    {STATUS_CONFIG[order.status].label}
                  </span>
                )}
              </div>

              {/* Descrição do status */}
              {order.status_description && (
                <p className="text-sm text-gray-500 mt-3">{order.status_description}</p>
              )}

              {/* Total e data */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="font-bold text-primary text-lg">{formatPrice(order.total)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Data do pedido</p>
                  <p className="text-sm font-medium text-gray-700">{formatDate(order.created_at)}</p>
                </div>
              </div>

              {/* Solicitar cancelamento — apenas logado e status cancelável */}
              {canCancel && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {cancelResult === 'cancelled' ? (
                    <div className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-xl">
                      <XCircle className="h-4 w-4" />
                      Pedido cancelado
                    </div>
                  ) : cancelResult === 'requested' ? (
                    <div className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-xl">
                      <AlertTriangle className="h-4 w-4" />
                      Solicitação de cancelamento enviada
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 gap-2"
                      onClick={handleOpenCancelDialog}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Solicitar cancelamento
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Timeline de histórico */}
            {order.history && order.history.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-900 mb-5">Histórico do Pedido</h2>
                <div className="space-y-0">
                  {order.history.map((item, index) => {
                    const config = STATUS_CONFIG[item.status]
                    const isLast = index === order.history!.length - 1
                    return (
                      <div key={item.id} className="flex gap-3">
                        {/* Coluna da linha e ícone */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${config?.color ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}
                          >
                            {config?.icon ?? <Package className="h-4 w-4" />}
                          </div>
                          {!isLast && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
                        </div>
                        {/* Conteúdo */}
                        <div className="pb-5">
                          <p className="font-semibold text-gray-900 text-sm">
                            {item.status_text ?? config?.label ?? `Status ${item.status}`}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{formatDate(item.created_at)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Sem histórico: mostrar apenas status atual */}
            {(!order.history || order.history.length === 0) && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-bold text-gray-900 mb-4">Status Atual</h2>
                <div className="flex gap-3 items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${STATUS_CONFIG[order.status]?.color ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}
                  >
                    {STATUS_CONFIG[order.status]?.icon ?? <Package className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {STATUS_CONFIG[order.status]?.label ?? order.status_text}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.updated_at)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dialog de cancelamento */}
      <Dialog open={showCancelDialog} onOpenChange={(open) => { if (!open) handleCloseCancelDialog() }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Solicitar cancelamento</DialogTitle>
            <DialogDescription>
              Informe o motivo para cancelar este pedido. A loja analisará sua solicitação.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-1">
            <Textarea
              placeholder="Descreva o motivo do cancelamento..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              maxLength={500}
              rows={4}
              className="resize-none"
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-1.5 text-right">
              {cancelReason.length}/500
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={handleCloseCancelDialog}>
              Voltar
            </Button>
            <Button
              variant="destructive"
              disabled={!cancelReason.trim() || isCancelling || !order?.id}
              onClick={handleConfirmCancel}
            >
              {isCancelling ? 'Cancelando...' : 'Confirmar cancelamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function RastrearPedidoPage() {
  return (
    <Suspense fallback={<OrderSkeleton />}>
      <RastrearPedidoContent />
    </Suspense>
  )
}
