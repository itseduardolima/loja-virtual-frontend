import { useState, useEffect, useMemo } from 'react'
import * as yup from 'yup'
import isEqual from 'lodash/isEqual'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { updateInformacoesBasicasSchema } from '@/schemas'
import type { UpdateStoreData } from '@/types'

const initial = { name: '', description: '' }

export function useInformacoesBasicas() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()

  const [formData, setFormData] = useState(initial)
  const [server, setServer] = useState(initial)

  const [errors, setErrors] = useState<{
    name?: string
    description?: string
  }>({})

  useEffect(() => {
    if (store) {
      const next = {
        name: store.name || '',
        description: store.description || '',
      }
      setFormData(next)
      setServer(next)
    }
  }, [store])

  const handleInputChange = async (field: string, value: string) => {
    setFormData(prev => {
      const updatedData = { ...prev, [field]: value }

      updateInformacoesBasicasSchema.validateAt(field, updatedData, { abortEarly: false })
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

  const isDirty = useMemo(() => !isEqual(formData, server), [formData, server])

  const isFormValid = useMemo(() => {
    const hasErrors = Object.values(errors).some(error => error !== undefined && error !== '')
    if (hasErrors) return false

    try {
      updateInformacoesBasicasSchema.validateSync(formData, { abortEarly: false })
      return true
    } catch {
      return false
    }
  }, [formData, errors])

  const handleReset = () => {
    setFormData(server)
    setErrors({})
  }

  const handleSave = async () => {
    if (!store?.id) return

    try {
      await updateInformacoesBasicasSchema.validate(formData, { abortEarly: false })
      setErrors({})

      const updateData: Partial<UpdateStoreData> = {
        name: formData.name,
        description: formData.description || undefined,
      }

      await updateStore({
        storeId: store.id,
        data: updateData,
      })
      setServer(formData)
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
        console.error('Erro ao atualizar informações básicas:', error)
      }
    }
  }

  return {
    store,
    isLoading,
    isUpdating,
    formData,
    errors,
    isDirty,
    isFormValid,
    handleInputChange,
    handleSave,
    handleReset,
  }
}
