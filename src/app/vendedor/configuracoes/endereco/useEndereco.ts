import { useState, useEffect, useMemo } from 'react'
import * as yup from 'yup'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { updateEnderecoSchema } from '@/schemas'

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

  const [errors, setErrors] = useState<{
    address?: string
    city?: string
    state?: string
    zipcode?: string
    neighborhood?: string
    number?: string
    complement?: string
  }>({})

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

  const handleInputChange = async (field: string, value: string) => {
    setFormData(prev => {
      const updatedData = { ...prev, [field]: value }
      
      updateEnderecoSchema.validateAt(field, updatedData, { abortEarly: false })
        .then(() => {
          setErrors(prevErrors => ({ ...prevErrors, [field]: undefined }))
        })
        .catch((error) => {
          if (error instanceof yup.ValidationError) {
            const fieldError = error.inner.find(err => err.path === field)
            const errorMessage = fieldError?.message || error.message
            setErrors(prevErrors => ({ ...prevErrors, [field]: errorMessage }))
          }
        })
      
      return updatedData
    })
  }

  // Verificar se o formulário é válido
  const isFormValid = useMemo(() => {
    const hasErrors = Object.values(errors).some(error => error !== undefined && error !== '')
    if (hasErrors) return false

    try {
      updateEnderecoSchema.validateSync(formData, { abortEarly: false })
      return true
    } catch {
      return false
    }
  }, [formData, errors])

  const handleSave = async () => {
    if (!store?.id) return
    
    try {
      await updateEnderecoSchema.validate(formData, { abortEarly: false })
      setErrors({})
      
      await updateStore({
        storeId: store.id,
        data: {
          address: formData.address.trim() || undefined,
          city: formData.city.trim() || undefined,
          state: formData.state.trim() || undefined,
          zipcode: formData.zipcode.trim() || undefined,
          neighborhood: formData.neighborhood.trim() || undefined,
          number: formData.number.trim() || undefined,
          complement: formData.complement.trim() || undefined
        }
      })
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors: { [key: string]: string } = {}
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message
          }
        })
        setErrors(validationErrors)
      } else {
        console.error('Erro ao atualizar endereço:', error)
      }
    }
  }

  return {
    store,
    isLoading,
    isUpdating,
    formData,
    errors,
    isFormValid,
    handleInputChange,
    handleSave
  }
}

