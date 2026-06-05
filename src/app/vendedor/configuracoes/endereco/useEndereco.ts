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

  const [isFetchingCep, setIsFetchingCep] = useState(false)
  const [cepError, setCepError] = useState('')

  useEffect(() => {
    if (store) {
      setFormData({
        address: store.address || '',
        city: store.city || '',
        state: store.state || '',
        zipcode: store.zipcode || '',
        neighborhood: store.neighborhood || '',
        number: store.number || '',
        complement: store.complement || ''
      })
    }
  }, [store])

  const handleZipcodeChange = async (value: string) => {
    const formatted = value.replace(/\D/g, '').slice(0, 8)
    const display = formatted.length > 5
      ? `${formatted.slice(0, 5)}-${formatted.slice(5)}`
      : formatted

    setFormData(prev => ({ ...prev, zipcode: display }))
    setCepError('')

    if (formatted.length === 8) {
      setIsFetchingCep(true)
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 5000)
      try {
        const res = await fetch(`https://viacep.com.br/ws/${formatted}/json/`, { signal: controller.signal })
        clearTimeout(timer)
        if (!res.ok) throw new Error('CEP inválido')
        const data = await res.json()
        if (data.erro) {
          setCepError('CEP não encontrado')
        } else {
          setFormData(prev => ({
            ...prev,
            zipcode: display,
            address: data.logradouro || prev.address,
            neighborhood: data.bairro || prev.neighborhood,
            city: data.localidade || prev.city,
            state: data.uf || prev.state,
          }))
        }
      } catch (err) {
        clearTimeout(timer)
        const isAbort = err instanceof Error && err.name === 'AbortError'
        setCepError(isAbort ? 'Tempo limite de consulta excedido' : 'Erro ao consultar o CEP')
      } finally {
        setIsFetchingCep(false)
      }
    }
  }

  const handleInputChange = (field: string, value: string) => {
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
    isFetchingCep,
    cepError,
    handleZipcodeChange,
    handleInputChange,
    handleSave
  }
}

