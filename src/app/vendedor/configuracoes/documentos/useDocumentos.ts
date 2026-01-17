import { useState, useEffect } from 'react'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { formatCNPJ, formatCPF } from '@/lib/utils'

export function useDocumentos() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  
  const [formData, setFormData] = useState({
    cnpj: '',
    cpf: ''
  })

  useEffect(() => {
    if (store) {
      setFormData({
        cnpj: (store as any)?.cnpj || '',
        cpf: (store as any)?.cpf || ''
      })
    }
  }, [store])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value)
    handleInputChange('cnpj', formatted)
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    handleInputChange('cpf', formatted)
  }

  const handleSave = async () => {
    if (!store?.id) return
    
    try {
      await updateStore({
        storeId: store.id,
        data: formData
      })
    } catch (error) {
      console.error('Erro ao atualizar documentos:', error)
    }
  }

  return {
    store,
    isLoading,
    isUpdating,
    formData,
    handleCNPJChange,
    handleCPFChange,
    handleSave
  }
}

