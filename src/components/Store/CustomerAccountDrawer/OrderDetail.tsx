'use client'

import { useState } from 'react'
import { ChevronLeft, RotateCcw, XCircle, Mail, MapPin, Instagram, Facebook } from 'lucide-react'
import { useCustomerOrder } from '@/hooks/useCustomerOrder'
import { useStoreInfoById } from '@/hooks/useStoreInfoById'
import { useCancelOrder } from '@/hooks/useCancelOrder'
import { useRepeatOrder } from '@/hooks/useRepeatOrder'
import { cn, formatPrice, formatDateShort } from '@/lib/utils'
import { IconWhatsApp } from '@/assets/icons/IconWhatsApp'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Thumb,
  StatusBadge,
  SectionSpinner,
  getFirstOrderItemImage,
  formatWhatsAppNumber,
} from './shared'
import { DrawerOrderTimeline } from './DrawerOrderTimeline'

/* ─── Props ─────────────────────────────────────────────────────────────── */

interface OrderDetailProps {
  orderId: number
  onBack: () => void
  onOpenCart?: () => void
}

/* ─── Componente ─────────────────────────────────────────────────────────── */

export function OrderDetail({ orderId, onBack, onOpenCart }: OrderDetailProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const { data: selectedOrder, isLoading } = useCustomerOrder(orderId)
  const { data: storeInfo, isLoading: isLoadingStoreInfo } = useStoreInfoById(
    selectedOrder?.store?.id,
  )
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder()
  const { mutate: repeatOrder, isPending: isRepeating } = useRepeatOrder()

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="ac-slide scrollbar-thin flex-1 overflow-y-auto">
        <SectionSpinner />
      </div>
    )
  }

  /* ── Not found ── */
  if (!selectedOrder) {
    return (
      <div className="ac-slide scrollbar-thin flex-1 overflow-y-auto">
        <p className="p-8 text-center text-[13px] text-nxi3">Pedido não encontrado.</p>
      </div>
    )
  }

  const store = selectedOrder.store

  return (
    <div className="ac-slide scrollbar-thin flex-1 overflow-y-auto">
      {/* ── Nav ── */}
      <div className="flex items-center gap-2 border-b border-nxborder px-5 py-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[12.5px] font-semibold text-nxi2 transition-colors hover:text-store"
        >
          <ChevronLeft size={16} />
          Pedidos
        </button>
        <span className="ml-auto font-mono text-[12px] font-bold text-nxi1">
          #{selectedOrder.order_code}
        </span>
      </div>

      {/* ── Corpo ── */}
      <div className="px-5 py-5">
        {/* Header: data + total + status */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.08em] text-nxi3">
              Pedido em {formatDateShort(selectedOrder.created_at)}
            </p>
            <p className="mt-0.5 text-[20px] font-extrabold tracking-tight text-nxi1">
              {formatPrice(parseFloat(selectedOrder.total))}
            </p>
          </div>
          <StatusBadge status={selectedOrder.status} />
        </div>

        {/* Timeline */}
        <div className="mt-5 rounded-2xl border border-nxborder bg-white p-4">
          <DrawerOrderTimeline
            status={selectedOrder.status}
            orderId={selectedOrder.id}
            updatedAt={selectedOrder.updated_at}
          />
        </div>

        {/* Itens */}
        <div className="mt-5">
          <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-nxi3">
            Itens
          </p>
          <div className="space-y-3">
            {selectedOrder.items.map((item) => {
              const imgSrc = getFirstOrderItemImage(item)
              const meta = [
                item.color || null,
                item.size ? `Tam ${item.size}` : null,
                `Qtd ${item.quantity}`,
              ]
                .filter(Boolean)
                .join(' · ')
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="h-14 w-12 shrink-0 overflow-hidden rounded-lg border border-nxborder">
                    <Thumb src={imgSrc} alt={item.product.name} sizes="48px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-[12.5px] font-bold text-nxi1">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-nxi3">{meta}</p>
                  </div>
                  <span className="shrink-0 text-[12.5px] font-bold text-nxi1">
                    {formatPrice(parseFloat(item.price) * item.quantity)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Ações */}
        <div className="mt-5 flex flex-col gap-2">
          {/* Repetir pedido — só quando Entregue (status 4) */}
          {selectedOrder.status === 4 && (
            <button
              disabled={isRepeating}
              onClick={() =>
                repeatOrder(selectedOrder.id, {
                  onSuccess: () => {
                    onOpenCart?.()
                  },
                })
              }
              className={cn(
                'flex h-11 items-center justify-center gap-2 rounded-full bg-store text-[13px] font-bold text-white transition-transform active:scale-[0.99]',
                isRepeating && 'opacity-50',
              )}
            >
              <RotateCcw size={16} className={cn(isRepeating && 'animate-spin')} />
              {isRepeating ? 'Adicionando...' : 'Repetir pedido'}
            </button>
          )}

          {/* Cancelamento — status 1 ou 2 */}
          {(selectedOrder.status === 1 || selectedOrder.status === 2) &&
            (selectedOrder.cancellation_requested === 1 ? (
              <p className="text-center text-[11px] leading-relaxed text-nxi3">
                Cancelamento solicitado — aguardando aprovação da loja.
              </p>
            ) : (
              <button
                onClick={() => {
                  setCancelReason('')
                  setShowCancelDialog(true)
                }}
                className="flex h-11 items-center justify-center gap-2 rounded-full border border-nxd/30 text-[13px] font-semibold text-nxd transition-colors hover:bg-nxd/[0.06]"
              >
                <XCircle size={16} />
                Solicitar cancelamento
              </button>
            ))}
        </div>

        {/* Card da loja */}
        {store && (
          <div className="mt-6 rounded-2xl border border-nxborder bg-nxbg/50 p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-nxi3">Vendido por</p>

            {isLoadingStoreInfo ? (
              <div className="mt-2 flex justify-center py-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-nxborder border-t-store" />
              </div>
            ) : storeInfo?.data ? (
              <>
                <p className="mt-2 text-[14px] font-extrabold text-nxi1">{storeInfo.data.name}</p>
                {storeInfo.data.description && (
                  <p className="mt-0.5 break-words text-[11.5px] leading-relaxed text-nxi3">
                    {storeInfo.data.description}
                  </p>
                )}
                <div className="mt-3 space-y-2">
                  {storeInfo.data.whatsapp && (
                    <a
                      href={`https://wa.me/${formatWhatsAppNumber(storeInfo.data.whatsapp)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-[12.5px] font-semibold text-wa transition-opacity hover:opacity-80"
                    >
                      <IconWhatsApp size={15} />
                      {storeInfo.data.whatsapp}
                    </a>
                  )}
                  {storeInfo.data.email && (
                    <a
                      href={`mailto:${storeInfo.data.email}`}
                      className="flex items-center gap-2.5 text-[12.5px] text-nxi2 transition-colors hover:text-nxi1"
                    >
                      <Mail size={14} />
                      {storeInfo.data.email}
                    </a>
                  )}
                  {storeInfo.data.instagram && (
                    <a
                      href={storeInfo.data.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-[12.5px] text-nxi2 transition-colors hover:text-nxi1"
                    >
                      <Instagram size={14} />
                      {storeInfo.data.instagram}
                    </a>
                  )}
                  {storeInfo.data.facebook && (
                    <a
                      href={storeInfo.data.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-[12.5px] text-nxi2 transition-colors hover:text-nxi1"
                    >
                      <Facebook size={14} />
                      {storeInfo.data.facebook}
                    </a>
                  )}
                  {(storeInfo.data.address || storeInfo.data.city) && (
                    <div className="flex items-start gap-2.5 text-[12px] leading-relaxed text-nxi3">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <span>
                        {[
                          storeInfo.data.address &&
                            `${storeInfo.data.address}${storeInfo.data.number ? `, ${storeInfo.data.number}` : ''}`,
                          storeInfo.data.city &&
                            `${storeInfo.data.city}${storeInfo.data.state ? `/${storeInfo.data.state}` : ''}`,
                        ]
                          .filter(Boolean)
                          .join(' — ')}
                      </span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Fallback sem storeInfo completo */
              <>
                <p className="mt-2 text-[14px] font-extrabold text-nxi1">{store.name}</p>
                {store.whatsapp && (
                  <a
                    href={`https://wa.me/${formatWhatsAppNumber(store.whatsapp)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center gap-2.5 text-[12.5px] font-semibold text-wa transition-opacity hover:opacity-80"
                  >
                    <IconWhatsApp size={15} />
                    {store.whatsapp}
                  </a>
                )}
              </>
            )}
          </div>
        )}

        <div className="h-4" />
      </div>

      {/* ── Dialog de cancelamento (mantido integralmente) ── */}
      <Dialog
        open={showCancelDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowCancelDialog(false)
            setCancelReason('')
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedOrder.status === 1 ? 'Cancelar pedido' : 'Solicitar cancelamento'}
            </DialogTitle>
            <DialogDescription>
              {selectedOrder.status === 1
                ? 'O pedido ainda não foi confirmado. Ao cancelar, a ação é imediata.'
                : 'O pagamento já foi confirmado. Sua solicitação será enviada para a loja aprovar.'}
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
            <p className="mt-1.5 text-right text-xs text-nxi3">{cancelReason.length}/500</p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => {
                setShowCancelDialog(false)
                setCancelReason('')
              }}
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              disabled={!cancelReason.trim() || isCancelling}
              onClick={() => {
                if (!orderId || !cancelReason.trim()) return
                cancelOrder(
                  { orderId, data: { reason: cancelReason.trim() } },
                  {
                    onSuccess: () => {
                      setShowCancelDialog(false)
                      setCancelReason('')
                    },
                  },
                )
              }}
            >
              {isCancelling ? 'Cancelando...' : 'Confirmar cancelamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
