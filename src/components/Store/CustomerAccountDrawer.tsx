'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  X,
  User,
  Package,
  Heart,
  MapPin,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Clock,
  Truck,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Instagram,
  Facebook,
  Phone,
  Store,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ShoppingBag,
  Mail,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { useCustomerProfile } from '@/hooks/useCustomerProfile'
import { useCustomerOrders } from '@/hooks/useCustomerOrders'
import { useCustomerOrder } from '@/hooks/useCustomerOrder'
import { useStoreInfoById } from '@/hooks/useStoreInfoById'
import { useCancelOrder } from '@/hooks/useCancelOrder'
import { useRepeatOrder } from '@/hooks/useRepeatOrder'
import { useDebounce } from '@/hooks/useDebounce'
import { useWishlist } from '@/hooks/useWishlist'
import { useAddresses, Address, CreateAddressData } from '@/hooks/useAddresses'
import { CUSTOMER_ORDER_STATUS, UpdateCustomerProfileDto } from '@/types/customer'
import { updateCustomerProfileSchema } from '@/schemas'
import { cn, formatDate, formatPrice, buildImageUrl } from '@/lib/utils'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/Layout'
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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'

/* ─── Types ─────────────────────────────────────────────────────────────── */

type DrawerTab = 'conta' | 'pedidos' | 'desejos' | 'enderecos'

interface CustomerAccountDrawerProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: DrawerTab
  onOpenCart?: () => void
}

interface WishlistProduct {
  product_id: number
  name: string
  price: number
  images: Record<string, string[]> | string[] | null
  store_slug: string
  added_at: string
}

interface WishlistResponse {
  data: WishlistProduct[]
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const emptyAddressForm: CreateAddressData = {
  label: '',
  name: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zipcode: '',
  is_default: 0,
}

function getFirstWishlistImage(images: WishlistProduct['images']): string | null {
  if (!images) return null
  if (Array.isArray(images) && images.length > 0) return images[0]
  if (typeof images === 'object' && !Array.isArray(images)) {
    const firstColor = Object.keys(images)[0]
    if (firstColor && Array.isArray(images[firstColor]) && images[firstColor].length > 0) {
      return images[firstColor][0]
    }
  }
  return null
}

function getOrderStatusBadgeClass(color: string): string {
  switch (color) {
    case 'yellow': return 'bg-[#FEF3C7] text-[#92400E]'
    case 'blue':   return 'bg-[#DBEAFE] text-[#1E40AF]'
    case 'purple': return 'bg-[#EDE9FE] text-[#5B21B6]'
    case 'green':  return 'bg-[#D1FAE5] text-[#065F46]'
    case 'red':    return 'bg-[#FEE2E2] text-[#991B1B]'
    default:       return 'bg-[#F3F4F6] text-[#374151]'
  }
}

function getOrderStatusInfo(status: number) {
  return CUSTOMER_ORDER_STATUS[status as keyof typeof CUSTOMER_ORDER_STATUS] || CUSTOMER_ORDER_STATUS[1]
}

function getFirstOrderItemImage(item: { product: { images: string[] | Record<string, string[]> }; color: string | null }): string | null {
  const images = item.product.images
  if (images && typeof images === 'object' && !Array.isArray(images)) {
    const obj = images as Record<string, string[]>
    if (item.color && obj[item.color]?.length) return obj[item.color][0]
    const firstKey = Object.keys(obj)[0]
    if (firstKey && obj[firstKey]?.length) return obj[firstKey][0]
  }
  if (Array.isArray(images) && images.length > 0) return images[0]
  return null
}

function formatWhatsAppNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.startsWith('55') ? cleaned : `55${cleaned}`
}

/* ─── Underline Input ────────────────────────────────────────────────────── */

function UnderlineField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  error?: string
}) {
  return (
    <div className="group">
      <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-500 mb-1.5 group-focus-within:text-gray-900 transition-colors duration-[180ms]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-0 border-b border-gray-200 pb-2.5 pt-2.5 text-[14px] text-gray-900 outline-none focus:border-b-gray-900 transition-[border-color] duration-[180ms] placeholder:text-gray-400"
      />
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  )
}

/* ─── Section: Conta ─────────────────────────────────────────────────────── */

function SectionConta({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const { user, setUser, logout } = useAuth()
  const { updateProfileAsync, isUpdating, fetchProfile } = useCustomerProfile()

  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [initialForm, setInitialForm] = useState({ name: '', email: '', phone: '' })
  const [dirty, setDirty] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({})

  useEffect(() => {
    if (!isOpen || !user) return
    let cancelled = false
    const loadProfile = async () => {
      try {
        const response = await fetchProfile()
        if (cancelled || !response?.data) return
        const loaded = {
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
        }
        setForm(loaded)
        setInitialForm(loaded)
      } catch {
        if (cancelled) return
        const loaded = {
          name: user.name || '',
          email: user.email || '',
          phone: '',
        }
        setForm(loaded)
        setInitialForm(loaded)
      }
    }
    loadProfile()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user])

  useEffect(() => {
    const isDirty =
      form.name !== initialForm.name ||
      form.email !== initialForm.email ||
      form.phone !== initialForm.phone
    setDirty(isDirty)
    if (isDirty) setSaved(false)
  }, [form, initialForm])

  const handleFieldChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleSave = async () => {
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
    }
    try {
      const validated = await updateCustomerProfileSchema.validate(payload, { abortEarly: false })
      setErrors({})
      const dataToSend: UpdateCustomerProfileDto = {
        name: validated.name.trim(),
        email: validated.email.trim(),
      }
      if (validated.phone?.trim()) {
        dataToSend.phone = validated.phone.trim().replace(/[^\d+]/g, '')
      }
      const response = await updateProfileAsync(dataToSend)
      if (response?.data && user) {
        setUser({
          ...user,
          name: response.data.name || user.name,
          email: response.data.email || user.email,
        })
        const userData = localStorage.getItem('user-data')
        if (userData) {
          const parsedUser = JSON.parse(userData)
          localStorage.setItem('user-data', JSON.stringify({
            ...parsedUser,
            name: response.data.name || parsedUser.name,
            email: response.data.email || parsedUser.email,
          }))
        }
      }
      const saved = {
        name: response?.data?.name || form.name,
        email: response?.data?.email || form.email,
        phone: form.phone,
      }
      setInitialForm(saved)
      setForm(saved)
      setSaved(true)
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'inner' in err && Array.isArray((err as { inner: unknown[] }).inner)) {
        const validationErrors: Record<string, string> = {}
        ;(err as { inner: Array<{ path?: string; message: string }> }).inner.forEach((e) => {
          if (e.path) validationErrors[e.path] = e.message
        })
        setErrors(validationErrors)
        const firstMessage = (err as { inner: Array<{ message: string }> }).inner[0]?.message
        if (firstMessage) toast.error(firstMessage)
      }
    }
  }

  const handleCancel = () => {
    setForm(initialForm)
    setErrors({})
  }

  const handleLogout = () => {
    logout()
    onClose()
    router.push('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : 'U'

  return (
    <div className="overflow-y-auto flex-1 px-7 py-0">
      {/* Avatar + name */}
      <div className="text-center py-7 border-b border-gray-200 mb-8">
        <div
          className="w-[72px] h-[72px] rounded-[20px] bg-gradient-to-br from-[#f5e8f0] to-[#d4a8c8] flex items-center justify-center mx-auto mb-3.5"
          style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,.6)' }}
        >
          <span style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: 26, fontWeight: 600, color: '#5a2040' }}>
            {initials}
          </span>
        </div>
        <p style={{ fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', fontSize: 22, color: '#111827', letterSpacing: '-.01em' }}>
          {user?.name || 'Cliente'}
        </p>
        <p className="text-[11px] text-gray-500 mt-1 tracking-[0.02em]">Cliente</p>
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-7">
        <UnderlineField
          label="Nome completo"
          value={form.name}
          onChange={(v) => handleFieldChange('name', v)}
          placeholder="Seu nome completo"
          error={errors.name}
        />
        <UnderlineField
          label="E-mail"
          value={form.email}
          onChange={(v) => handleFieldChange('email', v)}
          type="email"
          placeholder="seu@email.com"
          error={errors.email}
        />
        <UnderlineField
          label="Telefone / WhatsApp"
          value={form.phone}
          onChange={(v) => handleFieldChange('phone', v)}
          type="tel"
          placeholder="5511999999999"
          error={errors.phone}
        />
      </div>

      {/* Password section */}
      <div className="mt-9">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-gray-900">Senha</p>
            <p className="text-[11px] text-gray-500 mt-0.5">Última alteração: —</p>
          </div>
          <button className="bg-transparent border border-[1.5px] border-gray-200 rounded-[10px] px-4 py-2 text-[12px] font-semibold text-gray-900 cursor-pointer transition-all hover:border-gray-900 hover:bg-gray-50">
            Alterar senha
          </button>
        </div>
      </div>

      {/* Save / Cancel */}
      {dirty && (
        <div className="mt-9 flex gap-2.5">
          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="flex-1 bg-gray-900 border-none rounded-[10px] px-5 py-3.5 text-[13px] font-bold text-white cursor-pointer transition-[background] hover:bg-black disabled:opacity-60"
          >
            {isUpdating ? 'Salvando...' : 'Salvar alterações'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isUpdating}
            className="bg-transparent border border-[1.5px] border-gray-200 rounded-[10px] px-5 py-3.5 text-[13px] font-semibold text-gray-900 cursor-pointer transition-all hover:border-gray-900 hover:bg-gray-50 disabled:opacity-60"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Success toast */}
      {saved && !dirty && (
        <div className="mt-7 flex items-center gap-2 px-4 py-3 bg-[#D1FAE5] rounded-[10px]">
          <CheckCircle className="w-4 h-4 text-[#065F46]" />
          <span className="text-[13px] font-medium text-[#065F46]">Dados salvos com sucesso.</span>
        </div>
      )}

    </div>
  )
}

/* ─── Section: Pedidos ───────────────────────────────────────────────────── */

function SectionPedidos({ isOpen, onOpenCart }: { isOpen: boolean; onOpenCart?: () => void }) {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<number | 'all'>('all')
  const debouncedSearch = useDebounce(searchTerm, 500)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder()
  const { mutate: repeatOrder, isPending: isRepeating } = useRepeatOrder()

  const { data: ordersData, isLoading } = useCustomerOrders({
    page: 1,
    limit: 20,
    search: debouncedSearch || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    sort: 'DATE_DESC',
  })

  const { data: selectedOrder, isLoading: isLoadingOrder } = useCustomerOrder(selectedOrderId || 0)
  const { data: storeInfo, isLoading: isLoadingStoreInfo } = useStoreInfoById(selectedOrder?.store?.id)

  const orders = ordersData?.data || []
  const meta = ordersData?.meta

  const statusTabs: Array<{ key: 'all' | number; label: string }> = [
    { key: 'all', label: 'Todos' },
    ...Object.entries(CUSTOMER_ORDER_STATUS).map(([key, s]) => ({
      key: parseInt(key) as number,
      label: s.label,
    })),
  ]

  /* Detail view */
  if (selectedOrderId) {
    const statusInfo = selectedOrder ? getOrderStatusInfo(selectedOrder.status) : null

    return (
      <>
        {/* Back nav */}
        <div className="flex items-center h-[48px] px-5 border-b border-gray-100 flex-shrink-0">
          <button
            onClick={() => setSelectedOrderId(null)}
            className="flex items-center gap-1 text-[12px] font-medium text-gray-400 hover:text-gray-900 bg-transparent border-none cursor-pointer p-0 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Voltar
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {isLoadingOrder ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : selectedOrder ? (
            <>
              {/* ── Hero block ── dark editorial header */}
              <div className="bg-gray-950 px-6 pt-7 pb-6">
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div>
                    <p className="text-[10px] font-mono tracking-[0.2em] text-gray-500 uppercase mb-1">Pedido</p>
                    <p className="text-[22px] font-bold text-white leading-none tracking-tight">
                      #{selectedOrder.order_code}
                    </p>
                  </div>
                  <span className={cn(
                    'mt-1 text-[10px] font-bold px-2.5 py-1 rounded-full tracking-[0.06em] uppercase flex-shrink-0',
                    getOrderStatusBadgeClass(statusInfo?.color ?? 'yellow')
                  )}>
                    {statusInfo?.label}
                  </span>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-4 text-[11px] text-gray-500">
                  <span>{formatDate(selectedOrder.created_at)}</span>
                  <span className="w-px h-3 bg-gray-800 flex-shrink-0" />
                  <span>{selectedOrder.items.length} {selectedOrder.items.length === 1 ? 'item' : 'itens'}</span>
                  <span className="w-px h-3 bg-gray-800 flex-shrink-0" />
                  <span className="text-white font-semibold ml-auto text-[13px]">
                    {formatPrice(parseFloat(selectedOrder.total))}
                  </span>
                </div>
              </div>

              {/* ── Timeline ── */}
              <div className="px-6 py-5 border-b border-gray-100">
                <OrderTrackingTimeline
                  currentStatus={selectedOrder.status}
                  orderId={selectedOrder.id}
                  showTitle={false}
                  isVendor={false}
                />
              </div>

              {/* ── Items (receipt style) ── */}
              <div className="px-6 pt-5 pb-2">
                <p className="text-[9px] font-bold tracking-[0.22em] uppercase text-gray-400 mb-4">Itens</p>
                <div className="divide-y divide-dashed divide-gray-200">
                  {selectedOrder.items.map((item) => {
                    const imageUrl = getFirstOrderItemImage(item)
                    const tags = [
                      item.color ? item.color : null,
                      item.size ? item.size : null,
                    ].filter(Boolean)
                    return (
                      <div key={item.id} className="flex gap-3.5 py-4">
                        {/* Thumbnail */}
                        <div className="w-[52px] h-[64px] rounded-[6px] overflow-hidden bg-gray-100 flex-shrink-0">
                          {imageUrl ? (
                            <div className="relative w-full h-full">
                              <Image src={buildImageUrl(imageUrl)} alt={item.product.name} fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-4 h-4 text-gray-300" />
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <p className="text-[13px] font-semibold text-gray-900 leading-snug">{item.product.name}</p>
                          {tags.length > 0 && (
                            <p className="text-[11px] text-gray-400 mt-0.5">{tags.join(' · ')}</p>
                          )}
                        </div>
                        {/* Qty + price */}
                        <div className="flex-shrink-0 text-right flex flex-col justify-center">
                          <p className="text-[13px] font-bold text-gray-900">{formatPrice(parseFloat(item.price))}</p>
                          {item.quantity > 1 && (
                            <p className="text-[10px] text-gray-400 mt-0.5">× {item.quantity}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
                {/* Total line */}
                <div className="flex items-center justify-between pt-3.5 border-t-2 border-gray-900 mt-1">
                  <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-gray-900">Total</p>
                  <p className="text-[16px] font-bold text-gray-900">{formatPrice(parseFloat(selectedOrder.total))}</p>
                </div>
              </div>

              {/* ── Actions ── */}
              {(selectedOrder.status === 4 || selectedOrder.status === 1 || selectedOrder.status === 2) && (
                <div className="px-6 pt-4 pb-6 space-y-3 border-t border-gray-100 mt-4">
                  {selectedOrder.status === 4 && (
                    <button
                      className="w-full bg-gray-900 hover:bg-black text-white text-[13px] font-semibold h-11 rounded-xl flex items-center justify-center gap-2 transition-colors border-none cursor-pointer disabled:opacity-50"
                      disabled={isRepeating}
                      onClick={() => repeatOrder(selectedOrder.id, { onSuccess: () => { onOpenCart?.() } })}
                    >
                      <RotateCcw className={cn('w-3.5 h-3.5', isRepeating && 'animate-spin')} />
                      {isRepeating ? 'Adicionando...' : 'Comprar novamente'}
                    </button>
                  )}

                  {(selectedOrder.status === 1 || selectedOrder.status === 2) && (
                    selectedOrder.cancellation_requested === 1 ? (
                      <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                        Cancelamento solicitado — aguardando aprovação da loja.
                      </p>
                    ) : (
                      <button
                        onClick={() => { setCancelReason(''); setShowCancelDialog(true) }}
                        className="w-full bg-transparent border-none text-[12px] text-gray-400 hover:text-red-500 cursor-pointer p-0 transition-colors text-center"
                      >
                        Solicitar cancelamento
                      </button>
                    )
                  )}
                </div>
              )}

              {/* ── Loja ── */}
              {selectedOrder.store && (
                <div className="px-6 pt-5 pb-8 border-t border-gray-100">
                  <p className="text-[9px] font-bold tracking-[0.22em] uppercase text-gray-400 mb-4">Vendido por</p>

                  {isLoadingStoreInfo ? (
                    <div className="flex justify-center py-4"><LoadingSpinner /></div>
                  ) : storeInfo?.data ? (
                    <div>
                      <p className="text-[14px] font-semibold text-gray-900">{storeInfo.data.name}</p>
                      {storeInfo.data.description && (
                        <p className="text-[12px] text-gray-400 mt-1 leading-relaxed break-words">{storeInfo.data.description}</p>
                      )}

                      <div className="mt-4 space-y-2.5">
                        {storeInfo.data.whatsapp && (
                          <a
                            href={`https://wa.me/${formatWhatsAppNumber(storeInfo.data.whatsapp)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 text-[13px] font-medium text-[#16A34A] hover:text-[#15803D] no-underline transition-colors"
                          >
                            <WhatsappIcon />
                            WhatsApp
                          </a>
                        )}
                        {storeInfo.data.email && (
                          <a href={`mailto:${storeInfo.data.email}`} className="flex items-center gap-2.5 text-[13px] text-gray-500 hover:text-gray-900 no-underline transition-colors">
                            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                            {storeInfo.data.email}
                          </a>
                        )}
                        {storeInfo.data.instagram && (
                          <a href={storeInfo.data.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-[13px] text-gray-500 hover:text-gray-900 no-underline transition-colors">
                            <Instagram className="w-3.5 h-3.5 flex-shrink-0" />
                            Instagram
                          </a>
                        )}
                        {storeInfo.data.facebook && (
                          <a href={storeInfo.data.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-[13px] text-gray-500 hover:text-gray-900 no-underline transition-colors">
                            <Facebook className="w-3.5 h-3.5 flex-shrink-0" />
                            Facebook
                          </a>
                        )}
                        {(storeInfo.data.address || storeInfo.data.city) && (
                          <div className="flex items-start gap-2.5 text-[12px] text-gray-400 leading-relaxed">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            <span>
                              {storeInfo.data.address && `${storeInfo.data.address}${storeInfo.data.number ? `, ${storeInfo.data.number}` : ''}`}
                              {storeInfo.data.city && ` — ${storeInfo.data.city}`}
                              {storeInfo.data.state && `/${storeInfo.data.state}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-[14px] font-semibold text-gray-900 mb-3">{selectedOrder.store.name}</p>
                      {selectedOrder.store.whatsapp && (
                        <a
                          href={`https://wa.me/${formatWhatsAppNumber(selectedOrder.store.whatsapp)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[13px] font-medium text-[#16A34A] hover:text-[#15803D] no-underline transition-colors"
                        >
                          <WhatsappIcon />
                          Falar no WhatsApp
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-[13px] text-gray-400">Pedido não encontrado.</p>
            </div>
          )}
        </div>

        {/* Cancel dialog */}
        <Dialog
          open={showCancelDialog}
          onOpenChange={(open) => {
            if (!open) { setShowCancelDialog(false); setCancelReason('') }
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
              <p className="text-xs text-gray-400 mt-1.5 text-right">{cancelReason.length}/500</p>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="ghost" onClick={() => { setShowCancelDialog(false); setCancelReason('') }}>
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

  /* List view */
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Status filter tabs */}
      <div className="border-b border-gray-200 flex-shrink-0">
        <div className="flex overflow-x-auto h-[46px] px-6" style={{ scrollbarWidth: 'none' }}>
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.key
            return (
              <button
                key={String(tab.key)}
                onClick={() => setStatusFilter(tab.key)}
                className={cn(
                  'flex-shrink-0 px-3.5 h-full bg-transparent border-none cursor-pointer text-[12px] whitespace-nowrap relative transition-colors duration-[160ms]',
                  isActive ? 'font-bold text-gray-900' : 'font-medium text-gray-500'
                )}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-[1.5px] bg-gray-900 rounded-[1px]" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Search bar */}
      <div className="px-6 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center gap-2.5 bg-white border-[1.5px] border-gray-200 focus-within:border-gray-900 rounded-[12px] px-3.5 h-[40px] transition-[border-color] duration-[180ms]">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por código do pedido..."
            className="bg-transparent flex-1 border-0 text-[13px] text-gray-900 outline-none placeholder:text-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-500 bg-transparent border-none cursor-pointer p-0"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Orders */}
      <div className="overflow-y-auto flex-1 flex flex-col gap-3 px-6 pb-7">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 flex-1">
            <LoadingSpinner />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center flex-1">
            <div className="w-[60px] h-[60px] rounded-[18px] bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <Package className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-[16px] font-bold text-gray-900 tracking-[-0.01em]">Nenhum pedido encontrado</p>
            <p className="text-[12.5px] text-gray-500 mt-2 leading-[1.55] max-w-[240px]">
              {searchTerm || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Você ainda não fez nenhum pedido'}
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => { setSearchTerm(''); setStatusFilter('all') }}
                className="mt-4 bg-transparent border border-[1.5px] border-gray-200 rounded-[10px] px-4 py-2 text-[12px] font-semibold text-gray-900 cursor-pointer transition-all hover:border-gray-900 hover:bg-gray-50"
              >
                Limpar filtro
              </button>
            )}
          </div>
        ) : (
          orders.map((order) => {
            const statusInfo = getOrderStatusInfo(order.status)
            const firstItem = order.items[0]
            const extraItems = order.items.length - 1
            const firstImage = firstItem ? getFirstOrderItemImage(firstItem) : null

            return (
              <div
                key={order.id}
                className="bg-white rounded-[14px] border border-gray-200 overflow-hidden transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,.07)]"
              >
                {/* Card header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-gray-900 tracking-[0.06em]">
                      #{order.order_code}
                    </span>
                    <span className="text-gray-400">·</span>
                    <span className="text-[11px] text-gray-500">{formatDate(order.created_at)}</span>
                  </div>
                  <span className={cn(
                    'text-[10px] font-bold px-[9px] py-[3px] rounded-full tracking-[0.04em]',
                    getOrderStatusBadgeClass(statusInfo.color)
                  )}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Card body */}
                <div className="px-4 py-3">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Thumbnails */}
                    <div className="flex">
                      {order.items.slice(0, 3).map((item, i) => {
                        const img = getFirstOrderItemImage(item)
                        return (
                          <div
                            key={item.id}
                            className="w-[44px] h-[54px] rounded-[8px] overflow-hidden border-[2px] border-white bg-gray-100 flex-shrink-0"
                            style={{ marginLeft: i > 0 ? -10 : 0 }}
                          >
                            {img ? (
                              <div className="relative w-full h-full">
                                <Image src={buildImageUrl(img)} alt={item.product.name} fill className="object-cover" />
                              </div>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-semibold text-gray-900 truncate">
                        {firstItem?.product.name || 'Produto'}
                      </p>
                      {extraItems > 0 && (
                        <p className="text-[11px] text-gray-500">
                          + {extraItems} {extraItems === 1 ? 'item' : 'itens'}
                        </p>
                      )}
                    </div>

                    <span className="text-[14px] font-extrabold text-gray-900 tracking-[-0.02em] flex-shrink-0">
                      {formatPrice(parseFloat(order.total))}
                    </span>
                  </div>
                </div>

                {/* Card footer */}
                <div className="px-4 py-2.5 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => setSelectedOrderId(order.id)}
                    className="bg-transparent border border-[1.5px] border-gray-200 rounded-[10px] px-4 py-2 text-[11px] font-semibold text-gray-900 cursor-pointer transition-all hover:border-gray-900 hover:bg-gray-50"
                  >
                    Ver detalhes →
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

/* ─── Section: Desejos ───────────────────────────────────────────────────── */

function SectionDesejos({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { toggleWishlist } = useWishlist()

  const { data, isLoading } = useQuery<WishlistResponse>({
    queryKey: ['customer-wishlist-items'],
    queryFn: async () => {
      const response = await api.get<WishlistResponse>('/customers/wishlist')
      return response.data
    },
    enabled: isAuthenticated && isOpen,
  })

  const items = data?.data ?? []

  const handleViewProduct = (storeSlug: string, productId: number) => {
    onClose()
    router.push(`/loja/${storeSlug}/produto/${productId}`)
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
        <div className="w-[64px] h-[64px] rounded-[20px] bg-gray-50 flex items-center justify-center mb-5">
          <Heart className="w-7 h-7 text-gray-400" />
        </div>
        <p style={{ fontFamily: '"Cormorant Garamond"', fontStyle: 'italic', fontSize: 20, color: '#111827' }}>
          Sua lista está vazia
        </p>
        <p className="text-[12.5px] text-gray-500 mt-2 leading-[1.55]">
          Toque no coração de um produto para salvar aqui.
        </p>
        <button
          onClick={onClose}
          className="mt-6 bg-gray-900 border-none rounded-[10px] px-5 py-2.5 text-[12px] font-bold text-white cursor-pointer transition-[background] hover:bg-black"
        >
          Explorar produtos
        </button>
      </div>
    )
  }

  return (
    <div className="overflow-y-auto flex-1 p-6">
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => {
          const imageUrl = getFirstWishlistImage(item.images)
          return (
            <div key={item.product_id}>
              {/* Image container */}
              <div className="relative rounded-[12px] overflow-hidden bg-[#f0ebe5]" style={{ aspectRatio: '3/4' }}>
                {imageUrl ? (
                  <Image
                    src={buildImageUrl(imageUrl)}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f5efe9] to-[#e8ddd5]">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                )}

                {/* Remove button */}
                <button
                  onClick={() => toggleWishlist(item.product_id)}
                  className="absolute top-2 right-2 w-[28px] h-[28px] rounded-full bg-white/90 backdrop-blur-sm border-none flex items-center justify-center cursor-pointer text-[#EF4444] text-[14px] transition-colors hover:bg-[#FEF2F2]"
                  title="Remover dos favoritos"
                >
                  ×
                </button>
              </div>

              {/* Info below image */}
              <div className="pt-2.5 px-0.5">
                <p className="text-[12px] font-bold text-gray-900 tracking-[-0.01em] leading-[1.3]">
                  {item.name}
                </p>
                <p className="text-[13.5px] font-extrabold text-gray-900 tracking-[-0.02em] mt-1">
                  {formatPrice(item.price)}
                </p>
                <button
                  onClick={() => handleViewProduct(item.store_slug, item.product_id)}
                  className="mt-2 w-full bg-gray-900 border-none rounded-[9px] py-[9px] text-[11px] font-bold text-white cursor-pointer transition-[background] hover:bg-black flex items-center justify-center gap-1.5"
                >
                  Ver produto
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Section: Endereços ─────────────────────────────────────────────────── */

function SectionEnderecos({ isOpen }: { isOpen: boolean }) {
  const { isAuthenticated } = useAuth()
  const {
    addresses,
    isLoading,
    createAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress,
    isCreating,
    isUpdating,
  } = useAddresses(isAuthenticated && isOpen)

  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<CreateAddressData>(emptyAddressForm)
  const [isFetchingCep, setIsFetchingCep] = useState(false)
  const [cepError, setCepError] = useState('')
  const numberInputRef = useRef<HTMLInputElement>(null)

  const handleEdit = (addr: Address) => {
    setEditId(addr.id)
    setForm({
      label: addr.label ?? '',
      name: addr.name,
      street: addr.street,
      number: addr.number ?? '',
      complement: addr.complement ?? '',
      neighborhood: addr.neighborhood ?? '',
      city: addr.city,
      state: addr.state,
      zipcode: addr.zipcode,
      is_default: addr.is_default,
    })
    setCepError('')
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.street || !form.city || !form.state || !form.zipcode) return
    if (editId) {
      await updateAddress({ id: editId, data: form })
    } else {
      await createAddress(form)
    }
    setShowForm(false)
    setEditId(null)
    setForm(emptyAddressForm)
    setCepError('')
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditId(null)
    setForm(emptyAddressForm)
    setCepError('')
  }

  const handleZipcodeChange = async (value: string) => {
    const formatted = value.slice(0, 9)
    setForm((p) => ({ ...p, zipcode: formatted }))
    setCepError('')

    const digits = formatted.replace(/\D/g, '')
    if (digits.length === 8) {
      setIsFetchingCep(true)
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
        const data = await res.json()
        if (data.erro) {
          setCepError('CEP não encontrado')
        } else {
          setForm((p) => ({
            ...p,
            zipcode: formatted,
            street: data.logradouro || p.street,
            neighborhood: data.bairro || p.neighborhood,
            city: data.localidade || p.city,
            state: data.uf || p.state,
          }))
          setTimeout(() => numberInputRef.current?.focus(), 50)
        }
      } catch {
        setCepError('Erro ao consultar o CEP')
      } finally {
        setIsFetchingCep(false)
      }
    }
  }

  /* Form view */
  if (showForm) {
    return (
      <>
        {/* Sub-header */}
        <div className="flex items-center gap-2 h-12 px-6 border-b border-gray-200 flex-shrink-0">
          <button
            onClick={handleCancel}
            className="flex items-center gap-1.5 text-[13px] font-medium text-gray-900 bg-transparent border-none cursor-pointer p-0"
          >
            <ChevronLeft className="w-4 h-4" />
            Endereços
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-7 py-6">
          <p style={{ fontFamily: '"Cormorant Garamond"', fontStyle: 'italic', fontSize: 20, color: '#111827' }} className="mb-6">
            {editId ? 'Editar endereço' : 'Novo endereço'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* CEP + Rótulo */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-500 mb-1.5 group-focus-within:text-gray-900 transition-colors duration-[180ms]">
                  CEP *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.zipcode}
                    onChange={(e) => handleZipcodeChange(e.target.value)}
                    placeholder="00000-000"
                    maxLength={9}
                    required
                    className="w-full bg-transparent border-0 border-b border-gray-200 pb-2.5 pt-2.5 text-[14px] text-gray-900 outline-none focus:border-b-gray-900 transition-[border-color] duration-[180ms] placeholder:text-gray-400 pr-7"
                  />
                  {isFetchingCep && (
                    <Loader2 className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 animate-spin" />
                  )}
                </div>
                {cepError && <p className="text-[11px] text-red-500 mt-1">{cepError}</p>}
              </div>

              <div className="group">
                <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-500 mb-1.5 group-focus-within:text-gray-900 transition-colors duration-[180ms]">
                  Rótulo
                </label>
                <input
                  type="text"
                  value={form.label ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, label: e.target.value.slice(0, 30) }))}
                  placeholder="Casa, Trabalho..."
                  maxLength={30}
                  className="w-full bg-transparent border-0 border-b border-gray-200 pb-2.5 pt-2.5 text-[14px] text-gray-900 outline-none focus:border-b-gray-900 transition-[border-color] duration-[180ms] placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Nome destinatário */}
            <div className="group">
              <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-500 mb-1.5 group-focus-within:text-gray-900 transition-colors duration-[180ms]">
                Nome do destinatário *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value.slice(0, 80) }))}
                placeholder="Nome completo"
                maxLength={80}
                required
                className="w-full bg-transparent border-0 border-b border-gray-200 pb-2.5 pt-2.5 text-[14px] text-gray-900 outline-none focus:border-b-gray-900 transition-[border-color] duration-[180ms] placeholder:text-gray-400"
              />
            </div>

            {/* Logradouro */}
            <div className="group">
              <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-500 mb-1.5 group-focus-within:text-gray-900 transition-colors duration-[180ms]">
                Logradouro *
              </label>
              <input
                type="text"
                value={form.street}
                onChange={(e) => setForm((p) => ({ ...p, street: e.target.value.slice(0, 100) }))}
                placeholder="Rua, Avenida..."
                maxLength={100}
                required
                className="w-full bg-transparent border-0 border-b border-gray-200 pb-2.5 pt-2.5 text-[14px] text-gray-900 outline-none focus:border-b-gray-900 transition-[border-color] duration-[180ms] placeholder:text-gray-400"
              />
            </div>

            {/* Número + Complemento */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-500 mb-1.5 group-focus-within:text-gray-900 transition-colors duration-[180ms]">
                  Número
                </label>
                <input
                  ref={numberInputRef}
                  type="text"
                  value={form.number ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, number: e.target.value.slice(0, 10) }))}
                  placeholder="123"
                  maxLength={10}
                  className="w-full bg-transparent border-0 border-b border-gray-200 pb-2.5 pt-2.5 text-[14px] text-gray-900 outline-none focus:border-b-gray-900 transition-[border-color] duration-[180ms] placeholder:text-gray-400"
                />
              </div>

              <div className="group">
                <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-500 mb-1.5 group-focus-within:text-gray-900 transition-colors duration-[180ms]">
                  Complemento
                </label>
                <input
                  type="text"
                  value={form.complement ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, complement: e.target.value.slice(0, 50) }))}
                  placeholder="Apto 4B"
                  maxLength={50}
                  className="w-full bg-transparent border-0 border-b border-gray-200 pb-2.5 pt-2.5 text-[14px] text-gray-900 outline-none focus:border-b-gray-900 transition-[border-color] duration-[180ms] placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Bairro */}
            <div className="group">
              <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-500 mb-1.5 group-focus-within:text-gray-900 transition-colors duration-[180ms]">
                Bairro
              </label>
              <input
                type="text"
                value={form.neighborhood ?? ''}
                onChange={(e) => setForm((p) => ({ ...p, neighborhood: e.target.value.slice(0, 60) }))}
                placeholder="Bairro"
                maxLength={60}
                className="w-full bg-transparent border-0 border-b border-gray-200 pb-2.5 pt-2.5 text-[14px] text-gray-900 outline-none focus:border-b-gray-900 transition-[border-color] duration-[180ms] placeholder:text-gray-400"
              />
            </div>

            {/* Cidade + UF */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-500 mb-1.5 group-focus-within:text-gray-900 transition-colors duration-[180ms]">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm((p) => ({ ...p, city: e.target.value.slice(0, 60) }))}
                  placeholder="São Paulo"
                  maxLength={60}
                  required
                  className="w-full bg-transparent border-0 border-b border-gray-200 pb-2.5 pt-2.5 text-[14px] text-gray-900 outline-none focus:border-b-gray-900 transition-[border-color] duration-[180ms] placeholder:text-gray-400"
                />
              </div>

              <div className="group">
                <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-500 mb-1.5 group-focus-within:text-gray-900 transition-colors duration-[180ms]">
                  UF *
                </label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm((p) => ({ ...p, state: e.target.value.toUpperCase().slice(0, 2) }))}
                  placeholder="SP"
                  maxLength={2}
                  required
                  className="w-full bg-transparent border-0 border-b border-gray-200 pb-2.5 pt-2.5 text-[14px] text-gray-900 outline-none focus:border-b-gray-900 transition-[border-color] duration-[180ms] placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Padrão */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="addr_is_default"
                checked={form.is_default === 1}
                onChange={(e) => setForm((p) => ({ ...p, is_default: e.target.checked ? 1 : 0 }))}
                className="rounded"
              />
              <label htmlFor="addr_is_default" className="text-[12px] text-gray-500 cursor-pointer">
                Definir como endereço padrão
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-2.5 pb-8">
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="flex-1 bg-gray-900 border-none rounded-[10px] px-5 py-3.5 text-[13px] font-bold text-white cursor-pointer transition-[background] hover:bg-black disabled:opacity-60"
              >
                {isCreating || isUpdating ? 'Salvando...' : 'Salvar endereço'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-transparent border border-[1.5px] border-gray-200 rounded-[10px] px-5 py-3.5 text-[13px] font-semibold text-gray-900 cursor-pointer transition-all hover:border-gray-900 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </>
    )
  }

  /* List view */
  return (
    <div className="overflow-y-auto flex-1 px-6 pb-8 pt-5">
      {isLoading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-10">
          <MapPin className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <p className="text-[16px] font-bold text-gray-900 tracking-[-0.01em]">Nenhum endereço salvo</p>
          <p className="text-[12.5px] text-gray-500 mt-2 leading-[1.55] max-w-[240px] mx-auto">
            Salve endereços para agilizar seus próximos pedidos
          </p>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={cn(
                'rounded-[14px] border-[1.5px] p-4 bg-white transition-[border-color,box-shadow] duration-[180ms] hover:shadow-[0_4px_16px_rgba(0,0,0,.06)]',
                addr.is_default === 1
                  ? 'border-gray-900'
                  : 'border-gray-200 hover:border-gray-400'
              )}
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  {addr.label && (
                    <span className={cn(
                      'text-[10px] font-bold tracking-[0.1em] uppercase rounded-full px-[9px] py-[3px]',
                      addr.is_default === 1 ? 'text-gray-900 bg-gray-100' : 'text-gray-500 bg-gray-50'
                    )}>
                      {addr.label}
                    </span>
                  )}
                  {addr.is_default === 1 && (
                    <span className="flex items-center gap-1 text-[10px] text-[#10B981] font-semibold">
                      <CheckCircle className="w-3 h-3" />
                      Principal
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(addr)}
                    className="w-[30px] h-[30px] rounded-[8px] border border-gray-200 bg-white flex items-center justify-center text-gray-500 cursor-pointer transition-all hover:border-gray-400 hover:text-gray-900"
                    title="Editar"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  {addr.is_default !== 1 && (
                    <button
                      onClick={() => removeAddress(addr.id)}
                      className="w-[30px] h-[30px] rounded-[8px] border border-gray-200 bg-white flex items-center justify-center text-gray-500 cursor-pointer transition-all hover:border-red-200 hover:text-[#EF4444]"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="flex gap-2.5 items-start">
                <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">{addr.name}</p>
                  <p className="text-[12.5px] text-[#6B7280] leading-[1.6] mt-0.5">
                    {addr.street}
                    {addr.number ? `, ${addr.number}` : ''}
                    {addr.complement ? ` - ${addr.complement}` : ''}
                  </p>
                  {addr.neighborhood && (
                    <p className="text-[12.5px] text-[#6B7280] leading-[1.6]">{addr.neighborhood}</p>
                  )}
                  <p className="text-[12.5px] text-[#6B7280] leading-[1.6]">
                    {addr.city} - {addr.state}
                  </p>
                  <p className="font-mono text-[11px] tracking-[0.06em] text-[#6B7280]">{addr.zipcode}</p>
                </div>
              </div>

              {/* Set as default */}
              {addr.is_default !== 1 && (
                <button
                  onClick={() => setDefaultAddress(addr.id)}
                  className="mt-3 bg-transparent border-none text-[11.5px] font-semibold text-gray-900 cursor-pointer p-0 opacity-70 hover:opacity-100 transition-opacity"
                >
                  Definir como principal
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add new address button */}
      <button
        onClick={() => { setForm(emptyAddressForm); setEditId(null); setCepError(''); setShowForm(true) }}
        className="flex items-center justify-center gap-2 w-full py-3.5 bg-transparent border-[1.5px] border-dashed border-gray-300 rounded-[14px] text-[13px] font-semibold text-gray-900 cursor-pointer transition-all hover:border-gray-900 hover:bg-gray-50"
      >
        <Plus className="w-4 h-4" />
        Novo endereço
      </button>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export function CustomerAccountDrawer({
  isOpen,
  onClose,
  initialTab = 'conta',
  onOpenCart,
}: CustomerAccountDrawerProps) {
  const [tab, setTab] = useState<DrawerTab>(initialTab)
  const { user } = useAuth()

  useEffect(() => {
    if (isOpen) setTab(initialTab)
  }, [isOpen, initialTab])

  useEffect(() => {
    if (!isOpen) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [isOpen, onClose])

  const TAB_ICONS: Record<DrawerTab, React.ElementType> = {
    conta: User,
    pedidos: Package,
    desejos: Heart,
    enderecos: MapPin,
  }

  const TAB_LABELS: Record<DrawerTab, string> = {
    conta: 'Conta',
    pedidos: 'Pedidos',
    desejos: 'Desejos',
    enderecos: 'Endereços',
  }

  const TAB_TITLES: Record<DrawerTab, string> = {
    conta: 'Minha Conta',
    pedidos: 'Meus Pedidos',
    desejos: 'Lista de Desejos',
    enderecos: 'Endereços',
  }

  const tabs: DrawerTab[] = ['conta', 'pedidos', 'desejos', 'enderecos']

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[199] backdrop-blur-[4px] transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{ background: 'rgba(0,0,0,.5)' }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full flex flex-col z-[200] bg-white',
          'transition-transform duration-[400ms] ease-[cubic-bezier(.22,1,.36,1)]',
          isOpen ? 'translate-x-0' : 'translate-x-[102%]'
        )}
        style={{ width: 'clamp(340px,46vw,480px)' }}
      >
        {/* Header */}
        <div className="h-[60px] flex items-center justify-between px-6 border-b border-gray-200 flex-shrink-0 bg-white">
          <h2
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              fontSize: 19,
              color: '#111827',
              letterSpacing: '-.01em',
            }}
          >
            {TAB_TITLES[tab]}
          </h2>
          <button
            onClick={onClose}
            className="w-[34px] h-[34px] rounded-[9px] border border-gray-200 bg-white flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-all"
            aria-label="Fechar"
          >
            <X className="w-[15px] h-[15px]" />
          </button>
        </div>

        {/* Section content */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          {tab === 'conta'     && <SectionConta isOpen={isOpen} onClose={onClose} />}
          {tab === 'pedidos'   && <SectionPedidos isOpen={isOpen} onOpenCart={onOpenCart} />}
          {tab === 'desejos'   && <SectionDesejos isOpen={isOpen} onClose={onClose} />}
          {tab === 'enderecos' && <SectionEnderecos isOpen={isOpen} />}
        </div>

        {/* Bottom tab bar */}
        <div className="h-[60px] flex border-t border-gray-200 flex-shrink-0 bg-white">
          {tabs.map((t) => {
            const Icon = TAB_ICONS[t]
            const isActive = tab === t
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-1 flex-1 h-full text-[10px] font-bold tracking-[0.1em] uppercase transition-colors duration-[180ms] border-none bg-transparent cursor-pointer',
                  isActive ? 'text-gray-900' : 'text-gray-500'
                )}
              >
                <Icon className="w-[18px] h-[18px]" />
                <span>{TAB_LABELS[t]}</span>
                <span
                  className={cn(
                    'absolute bottom-0 left-[20%] right-[20%] h-[1.5px] bg-gray-900 rounded-[1px] transition-transform duration-[240ms] ease-[cubic-bezier(.22,1,.36,1)] origin-center',
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  )}
                />
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
