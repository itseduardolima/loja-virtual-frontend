'use client'

import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { useRouter } from 'next/navigation'
import { buildImageUrl, formatPrice } from '@/lib/utils'

function IconBag() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#D1C5BA" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

function IconClose() {
  return (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="14" y1="4" x2="4" y2="14" /><line x1="4" y1="4" x2="14" y2="14" />
    </svg>
  )
}

function IconTrash() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 4 4 4 14 4" />
      <path d="M13 4l-.8 9.3H3.8L3 4" />
      <path d="M6.5 7.5v4M9.5 7.5v4" />
      <path d="M6 4V2.5h4V4" />
    </svg>
  )
}

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  storeId?: number
  storeSlug?: string
  currentPath?: string
}

export function CartSidebar({ isOpen, onClose, storeId, storeSlug }: CartSidebarProps) {
  const router = useRouter()

  const {
    cartItems,
    totalItems,
    totalPrice,
    isLoadingCart,
    removeFromCart,
    updateCartItem,
    isRemovingFromCart,
    isUpdatingCartItem,
  } = useCart(storeId)

  const hasItems = Array.isArray(cartItems) && cartItems.length > 0
  const subtotal = totalPrice || 0

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
    } else {
      updateCartItem({ itemId, quantity: newQuantity })
    }
  }

  const handleCheckout = () => {
    if (!storeSlug) return
    router.push(`/loja/${storeSlug}/checkout`)
    onClose()
  }

  const getProductImage = (item: NonNullable<typeof cartItems>[0]): string | null => {
    const images = item.product.images as unknown
    if (Array.isArray(images) && images.length > 0) return images[0] as string
    if (images && typeof images === 'object' && !Array.isArray(images)) {
      const byColor = images as Record<string, string[]>
      const forColor = item.color ? byColor[item.color] : null
      if (Array.isArray(forColor) && forColor.length > 0) return forColor[0]
      const first = Object.values(byColor)[0]
      if (first?.length) return first[0]
    }
    return null
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15,10,5,.48)',
          zIndex: 199,
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity .32s ease',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: 'clamp(320px,42vw,440px)',
          background: '#fff',
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform .38s cubic-bezier(.22,1,.36,1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0" style={{ height: 64, padding: '0 20px 0 24px', borderBottom: '1px solid #F3F4F6' }}>
          <div className="flex items-center gap-2.5">
            <span className="text-[15px] font-bold text-[#111] tracking-[-0.01em]">Carrinho</span>
            {totalItems > 0 && (
              <span className="flex items-center justify-center text-[11px] font-bold text-white" style={{ background: '#111', width: 20, height: 20, borderRadius: 9999 }}>
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center text-gray-500 transition-all"
            style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F3F4F6'; e.currentTarget.style.borderColor = '#D1D5DB' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E5E7EB' }}
          >
            <IconClose />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: hasItems ? '0 0 12px' : 0 }}>
          {isLoadingCart ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 rounded-full border-2 border-gray-200 border-t-[#111] animate-spin" />
            </div>
          ) : !hasItems ? (
            <div className="flex flex-col items-center justify-center h-full text-center" style={{ padding: '0 32px' }}>
              <div className="flex items-center justify-center mb-5" style={{ width: 80, height: 80, borderRadius: 20, background: '#FAF6F2' }}>
                <IconBag />
              </div>
              <p className="text-[17px] font-bold text-[#111] tracking-[-0.01em]">Carrinho vazio</p>
              <p className="text-[13px] text-gray-400 mt-2" style={{ lineHeight: 1.55 }}>Adicione peças incríveis ao seu carrinho para começar.</p>
              <button
                onClick={onClose}
                className="mt-6 text-[13px] font-semibold text-white transition-colors"
                style={{ background: '#111', border: 'none', borderRadius: 12, padding: '13px 28px', cursor: 'pointer', letterSpacing: '.01em' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#333' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#111' }}
              >
                Explorar produtos →
              </button>
            </div>
          ) : (
            <div>
              {cartItems.map((item) => {
                const imageUrl = getProductImage(item)
                const originalTotal = parseFloat(item.product.price) * item.quantity
                const actualTotal = item.subtotal
                const hasDiscount = actualTotal < originalTotal - 0.01
                return (
                  <div key={item.id} className="flex gap-3.5" style={{ padding: '16px 20px 16px 24px', borderBottom: '1px solid #F9F7F5' }}>
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0" style={{ width: 72, height: 88, borderRadius: 10, overflow: 'hidden', background: '#f0ebe5' }}>
                      {imageUrl ? (
                        <Image src={buildImageUrl(imageUrl)} alt={item.product.name} fill className="object-cover" sizes="72px" />
                      ) : (
                        <div className="w-full h-full" style={{ background: 'linear-gradient(140deg,#f5ede3,#d4c4b4)' }} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0" style={{ paddingTop: 2 }}>
                      <p className="text-[13px] font-semibold text-[#111] tracking-[-0.01em] truncate">{item.product.name}</p>
                      <div className="flex items-center gap-1.5 mt-[5px]">
                        {item.size && (
                          <span className="text-[10px] text-gray-400 font-medium" style={{ background: '#F3F4F6', padding: '2px 7px', borderRadius: 5 }}>Tam {item.size}</span>
                        )}
                        {item.color && (
                          <span className="text-[10px] text-gray-400 font-medium" style={{ background: '#F3F4F6', padding: '2px 7px', borderRadius: 5 }}>{item.color}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        {/* Qty stepper */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isUpdatingCartItem}
                            className="flex items-center justify-center transition-all"
                            style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 15, color: '#374151', opacity: item.quantity <= 1 ? 0.35 : 1, flexShrink: 0 }}
                          >−</button>
                          <span className="text-[13px] font-semibold text-[#111] text-center" style={{ minWidth: 18 }}>{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={isUpdatingCartItem}
                            className="flex items-center justify-center transition-all"
                            style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', fontSize: 15, color: '#374151', flexShrink: 0 }}
                          >+</button>
                        </div>
                        {/* Price + Trash */}
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <span className="text-[14px] font-bold text-[#111]">{formatPrice(actualTotal)}</span>
                            {hasDiscount && (
                              <p className="text-[11px] text-gray-400 line-through">{formatPrice(originalTotal)}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            disabled={isRemovingFromCart}
                            className="flex items-center justify-center transition-all"
                            style={{ width: 26, height: 26, borderRadius: 6, border: 'none', background: 'transparent', color: '#C4B8B0', cursor: 'pointer' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#EF4444' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C4B8B0' }}
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {hasItems && (
          <div className="flex-shrink-0" style={{ borderTop: '1px solid #F3F4F6', padding: '16px 24px 24px', background: '#fff' }}>
            {/* Subtotal */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-[13px] text-gray-500">Subtotal</span>
              <span className="text-[17px] font-bold text-[#111] tracking-[-0.015em]">{formatPrice(subtotal)}</span>
            </div>

            {/* CTA */}
            <button
              onClick={handleCheckout}
              className="w-full text-[14px] font-bold text-white transition-colors"
              style={{ background: '#111', border: 'none', borderRadius: 12, padding: '15px 0', cursor: 'pointer', letterSpacing: '.02em' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#222' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#111' }}
            >
              Finalizar compra
            </button>
            <button
              onClick={onClose}
              className="w-full text-[12.5px] font-medium text-gray-400 transition-colors"
              style={{ background: 'transparent', border: 'none', marginTop: 10, cursor: 'pointer', padding: '6px 0' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#374151' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF' }}
            >
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </>
  )
}
