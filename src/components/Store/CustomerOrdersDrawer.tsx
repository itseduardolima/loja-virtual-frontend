'use client'

import { useState } from 'react'
import { X, Package, Truck, Clock, CheckCircle, XCircle, Search, ChevronRight, MapPin, Phone, Mail, Instagram, Facebook, Store, ExternalLink, AlertTriangle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCustomerOrders } from '@/hooks/useCustomerOrders'
import { useCustomerOrder } from '@/hooks/useCustomerOrder'
import { useStoreInfoById } from '@/hooks/useStoreInfoById'
import { useCancelOrder } from '@/hooks/useCancelOrder'
import { useRepeatOrder } from '@/hooks/useRepeatOrder'
import { CUSTOMER_ORDER_STATUS } from '@/types/customer'
import { cn, formatDate, formatPrice, buildImageUrl } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import Image from 'next/image'

import { ErrorState, LoadingSpinner } from '@/components/Layout'
import { WhatsappIcon } from '@/assets/icons/WhatsappIcon'
import { OrderTrackingTimeline } from '@/components/Order'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

interface CustomerOrdersDrawerProps {
  isOpen: boolean
  onClose: () => void
  onOpenCart?: () => void
}

export function CustomerOrdersDrawer({ isOpen, onClose, onOpenCart }: CustomerOrdersDrawerProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<number | 'all'>('all')
  const debouncedSearch = useDebounce(searchTerm, 500)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder()
  const { mutate: repeatOrder, isPending: isRepeating } = useRepeatOrder()

  const { data: ordersData, isLoading, error } = useCustomerOrders({
    page: 1,
    limit: 20,
    search: debouncedSearch || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    sort: 'DATE_DESC'
  })

  const { data: selectedOrder, isLoading: isLoadingOrder } = useCustomerOrder(selectedOrderId || 0)
  const { data: storeInfo, isLoading: isLoadingStoreInfo } = useStoreInfoById(selectedOrder?.store?.id)

  const orders = ordersData?.data || []
  const meta = ordersData?.meta

  const getStatusInfo = (status: number) => {
    return CUSTOMER_ORDER_STATUS[status as keyof typeof CUSTOMER_ORDER_STATUS] || CUSTOMER_ORDER_STATUS[1]
  }

  const formatWhatsAppNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.startsWith('55') ? cleaned : `55${cleaned}`
  }

  const handleOrderClick = (orderId: number) => {
    setSelectedOrderId(orderId)
  }

  const handleBackToList = () => {
    setSelectedOrderId(null)
  }

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1:
        return <Clock className="w-4 h-4" />
      case 2:
        return <Package className="w-4 h-4" />
      case 3:
        return <Truck className="w-4 h-4" />
      case 4:
        return <CheckCircle className="w-4 h-4" />
      case 5:
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }


  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-[#F0EBE3]">
            <div className="flex items-center">
              {selectedOrderId && (
                <button
                  onClick={handleBackToList}
                  className="w-8 h-8 rounded-full bg-[#F7F3EF] flex items-center justify-center text-[#7C6B5C] hover:text-[#1C1008] cursor-pointer border-none mr-2"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </button>
              )}
              <div>
                <h2 className="text-[15px] font-semibold text-[#1C1008]">
                  {selectedOrderId ? 'Detalhes do Pedido' : 'Meus Pedidos'}
                </h2>
                {!selectedOrderId && meta?.total !== undefined && (
                  <p className="text-[11px] text-[#A8998A] mt-0.5">
                    {meta.total} {meta.total === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F7F3EF] flex items-center justify-center text-[#7C6B5C] hover:text-[#1C1008] cursor-pointer border-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {selectedOrderId ? (
              // Detalhes do pedido
              isLoadingOrder ? (
                <div className="flex items-center justify-center h-full">
                  <LoadingSpinner />
                </div>
              ) : selectedOrder ? (
                <div className="p-6 space-y-6">

                  {/* Informações do Pedido */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#A8998A]">Código do Pedido</p>
                        <p className="text-[18px] font-bold text-[#1C1008]">{selectedOrder.order_code}</p>
                      </div>
                      <Badge
                        className={cn(
                          'text-[10px] font-semibold tracking-[0.05em] uppercase px-2 py-0.5 rounded-full border',
                          getStatusInfo(selectedOrder.status).color === 'yellow' && 'bg-amber-50 text-amber-700 border-amber-200',
                          getStatusInfo(selectedOrder.status).color === 'blue' && 'bg-blue-50 text-blue-700 border-blue-200',
                          getStatusInfo(selectedOrder.status).color === 'purple' && 'bg-violet-50 text-violet-700 border-violet-200',
                          getStatusInfo(selectedOrder.status).color === 'green' && 'bg-green-50 text-green-700 border-green-200',
                          getStatusInfo(selectedOrder.status).color === 'red' && 'bg-red-50 text-red-700 border-red-200',
                        )}
                      >
                        {getStatusInfo(selectedOrder.status).label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[11px] text-[#A8998A]">Data do Pedido</p>
                        <p className="text-[13px] font-semibold text-[#1C1008]">{formatDate(selectedOrder.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-[#A8998A]">Valor Total</p>
                        <p className="text-[13px] font-semibold text-[#1C1008]">{formatPrice(parseFloat(selectedOrder.total))}</p>
                      </div>
                    </div>

                    <Button
                      className="bg-[#1C1008] hover:bg-[#5A3C1E] text-white w-full h-10 rounded-xl text-[13px] font-medium gap-2"
                      disabled={isRepeating}
                      onClick={() => repeatOrder(selectedOrder.id, { onSuccess: () => { onClose(); onOpenCart?.() } })}
                    >
                      <RotateCcw className={`h-4 w-4 ${isRepeating ? 'animate-spin' : ''}`} />
                      {isRepeating ? 'Adicionando ao carrinho...' : 'Repetir Pedido'}
                    </Button>
                  </div>

                  {/* Timeline de Rastreio */}
                  <div className="border-t border-[#F0EBE3] pt-6">
                    <OrderTrackingTimeline
                      currentStatus={selectedOrder.status}
                      orderId={selectedOrder.id}
                      showTitle={true}
                      isVendor={false}
                    />
                  </div>

                  {/* Itens do Pedido */}
                  <div className="border-t border-[#F0EBE3] pt-6">
                    <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#A8998A] mb-4">Itens do Pedido</h3>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item) => {
                        // Função helper para obter a primeira imagem disponível
                        const getProductImage = (): string | null => {
                          const images = item.product.images

                          // Se images é um objeto (formato novo com cores)
                          if (images && typeof images === 'object' && !Array.isArray(images)) {
                            const imagesObj = images as Record<string, string[]>

                            // Tentar pegar a imagem da cor selecionada
                            if (item.color && imagesObj[item.color] && Array.isArray(imagesObj[item.color]) && imagesObj[item.color].length > 0) {
                              return imagesObj[item.color][0]
                            }

                            // Se não encontrar, pegar a primeira cor disponível
                            const firstColor = Object.keys(imagesObj)[0]
                            if (firstColor && Array.isArray(imagesObj[firstColor]) && imagesObj[firstColor].length > 0) {
                              return imagesObj[firstColor][0]
                            }
                          }

                          // Se images é um array (formato antigo)
                          if (Array.isArray(images) && images.length > 0) {
                            return images[0]
                          }

                          return null
                        }

                        const imageUrl = getProductImage()

                        return (
                          <div key={item.id} className="flex gap-4">
                            <div className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-[#F7F3EF] flex-shrink-0">
                              {imageUrl ? (
                                <div className="relative w-full h-full">
                                  <Image
                                    src={buildImageUrl(imageUrl)}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-5 h-5 text-[#C4B4A4]" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-[13px] font-semibold text-[#1C1008]">{item.product.name}</p>
                              <div className="flex gap-4 text-[11px] text-[#A8998A] mt-1">
                                <span>Qtd: {item.quantity}</span>
                                {item.color && <span>Cor: {item.color}</span>}
                                {item.size && <span>Tamanho: {item.size}</span>}
                              </div>
                              <p className="text-[13px] font-bold text-[#1C1008] mt-2">
                                {formatPrice(parseFloat(item.price))}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Solicitar cancelamento / solicitação pendente */}
                  {(selectedOrder.status === 1 || selectedOrder.status === 2) && (
                    <div className="border-t border-[#F0EBE3] pt-6">
                      {selectedOrder.cancellation_requested === 1 ? (
                        <div className="bg-[#F7F3EF] rounded-xl p-3 border border-[#F0EBE3] text-[12px] text-[#7C6B5C] flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                          <span>Solicitação de cancelamento enviada. Aguardando aprovação da loja.</span>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="w-full border border-red-200 text-red-500 hover:bg-red-50 rounded-xl gap-2"
                          onClick={() => {
                            setCancelReason('')
                            setShowCancelDialog(true)
                          }}
                        >
                          <AlertTriangle className="h-4 w-4" />
                          Solicitar cancelamento
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Informações da Loja */}
                  {selectedOrder.store && (
                    <div className="border-t border-[#F0EBE3] pt-6 mt-6">
                      <h3 className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#A8998A] mb-4">Informações da Loja</h3>

                      {isLoadingStoreInfo ? (
                        <div className="flex items-center justify-center py-8">
                          <LoadingSpinner />
                        </div>
                      ) : storeInfo?.data ? (
                        <div className="space-y-5">
                          {/* Header da Loja - Nome e Descrição */}
                          <div className="bg-[#F7F3EF] rounded-2xl p-4">
                            <h4 className="text-[14px] font-semibold text-[#1C1008] mb-1.5">
                              {storeInfo.data.name}
                            </h4>
                            {storeInfo.data.description && (
                              <p className="text-[12px] text-[#7C6B5C] leading-relaxed">
                                {storeInfo.data.description}
                              </p>
                            )}
                          </div>

                          {/* Botão Principal - WhatsApp */}
                          {storeInfo.data.whatsapp && (
                            <Button
                              asChild
                              className="w-full bg-green-500 hover:bg-green-600 text-white h-12 text-base font-medium"
                            >
                              <a
                                href={`https://wa.me/${formatWhatsAppNumber(storeInfo.data.whatsapp)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2"
                              >
                                <WhatsappIcon />
                                Falar no WhatsApp
                              </a>
                            </Button>
                          )}

                          {/* Contatos - Email */}
                          {storeInfo.data.email && (
                            <div className="space-y-3">
                              <h5 className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#A8998A] mb-2">
                                Contato
                              </h5>
                              <div className="bg-white rounded-xl p-3 border border-[#F0EBE3] flex items-center gap-3 hover:bg-[#F7F3EF] transition-colors">
                                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0">
                                  <Mail className="w-5 h-5 text-violet-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] text-[#A8998A] mb-0.5">E-mail</p>
                                  <a
                                    href={`mailto:${storeInfo.data.email}`}
                                    className="text-[13px] font-semibold text-[#1C1008] hover:text-[#5A3C1E] transition-colors truncate block"
                                  >
                                    {storeInfo.data.email}
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Redes Sociais */}
                          {(storeInfo.data.instagram || storeInfo.data.facebook) && (
                            <div className="space-y-3">
                              <h5 className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#A8998A] mb-2">
                                Redes Sociais
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {storeInfo.data.instagram && (
                                  <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="h-10 px-4 border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300"
                                  >
                                    <a
                                      href={storeInfo.data.instagram}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2"
                                    >
                                      <Instagram className="w-4 h-4" />
                                      <span>Instagram</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </Button>
                                )}
                                {storeInfo.data.facebook && (
                                  <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="h-10 px-4 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                                  >
                                    <a
                                      href={storeInfo.data.facebook}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2"
                                    >
                                      <Facebook className="w-4 h-4" />
                                      <span>Facebook</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Endereço */}
                          {(storeInfo.data.address || storeInfo.data.city || storeInfo.data.state) && (
                            <div className="space-y-3">
                              <h5 className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#A8998A] mb-2">
                                Endereço
                              </h5>
                              <div className="bg-white rounded-xl p-3 border border-[#F0EBE3] flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                  <MapPin className="w-5 h-5 text-red-600" />
                                </div>
                                <div className="flex-1 min-w-0 text-[13px] text-[#1C1008] space-y-0.5">
                                  {storeInfo.data.address && (
                                    <p className="font-semibold">
                                      {storeInfo.data.address}
                                      {storeInfo.data.number && `, ${storeInfo.data.number}`}
                                      {storeInfo.data.complement && ` - ${storeInfo.data.complement}`}
                                    </p>
                                  )}
                                  {storeInfo.data.neighborhood && (
                                    <p className="text-[#7C6B5C]">{storeInfo.data.neighborhood}</p>
                                  )}
                                  {(storeInfo.data.city || storeInfo.data.state) && (
                                    <p className="text-[#7C6B5C]">
                                      {storeInfo.data.city}
                                      {storeInfo.data.city && storeInfo.data.state && ', '}
                                      {storeInfo.data.state}
                                      {storeInfo.data.zipcode && ` — CEP ${storeInfo.data.zipcode}`}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-[#F7F3EF] rounded-2xl p-4">
                          <p className="text-[14px] font-semibold text-[#1C1008] mb-3">{selectedOrder.store.name}</p>
                          {selectedOrder.store.whatsapp && (
                            <Button
                              asChild
                              variant="outline"
                              className="w-full"
                            >
                              <a
                                href={`https://wa.me/${formatWhatsAppNumber(selectedOrder.store.whatsapp)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2"
                              >
                                <Phone className="w-4 h-4" />
                                Entrar em contato
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <ErrorState message="Erro ao carregar detalhes do pedido" />
                </div>
              )
            ) : (
              // Lista de pedidos
              <div className="p-4 sm:p-5">
                {/* Filtros */}
                <div className="mb-4">
                  {/* Search */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4B4A4] w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Buscar por código do pedido..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-10 rounded-xl border-[#F0EBE3] bg-[#F7F3EF] text-[13px] text-[#1C1008] placeholder:text-[#A8998A] focus:border-[#5A3C1E] focus:ring-0 w-full"
                    />
                  </div>

                  {/* Status filter pills */}
                  <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4">
                    <button
                      onClick={() => setStatusFilter('all')}
                      className={cn(
                        'flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer border-none',
                        statusFilter === 'all'
                          ? 'bg-[#1C1008] text-white'
                          : 'bg-[#F7F3EF] text-[#7C6B5C] hover:bg-[#F0EBE3]'
                      )}
                    >
                      Todos
                    </button>
                    {Object.entries(CUSTOMER_ORDER_STATUS).map(([key, status]) => (
                      <button
                        key={key}
                        onClick={() => setStatusFilter(parseInt(key))}
                        className={cn(
                          'flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer border-none',
                          statusFilter === parseInt(key)
                            ? 'bg-[#1C1008] text-white'
                            : 'bg-[#F7F3EF] text-[#7C6B5C] hover:bg-[#F0EBE3]'
                        )}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lista de Pedidos */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <LoadingSpinner />
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-12">
                    <ErrorState message="Erro ao carregar pedidos" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Package className="w-10 h-10 text-[#C4B4A4] mx-auto" />
                    <p className="text-[14px] font-semibold text-[#1C1008] mt-3">Nenhum pedido encontrado</p>
                    <p className="text-[12px] text-[#A8998A] mt-1 max-w-xs">
                      {searchTerm || statusFilter !== 'all'
                        ? 'Tente ajustar os filtros de busca'
                        : 'Você ainda não fez nenhum pedido'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {orders.map((order) => {
                      const statusInfo = getStatusInfo(order.status)
                      const firstItem = order.items[0]
                      const extraItems = order.items.length - 1

                      const getFirstItemImage = (): string | null => {
                        if (!firstItem) return null
                        const images = firstItem.product.images
                        if (images && typeof images === 'object' && !Array.isArray(images)) {
                          const obj = images as Record<string, string[]>
                          if (firstItem.color && obj[firstItem.color]?.length) return obj[firstItem.color][0]
                          const firstKey = Object.keys(obj)[0]
                          if (firstKey && obj[firstKey]?.length) return obj[firstKey][0]
                        }
                        if (Array.isArray(images) && images.length > 0) return images[0]
                        return null
                      }

                      const firstImage = getFirstItemImage()

                      return (
                        <div
                          key={order.id}
                          className="rounded-2xl border border-[#F0EBE3] overflow-hidden hover:border-[#C4B4A4] hover:shadow-sm transition-all flex flex-col cursor-pointer bg-white group"
                        >
                          {/* Corpo clicável */}
                          <div
                            className="p-4 flex-1"
                            onClick={() => handleOrderClick(order.id)}
                          >
                            {/* Status + Data */}
                            <div className="flex items-center justify-between mb-3">
                              <Badge className={cn(
                                'text-[10px] font-semibold tracking-[0.05em] uppercase px-2 py-0.5 rounded-full border',
                                statusInfo.color === 'yellow' && 'bg-amber-50 text-amber-700 border-amber-200',
                                statusInfo.color === 'blue' && 'bg-blue-50 text-blue-700 border-blue-200',
                                statusInfo.color === 'purple' && 'bg-violet-50 text-violet-700 border-violet-200',
                                statusInfo.color === 'green' && 'bg-green-50 text-green-700 border-green-200',
                                statusInfo.color === 'red' && 'bg-red-50 text-red-700 border-red-200',
                              )}>
                                {statusInfo.label}
                              </Badge>
                              <span className="text-[11px] text-[#A8998A]">{formatDate(order.created_at)}</span>
                            </div>

                            {/* Foto + Nome do primeiro produto */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F7F3EF] flex-shrink-0">
                                {firstImage ? (
                                  <div className="relative w-full h-full">
                                    <Image
                                      src={buildImageUrl(firstImage)}
                                      alt={firstItem?.product.name ?? ''}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-5 h-5 text-[#C4B4A4]" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-semibold text-[#1C1008] line-clamp-2 group-hover:text-[#5A3C1E] transition-colors">
                                  {firstItem?.product.name ?? 'Produto'}
                                </p>
                                {extraItems > 0 && (
                                  <p className="text-[11px] text-[#A8998A] mt-0.5">
                                    + {extraItems} {extraItems === 1 ? 'item' : 'itens'}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Total */}
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-[#A8998A]">{order.store?.name || 'Loja'}</span>
                              <span className="text-[15px] font-bold text-[#1C1008]">
                                {formatPrice(parseFloat(order.total))}
                              </span>
                            </div>
                          </div>

                          {/* Ações */}
                          <div
                            className="px-3 pb-3 grid grid-cols-2 gap-2 border-t border-[#F7F3EF] pt-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              size="sm"
                              className="text-[11px] text-[#7C6B5C] hover:text-[#1C1008] h-8 gap-1 bg-transparent border-none cursor-pointer"
                              onClick={() => handleOrderClick(order.id)}
                            >
                              Ver detalhes
                              <ChevronRight className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              className="text-[11px] font-medium text-[#5A3C1E] border border-[#E8E0D8] hover:bg-[#F7F3EF] h-8 gap-1 rounded-lg cursor-pointer bg-transparent"
                              disabled={isRepeating}
                              onClick={() => repeatOrder(order.id, { onSuccess: () => { onClose(); onOpenCart?.() } })}
                            >
                              <RotateCcw className={cn('w-3 h-3', isRepeating && 'animate-spin')} />
                              Repetir
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog de cancelamento */}
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
              {selectedOrder?.status === 1 ? 'Cancelar pedido' : 'Solicitar cancelamento'}
            </DialogTitle>
            <DialogDescription>
              {selectedOrder?.status === 1
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
            <p className="text-xs text-gray-400 mt-1.5 text-right">
              {cancelReason.length}/500
            </p>
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
                if (!selectedOrderId || !cancelReason.trim()) return
                cancelOrder(
                  { orderId: selectedOrderId, data: { reason: cancelReason.trim() } },
                  {
                    onSuccess: () => {
                      setShowCancelDialog(false)
                      setCancelReason('')
                    },
                  }
                )
              }}
            >
              {isCancelling ? 'Cancelando...' : 'Confirmar cancelamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
