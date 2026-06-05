import { useState, useEffect, useMemo } from 'react'
import * as yup from 'yup'
import isEqual from 'lodash/isEqual'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { updatePagamentoSchema } from '@/schemas'
import type { StoreInfo } from '@/types/store'

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
  const [serverMethods, setServerMethods] = useState<string[]>([])
  const [errors, setErrors] = useState<{ payment_methods?: string }>({})

  useEffect(() => {
    const methods = (store as StoreInfo | undefined)?.payment_methods ?? []
    setSelectedMethods(methods)
    setServerMethods(methods)
  }, [store])

  const handleMethodToggle = (methodId: string) => {
    setSelectedMethods(prev => {
      const currentMethods = Array.isArray(prev) ? prev : []
      const updatedMethods = currentMethods.includes(methodId)
        ? currentMethods.filter(id => id !== methodId)
        : [...currentMethods, methodId]
      
      const dataForValidation = { payment_methods: updatedMethods }
      
      updatePagamentoSchema.validate(dataForValidation, { abortEarly: false })
        .then(() => {
          setErrors(prevErrors => ({ ...prevErrors, payment_methods: undefined }))
        })
        .catch((error) => {
          if (error instanceof yup.ValidationError) {
            const fieldError = error.inner.find(err => err.path === 'payment_methods')
            const errorMessage = fieldError?.message || error.message
            setErrors(prevErrors => ({ ...prevErrors, payment_methods: errorMessage }))
          }
        })
      
      return updatedMethods
    })
  }

  // Compara como conjunto: ordem de seleção não conta como alteração
  const isDirty = useMemo(
    () => !isEqual([...selectedMethods].sort(), [...serverMethods].sort()),
    [selectedMethods, serverMethods],
  )

  // Verificar se o formulário é válido
  const isFormValid = useMemo(() => {
    const hasErrors = Object.values(errors).some(error => error !== undefined && error !== '')
    if (hasErrors) return false

    try {
      updatePagamentoSchema.validateSync({ payment_methods: selectedMethods }, { abortEarly: false })
      return true
    } catch {
      return false
    }
  }, [selectedMethods, errors])

  const handleSave = async () => {
    if (!store?.id) return
    
    try {
      await updatePagamentoSchema.validate({ payment_methods: selectedMethods }, { abortEarly: false })
      setErrors({})
      
      await updateStore({
        storeId: store.id,
        data: { payment_methods: selectedMethods },
      })
      setServerMethods(selectedMethods)
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
        console.error('Erro ao atualizar métodos de pagamento:', error)
      }
    }
  }

  const handleReset = () => {
    setSelectedMethods(serverMethods)
    setErrors({})
  }

  return {
    store,
    isLoading,
    isUpdating,
    isDirty,
    selectedMethods,
    errors,
    isFormValid,
    handleMethodToggle,
    handleSave,
    handleReset,
  }
}

