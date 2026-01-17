import { useState, useEffect } from 'react'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'

export function useEndereco() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipcode: '',
    neighborhood: '',
    number: '',
    complement: ''
  })

  useEffect(() => {
    if (store) {
      setFormData({
        address: (store as any)?.address || '',
        city: (store as any)?.city || '',
        state: (store as any)?.state || '',
        zipcode: (store as any)?.zipcode || '',
        neighborhood: (store as any)?.neighborhood || '',
        number: (store as any)?.number || '',
        complement: (store as any)?.complement || ''
      })
    }
  }, [store])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!store?.id) return
    
    try {
      await updateStore({
        storeId: store.id,
        data: formData
      })
    } catch (error) {
      console.error('Erro ao atualizar endereço:', error)
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

