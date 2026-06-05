import { useState, useEffect, useRef, useMemo } from 'react'
import * as yup from 'yup'
import isEqual from 'lodash/isEqual'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { useCountries } from '@/hooks/useCountries'
import { updateContatosSchema } from '@/schemas'

const initial = {
  whatsapp: '',
  instagram: '',
  facebook: '',
  email: ''
}

export function useContatos() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  const { data: countriesData, isLoading: countriesLoading } = useCountries()

  const [formData, setFormData] = useState(initial)
  const [server, setServer] = useState(initial)

  const [errors, setErrors] = useState<{
    whatsapp?: string
    instagram?: string
    facebook?: string
    email?: string
  }>({})

  const [selectedCountry, setSelectedCountry] = useState('BR')
  const [serverCountry, setServerCountry] = useState('BR')
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (store && countriesData) {
      const whatsapp = store.whatsapp || ''

      let whatsappNumber = whatsapp
      let countryCode = 'BR'

      if (whatsapp.startsWith('+')) {
        const foundCountry = countriesData?.find(country => {
          const callingCode = country.callingCodes[0]
          return whatsapp.startsWith(`+${callingCode}`)
        })

        if (foundCountry) {
          countryCode = foundCountry.cca2
          whatsappNumber = whatsapp.replace(`+${foundCountry.callingCodes[0]}`, '')
        } else if (whatsapp.startsWith('+55')) {
          countryCode = 'BR'
          whatsappNumber = whatsapp.replace('+55', '')
        }
      }

      const next = {
        whatsapp: whatsappNumber,
        instagram: store.instagram || '',
        facebook: store.facebook || '',
        email: store.email || ''
      }
      setSelectedCountry(countryCode)
      setServerCountry(countryCode)
      setFormData(next)
      setServer(next)
    }
  }, [store, countriesData])

  const handleInputChange = async (field: string, value: string) => {
    // Atualizar o estado primeiro
    setFormData(prev => {
      const updatedData = { ...prev, [field]: value }
      
      // Validar em tempo real usando Yup com os dados atualizados
      // Se for WhatsApp ou Email, valida o schema completo para capturar o erro de "pelo menos um contato"
      const shouldValidateFull = field === 'whatsapp' || field === 'email'
      
      const validationPromise = shouldValidateFull
        ? updateContatosSchema.validate(updatedData, { abortEarly: false })
        : updateContatosSchema.validateAt(field, updatedData, { abortEarly: false })
      
      validationPromise
        .then(() => {
          // Se passar na validação, remove os erros
          if (shouldValidateFull) {
            // Limpa erros de WhatsApp e Email quando valida o schema completo
            setErrors(prevErrors => ({
              ...prevErrors,
              whatsapp: undefined,
              email: undefined
            }))
          } else {
            setErrors(prevErrors => ({ ...prevErrors, [field]: undefined }))
          }
        })
        .catch((error) => {
          if (error instanceof yup.ValidationError) {
            if (shouldValidateFull) {
              // Mapeia todos os erros quando valida o schema completo
              const validationErrors: { [key: string]: string } = {}
              error.inner.forEach((err) => {
                if (err.path) {
                  validationErrors[err.path] = err.message
                }
              })
              setErrors(prevErrors => ({ ...prevErrors, ...validationErrors }))
            } else {
              setErrors(prevErrors => ({ ...prevErrors, [field]: error.message }))
            }
          }
        })
      
      return updatedData
    })
  }

  const getSelectedCountry = () => {
    return countriesData?.find(country => country.cca2 === selectedCountry)
  }

  const getCountryCallingCode = () => {
    const country = getSelectedCountry()
    const code = country?.callingCodes?.[0] || '55'
    return code.replace(/^\+/, '')
  }

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode)
    setShowCountryDropdown(false)
  }

  // País conta como dirty: trocar o DDI altera o whatsapp salvo
  const isDirty = useMemo(
    () => !isEqual(formData, server) || selectedCountry !== serverCountry,
    [formData, server, selectedCountry, serverCountry],
  )

  // Verificar se o formulário é válido (sem erros e campos obrigatórios preenchidos)
  const isFormValid = useMemo(() => {
    // Verifica se há algum erro no estado
    const hasErrors = Object.values(errors).some(error => error !== undefined && error !== '')
    if (hasErrors) return false

    // Verifica se pelo menos um campo de contato obrigatório está preenchido
    const whatsapp = formData.whatsapp?.trim() || ''
    const email = formData.email?.trim() || ''
    const hasRequiredContact = whatsapp !== '' || email !== ''
    if (!hasRequiredContact) return false

    // Valida todos os campos usando Yup de forma síncrona
    try {
      updateContatosSchema.validateSync(formData, { abortEarly: false })
      return true
    } catch (error) {
      // Se houver erro de validação, o formulário não é válido
      return false
    }
  }, [formData, errors])

  const handleSave = async () => {
    if (!store?.id) return
    
    try {
      // Validar todos os campos usando Yup
      await updateContatosSchema.validate(formData, { abortEarly: false })
      
      // Se passar na validação, limpa os erros
      setErrors({})
      
      const callingCode = getCountryCallingCode()
      
      let cleanWhatsapp = (formData.whatsapp || '').trim()
      cleanWhatsapp = cleanWhatsapp.replace(/\+/g, '')
      
      if (cleanWhatsapp.startsWith(callingCode)) {
        cleanWhatsapp = cleanWhatsapp.substring(callingCode.length)
      }
      
      cleanWhatsapp = cleanWhatsapp.replace(/\D/g, '')
      const whatsappWithCode = cleanWhatsapp ? `+${callingCode}${cleanWhatsapp}` : ''
      
      const updateData: {
        whatsapp?: string
        instagram?: string
        facebook?: string
        email?: string
      } = {
        whatsapp: whatsappWithCode || undefined
      }

      const instagramValue = formData.instagram.trim()
      if (instagramValue) {
        updateData.instagram = instagramValue
      }

      const facebookValue = formData.facebook.trim()
      if (facebookValue) {
        updateData.facebook = facebookValue
      }

      const emailValue = formData.email.trim()
      if (emailValue) {
        updateData.email = emailValue
      }

      await updateStore({
        storeId: store.id,
        data: updateData
      })
      setServer(formData)
      setServerCountry(selectedCountry)
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // Mapear erros do Yup para o estado de erros
        const validationErrors: { [key: string]: string } = {}
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message
          }
        })
        setErrors(validationErrors)
      } else {
        console.error('Erro ao atualizar contatos:', error)
      }
    }
  }

  const handleReset = () => {
    setFormData(server)
    setSelectedCountry(serverCountry)
    setErrors({})
  }

  return {
    store,
    isLoading,
    isUpdating,
    formData,
    errors,
    isDirty,
    isFormValid,
    selectedCountry,
    showCountryDropdown,
    dropdownRef,
    countriesData,
    countriesLoading,
    handleInputChange,
    getSelectedCountry,
    getCountryCallingCode,
    handleCountrySelect,
    setShowCountryDropdown,
    handleSave,
    handleReset
  }
}

