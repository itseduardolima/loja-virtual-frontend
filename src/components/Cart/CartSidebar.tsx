'use client'

import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { useRouter } from 'next/navigation'
import { buildImageUrl, formatPrice, getCartItemImage } from '@/lib/utils'
import { getColorHex } from '@/schemas/productSchemas'
import { ShoppingBag, X, Trash2, Minus, Plus, ArrowRight, Sparkles, Shirt } from 'lucide-react'

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

  // economia total: soma max(0, preço original - subtotal real) por item
  const savings = hasItems
    ? cartItems.reduce((acc, item) => {
        const original = parseFloat(item.product.price) * item.quantity
        const diff = original - item.subtotal
        return acc + (diff > 0.01 ? diff : 0)
      }, 0)
    : 0

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={[
          'fixed inset-0 z-[199] bg-nxi1/45 backdrop-blur-[2px] transition-opacity',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      {/* Drawer */}
      <div
        className={[
          'fixed right-0 top-0 z-[200] h-screen w-full max-w-[440px] flex flex-col border-l border-nxborder bg-white shadow-[0_0_60px_rgba(3,7,18,0.2)] transition-transform duration-[380ms] ease-[cubic-bezier(.22,1,.36,1)]',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-nxborder px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={19} className="text-nxi1" />
            <h2 className="text-[16px] font-extrabold tracking-tight text-nxi1">Sua sacola</h2>
            <span className="rounded-full bg-store/10 px-2 py-0.5 text-[11px] font-bold text-store-ink">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-nxi3 transition-colors hover:bg-nxbg"
            aria-label="Fechar sacola"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {isLoadingCart ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-nxborder border-t-store" />
            </div>
          ) : !hasItems ? (
            /* Empty state */
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-nxbg text-nxi3">
                <ShoppingBag size={26} />
              </div>
              <p className="text-[15px] font-bold text-nxi1">Sua sacola está vazia</p>
              <p className="max-w-[26ch] text-[13px] text-nxi3">
                Explore a loja e adicione peças — elas aparecem aqui.
              </p>
              <button
                onClick={onClose}
                className="mt-2 rounded-full bg-store px-5 py-2.5 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
              >
                Explorar a loja
              </button>
            </div>
          ) : (
            <>
              {/* Lista de itens */}
              <div className="flex-1 overflow-y-auto px-5 py-3">
                {cartItems.map((item) => {
                  const imageUrl = getCartItemImage(item)
                  const originalTotal = parseFloat(item.product.price) * item.quantity
                  const hasDiscount = item.subtotal < originalTotal - 0.01

                  return (
                    <div
                      key={item.id}
                      className="flex gap-3.5 border-b border-nxborder py-4 last:border-0"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-[88px] w-[70px] shrink-0 overflow-hidden rounded-xl border border-nxborder">
                        {imageUrl ? (
                          <Image
                            src={buildImageUrl(imageUrl)}
                            alt={item.product.name}
                            fill
                            sizes="70px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-nxbg text-nxi3">
                            <Shirt size={18} />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13.5px] font-bold leading-snug text-nxi1">
                            {item.product.name}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            disabled={isRemovingFromCart}
                            className="shrink-0 text-nxi3 transition-colors hover:text-nxd disabled:opacity-40"
                            aria-label="Remover item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {/* Chips cor / tamanho */}
                        {(item.color || item.size) && (
                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            {item.color && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-nxborder px-1.5 py-0.5 text-[10.5px] font-semibold text-nxi2">
                                <span
                                  className="h-2.5 w-2.5 rounded-full ring-1 ring-inset ring-black/10"
                                  style={{ background: getColorHex(item.color) }}
                                />
                                {item.color}
                              </span>
                            )}
                            {item.size && (
                              <span className="rounded-full border border-nxborder px-2 py-0.5 text-[10.5px] font-semibold text-nxi2">
                                Tam {item.size}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Stepper + preço */}
                        <div className="mt-auto flex items-center justify-between pt-2.5">
                          {/* Qty stepper */}
                          <div className="flex items-center rounded-full bg-nxbg">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || isUpdatingCartItem}
                              className="flex h-8 w-8 items-center justify-center text-nxi1 disabled:opacity-30"
                              aria-label="Diminuir quantidade"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-7 text-center text-[13px] font-semibold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              // Estoque ausente/invalido: nao deixa exceder um limite
                              // desconhecido no cliente (o backend valida no checkout).
                              // Antes, quantity >= undefined era sempre false e o botao
                              // nunca desabilitava (bug S14).
                              disabled={
                                item.quantity >=
                                  (Number.isFinite(item.product.stock)
                                    ? item.product.stock
                                    : item.quantity) || isUpdatingCartItem
                              }
                              className="flex h-8 w-8 items-center justify-center text-nxi1 disabled:opacity-30"
                              aria-label="Aumentar quantidade"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Preço */}
                          <div className="text-right">
                            <div className="text-[14px] font-extrabold text-nxi1">
                              {formatPrice(item.subtotal)}
                            </div>
                            {hasDiscount && (
                              <div className="text-[11px] text-nxi3 line-through">
                                {formatPrice(originalTotal)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="shrink-0 border-t border-nxborder px-5 py-4">
                {/* Badge economia */}
                {savings > 0.01 && (
                  <div className="mb-3 flex items-center justify-center gap-1.5 rounded-lg bg-nxa/10 py-2 text-[12px] font-bold text-nxa">
                    <Sparkles size={13} />
                    Você está economizando {formatPrice(savings)}
                  </div>
                )}

                {/* Subtotal */}
                <div className="mb-1 flex items-center justify-between text-[13px]">
                  <span className="text-nxi2">Subtotal</span>
                  <span className="font-semibold text-nxi1">{formatPrice(subtotal)}</span>
                </div>

                {/* Nota frete */}
                <p className="mb-3 text-[11.5px] text-nxi3">
                  Frete e pagamento são combinados com a loja no WhatsApp após o pedido.
                </p>

                {/* CTA finalizar */}
                <button
                  onClick={handleCheckout}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-store text-[14px] font-bold text-white transition-transform active:scale-[0.99]"
                >
                  Finalizar compra
                  <ArrowRight size={16} />
                </button>

                {/* Ghost continuar */}
                <button
                  onClick={onClose}
                  className="mt-2 h-10 w-full text-[12.5px] font-semibold text-nxi3 transition-colors hover:text-nxi1"
                >
                  Continuar comprando
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
