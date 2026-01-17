import { useState, useEffect } from 'react'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'

export function useEntrega() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  
  const [formData, setFormData] = useState({
    delivery_fee: '',
    free_delivery_min: '',
    delivery_time: ''
  })

  useEffect(() => {
    if (store) {
      setFormData({
        delivery_fee: (store as any)?.delivery_fee || '',
        free_delivery_min: (store as any)?.free_delivery_min || '',
        delivery_time: (store as any)?.delivery_time || ''
      })
    }
  }, [store])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!store?.id) return
    
    try {
      await updateStore({
        storeId: store.id,
        data: {
          delivery_fee: formData.delivery_fee ? parseFloat(formData.delivery_fee) : 0,
          free_delivery_min: formData.free_delivery_min ? parseFloat(formData.free_delivery_min) : 0,
          delivery_time: formData.delivery_time
        }
      })
    } catch (error) {
      console.error('Erro ao atualizar configurações de entrega:', error)
    }
  }

  return {
    store,
    isLoading,
    isUpdating,
    formData,
    handleInputChange,
    handleSave
  }
}

