import { useState, useEffect } from 'react'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'

export const PAYMENT_METHODS = [
  { id: 'pix', name: 'PIX', description: 'Pagamento instantâneo via PIX' },
  { id: 'credit_card', name: 'Cartão de Crédito', description: 'Visa, Mastercard, Elo' },
  { id: 'debit_card', name: 'Cartão de Débito', description: 'Débito em conta' },
  { id: 'boleto', name: 'Boleto Bancário', description: 'Pagamento via boleto' },
  { id: 'cash', name: 'Dinheiro', description: 'Pagamento em dinheiro' },
  { id: 'transfer', name: 'Transferência Bancária', description: 'Transferência via PIX ou TED' }
]

export function usePagamento() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  
  const [selectedMethods, setSelectedMethods] = useState<string[]>([])

  useEffect(() => {
    if ((store as any)?.payment_methods) {
      setSelectedMethods((store as any).payment_methods)
    }
  }, [store])

  const handleMethodToggle = (methodId: string) => {
    setSelectedMethods(prev => {
      const currentMethods = Array.isArray(prev) ? prev : []
      return currentMethods.includes(methodId)
        ? currentMethods.filter(id => id !== methodId)
        : [...currentMethods, methodId]
    })
  }

  const handleSave = async () => {
    if (!store?.id) return
    
    try {
      await updateStore({
        storeId: store.id,
        data: { payment_methods: selectedMethods }
      })
    } catch (error) {
      console.error('Erro ao atualizar métodos de pagamento:', error)
    }
  }

  return {
    store,
    isLoading,
    isUpdating,
    selectedMethods,
    handleMethodToggle,
    handleSave
  }
}

