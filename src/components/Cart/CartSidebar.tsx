'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  X, 
  Plus, 
  Minus,
  ShoppingBag,
  CreditCard,
} from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import { useCheckout } from '@/hooks/useCheckout'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { CheckoutModal } from '@/components/Checkout/CheckoutModal'
import { buildImageUrl } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  storeId?: number
  storeSlug?: string
  currentPath?: string
}

export function CartSidebar({ isOpen, onClose, storeId, storeSlug, currentPath }: CartSidebarProps) {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  
  const {
    cartItems,
    totalItems,
    totalPrice,
    isLoadingCart,
    sessionId,
    removeFromCart,
    updateCartItem,
    clearCart,
    isRemovingFromCart,
    isUpdatingCartItem,
    isClearingCart
  } = useCart(storeId)
  
  const {  isCheckoutLoading } = useCheckout()
  
  const hasItems = Array.isArray(cartItems) && cartItems.length > 0

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
    } else {
      updateCartItem({ itemId, quantity: newQuantity })
    }
  }

  const handleRemoveItem = (itemId: number) => {
    removeFromCart(itemId)
  }

  const handleClearCart = () => {
    clearCart()
  }

  const handleCheckout = async () => {
    if (!sessionId || !storeId) {
      return
    }
    
    // Verificar se o usuário está logado
    if (!isAuthenticated) {
      // Verificar se storeSlug existe
      if (!storeSlug) {
        console.error('storeSlug não encontrado!')
        router.push('/login')
        return
      }
      
      // Usar currentPath se disponível, senão usar a URL da loja
      const redirectUrl = currentPath || `/loja/${storeSlug}`
      
      // Salvar dados do checkout no localStorage para recuperar após login
      localStorage.setItem('checkout-data', JSON.stringify({
        sessionId,
        storeId,
        storeSlug,
        redirectUrl,
        checkoutData: {
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          notes: ''
        }
      }))
      
      // Redirecionar para login com a URL específica onde estava
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`)
      return
    }
    
    // Se estiver logado, abrir o modal para preencher telefone e notas
    setIsCheckoutModalOpen(true)
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-primary/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Carrinho ({totalItems})
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
        <div className="flex flex-col h-full">
          {isLoadingCart ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-text-dark border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Carregando carrinho...</p>
              </div>
            </div>
          ) : !hasItems ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Carrinho vazio
                </h3>
                <p className="text-gray-600 mb-4">
                  Adicione alguns produtos ao seu carrinho
                </p>
                <Button onClick={onClose} variant="outline">
                  Continuar comprando
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="border border-gray-200 relative">
                    {/* Remove Button - X no canto superior direito */}
                    <Button
                      
                      variant="ghost"
                      className="absolute top-2 right-2 h-6 w-6 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 z-10"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isRemovingFromCart}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product.images && item.product.images.length > 0 ? (
                            <Image
                              src={buildImageUrl(item.product.images[0])}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <ShoppingBag className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Info - Left Side */}
                        <div className="flex-1 min-w-0 pr-8">
                          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2">
                            {item.product.name}
                          </h3>
                          
                          {/* Size and Color */}
                          <div className="flex gap-2 mb-3">
                            {item.size && (
                              <Badge variant="outline" className="text-xs px-2 py-1">
                                {item.size}
                              </Badge>
                            )}
                            {item.color && (
                              <Badge variant="outline" className="text-xs px-2 py-1">
                                {item.color}
                              </Badge>
                            )}
                          </div>

                          {/* Price */}
                          <p className="text-lg font-bold text-gray-900 mb-3">
                            {formatPrice(item.subtotal)}
                          </p>
                        </div>

                        {/* Right Side - Quantity Controls */}
                        <div className="flex flex-col items-end justify-end">
                          {/* Unit Price */}
                          <p className="text-xs text-gray-500 mb-3">
                            {formatPrice(parseFloat(item.product.price))} cada
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={isUpdatingCartItem}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={isUpdatingCartItem}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 p-4 pb-24 space-y-4">
                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total:
                  </span>
                  <span className="text-xl font-bold text-text-dark">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button 
                    className="w-full h-12 text-lg font-medium"
                    onClick={handleCheckout}
                    disabled={isCheckoutLoading}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Finalizar Compra
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleClearCart}
                    disabled={isClearingCart}
                  >
                    {isClearingCart ? 'Limpando...' : 'Limpar Carrinho'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {sessionId && storeId && (
        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          sessionId={sessionId}
          storeId={storeId}
          storeSlug={storeSlug}
          totalPrice={totalPrice}
        />
      )}
    </>
  )
}
