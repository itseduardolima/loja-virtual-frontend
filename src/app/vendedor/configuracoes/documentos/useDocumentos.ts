import { useState, useEffect, useMemo } from 'react'
import * as yup from 'yup'
import isEqual from 'lodash/isEqual'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { formatCNPJ, formatCPF } from '@/lib/utils'
import { updateDocumentosSchema } from '@/schemas'

const initial = { cnpj: '', cpf: '' }

export function useDocumentos() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()

  const [formData, setFormData] = useState(initial)
  const [server, setServer] = useState(initial)

  const [errors, setErrors] = useState<{
    cnpj?: string
    cpf?: string
  }>({})

  useEffect(() => {
    if (store) {
      // Normaliza com a mesma máscara do onChange p/ o dirty-check não acusar falso positivo
      const next = {
        cnpj: formatCNPJ(store.cnpj || ''),
        cpf: formatCPF(store.cpf || '')
      }
      setFormData(next)
      setServer(next)
    }
  }, [store])

  const handleInputChange = async (field: string, value: string) => {
    setFormData(prev => {
      const updatedData = { ...prev, [field]: value }
      
      updateDocumentosSchema.validateAt(field, updatedData, { abortEarly: false })
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

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value)
    handleInputChange('cnpj', formatted)
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    handleInputChange('cpf', formatted)
  }

  const isDirty = useMemo(() => !isEqual(formData, server), [formData, server])

  // Verificar se o formulário é válido
  const isFormValid = useMemo(() => {
    const hasErrors = Object.values(errors).some(error => error !== undefined && error !== '')
    if (hasErrors) return false

    try {
      updateDocumentosSchema.validateSync(formData, { abortEarly: false })
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
      await updateDocumentosSchema.validate(formData, { abortEarly: false })
      setErrors({})
      
      await updateStore({
        storeId: store.id,
        data: {
          cnpj: formData.cnpj.trim() || undefined,
          cpf: formData.cpf.trim() || undefined
        }
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
        console.error('Erro ao atualizar documentos:', error)
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
    handleCNPJChange,
    handleCPFChange,
    handleSave,
    handleReset
  }
}

