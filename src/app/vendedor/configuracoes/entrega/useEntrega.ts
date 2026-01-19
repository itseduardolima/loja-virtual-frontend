import { useState, useEffect, useMemo } from 'react'
import * as yup from 'yup'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { updateEntregaSchema } from '@/schemas'

export function useEntrega() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  
  const [formData, setFormData] = useState({
    delivery_fee: '',
    free_delivery_min: '',
    delivery_time: ''
  })

  const [errors, setErrors] = useState<{
    delivery_fee?: string
    free_delivery_min?: string
    delivery_time?: string
  }>({})

  useEffect(() => {
    if (store) {
      setFormData({
        delivery_fee: (store as any)?.delivery_fee || '',
        free_delivery_min: (store as any)?.free_delivery_min || '',
        delivery_time: (store as any)?.delivery_time || ''
      })
    }
  }, [store])

  const handleInputChange = async (field: string, value: string | number) => {
    setFormData(prev => {
      const updatedData = { ...prev, [field]: value }
      
      // Converter para número se necessário para validação
      const dataForValidation = {
        ...updatedData,
        delivery_fee: updatedData.delivery_fee ? parseFloat(updatedData.delivery_fee.toString()) : undefined,
        free_delivery_min: updatedData.free_delivery_min ? parseFloat(updatedData.free_delivery_min.toString()) : undefined
      }
      
      updateEntregaSchema.validateAt(field, dataForValidation, { abortEarly: false })
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
      const dataForValidation = {
        delivery_fee: formData.delivery_fee ? parseFloat(formData.delivery_fee.toString()) : undefined,
        free_delivery_min: formData.free_delivery_min ? parseFloat(formData.free_delivery_min.toString()) : undefined,
        delivery_time: formData.delivery_time
      }
      updateEntregaSchema.validateSync(dataForValidation, { abortEarly: false })
      return true
    } catch {
      return false
    }
  }, [formData, errors])

  const handleSave = async () => {
    if (!store?.id) return
    
    try {
      const dataForValidation = {
        delivery_fee: formData.delivery_fee ? parseFloat(formData.delivery_fee.toString()) : undefined,
        free_delivery_min: formData.free_delivery_min ? parseFloat(formData.free_delivery_min.toString()) : undefined,
        delivery_time: formData.delivery_time.trim() || undefined
      }
      
      await updateEntregaSchema.validate(dataForValidation, { abortEarly: false })
      setErrors({})
      
      await updateStore({
        storeId: store.id,
        data: {
          delivery_fee: dataForValidation.delivery_fee,
          free_delivery_min: dataForValidation.free_delivery_min,
          delivery_time: dataForValidation.delivery_time
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
        console.error('Erro ao atualizar configurações de entrega:', error)
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

