'use client'

import { useState } from 'react'
import { X, Package, Truck, Clock, CheckCircle, XCircle, Search, ChevronRight, MapPin, Phone, Mail, Instagram, Facebook, Store, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useCustomerOrders } from '@/hooks/useCustomerOrders'
import { useCustomerOrder } from '@/hooks/useCustomerOrder'
import { useStoreInfoById } from '@/hooks/useStoreInfoById'
import { CustomerOrder, CUSTOMER_ORDER_STATUS } from '@/types/customer'
import { formatDate, formatPrice, buildImageUrl } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import Image from 'next/image'

import { ErrorState } from '@/components/Layout/ErrorState'
import { LoadingSpinner } from '../Layout/LoadingSpinner'
import { WhatsappIcon } from '@/assets/icons/WhatsappIcon'

interface CustomerOrdersDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CustomerOrdersDrawer({ isOpen, onClose }: CustomerOrdersDrawerProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<number | 'all'>('all')
  const debouncedSearch = useDebounce(searchTerm, 500)

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

  const getStatusTimeline = (order: CustomerOrder) => {
    return [
      { id: 1, title: 'Pedido recebido', completed: order.status >= 1, date: order.created_at },
      { id: 2, title: 'Pagamento confirmado', completed: order.status >= 2 },
      { id: 3, title: 'Pedido enviado', completed: order.status >= 3 },
      { id: 4, title: 'Pedido entregue', completed: order.status >= 4 },
    ]
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {selectedOrderId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                </Button>
              )}
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedOrderId ? 'Detalhes do Pedido' : 'Meus Pedidos'}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
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
                        <p className="text-sm text-gray-500">Código do Pedido</p>
                        <p className="text-lg font-semibold">{selectedOrder.order_code}</p>
                      </div>
                      <Badge
                        className={`${getStatusInfo(selectedOrder.status).color === 'yellow' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            getStatusInfo(selectedOrder.status).color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              getStatusInfo(selectedOrder.status).color === 'purple' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                getStatusInfo(selectedOrder.status).color === 'green' ? 'bg-green-50 text-green-700 border-green-200' :
                                  'bg-red-50 text-red-700 border-red-200'
                          }`}
                      >
                        {getStatusInfo(selectedOrder.status).label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Data do Pedido</p>
                        <p className="font-medium">{formatDate(selectedOrder.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Valor Total</p>
                        <p className="font-medium text-lg">{formatPrice(parseFloat(selectedOrder.total))}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline de Rastreio */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Rastreamento do Pedido</h3>
                    <div className="space-y-4">
                      {getStatusTimeline(selectedOrder).map((step, index) => (
                        <div key={step.id} className="flex items-start gap-4">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                            }`}>
                            {step.completed ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <Clock className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1 pt-1">
                            <p className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                              {step.title}
                            </p>
                            {step.date && (
                              <p className="text-sm text-gray-500 mt-1">{formatDate(step.date)}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Itens do Pedido */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Itens do Pedido</h3>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          {item.product.images && item.product.images.length > 0 && (
                            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                              <Image
                                src={buildImageUrl(item.product.images[0])}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{item.product.name}</p>
                            <div className="flex gap-4 text-sm text-gray-500 mt-1">
                              <span>Qtd: {item.quantity}</span>
                              {item.color && <span>Cor: {item.color}</span>}
                              {item.size && <span>Tamanho: {item.size}</span>}
                            </div>
                            <p className="text-sm font-semibold mt-2">
                              {formatPrice(parseFloat(item.price))}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Informações da Loja */}
                  {selectedOrder.store && (
                    <div className="border-t pt-6 mt-6">
                      <div className="flex items-center gap-2 mb-5">
                        <Store className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-lg">Informações da Loja</h3>
                      </div>

                      {isLoadingStoreInfo ? (
                        <div className="flex items-center justify-center py-8">
                          <LoadingSpinner />
                        </div>
                      ) : storeInfo?.data ? (
                        <div className="space-y-5">
                          {/* Header da Loja - Nome e Descrição */}
                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                            <h4 className="font-semibold text-base text-gray-900 mb-1.5">
                              {storeInfo.data.name}
                            </h4>
                            {storeInfo.data.description && (
                              <p className="text-sm text-gray-600 leading-relaxed">
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
                              <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Contato
                              </h5>
                              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                  <Mail className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-gray-500 mb-0.5">E-mail</p>
                                  <a
                                    href={`mailto:${storeInfo.data.email}`}
                                    className="text-sm font-medium text-gray-900 hover:text-primary transition-colors truncate block"
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
                              <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
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
                              <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                Endereço
                              </h5>
                              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                  <MapPin className="w-5 h-5 text-red-600" />
                                </div>
                                <div className="flex-1 min-w-0 text-sm text-gray-700">
                                  {storeInfo.data.address && (
                                    <p className="font-medium mb-1">{storeInfo.data.address}</p>
                                  )}
                                  {(storeInfo.data.city || storeInfo.data.state) && (
                                    <p className="text-gray-600">
                                      {storeInfo.data.city}
                                      {storeInfo.data.city && storeInfo.data.state && ', '}
                                      {storeInfo.data.state}
                                      {storeInfo.data.zipcode && ` - ${storeInfo.data.zipcode}`}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <p className="font-medium text-gray-900 mb-3">{selectedOrder.store.name}</p>
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
              <div className="p-4">
                {/* Filtros */}
                <div className="space-y-3 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Buscar por código do pedido..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    <Button
                      variant={statusFilter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setStatusFilter('all')}
                    >
                      Todos
                    </Button>
                    {Object.entries(CUSTOMER_ORDER_STATUS).map(([key, status]) => (
                      <Button
                        key={key}
                        variant={statusFilter === parseInt(key) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setStatusFilter(parseInt(key))}
                      >
                        {status.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Lista de Pedidos */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner />
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center py-12">
                    <ErrorState message="Erro ao carregar pedidos" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 font-medium">Nenhum pedido encontrado</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {searchTerm || statusFilter !== 'all' ? 'Tente ajustar os filtros' : 'Você ainda não fez nenhum pedido'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((order) => {
                      const statusInfo = getStatusInfo(order.status)
                      return (
                        <button
                          key={order.id}
                          onClick={() => handleOrderClick(order.id)}
                          className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-semibold">{order.order_code}</p>
                                <Badge
                                  className={`${statusInfo.color === 'yellow' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                      statusInfo.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                        statusInfo.color === 'purple' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                          statusInfo.color === 'green' ? 'bg-green-50 text-green-700 border-green-200' :
                                            'bg-red-50 text-red-700 border-red-200'
                                    }`}
                                >
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mb-1">{order.store?.name || 'Loja'}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(order.status)}
                                  {statusInfo.description}
                                </span>
                                <span>{formatDate(order.created_at)}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-lg">{formatPrice(parseFloat(order.total))}</p>
                              <ChevronRight className="w-5 h-5 text-gray-400 mt-1 ml-auto" />
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

