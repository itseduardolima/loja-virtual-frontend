'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import * as yup from 'yup'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useCreateStore, CreateStoreData } from '@/hooks/useCreateStore'
import { useStore } from '@/hooks/useStore'
import { useAllNiches } from '@/hooks/useNiches'
import { useCountries } from '@/hooks/useCountries'
import {
  createStoreStep1Schema,
  createStoreStep2Schema,
  createStoreStep3Schema,
  createStoreStep4Schema,
  createStoreSchema
} from '@/schemas'

const STEPS = [
  { id: 1, title: 'Informações Básicas', description: 'Nome, descrição e nicho' },
  { id: 2, title: 'Contato', description: 'WhatsApp e redes sociais' },
  { id: 3, title: 'Endereço', description: 'Localização e entrega' },
  { id: 4, title: 'Configurações', description: 'Pagamento e horários' }
]

const PAYMENT_METHODS = [
  'PIX',
  'Cartão de Crédito',
  'Cartão de Débito',
  'Boleto',
  'Dinheiro',
  'Transferência Bancária'
]

export function useCreateStorePage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { createStore, isCreating } = useCreateStore()
  const { data: store, isLoading: storeLoading } = useStore()
  const { data: nichesData, isLoading: nichesLoading } = useAllNiches()
  const { data: countriesData, isLoading: countriesLoading } = useCountries()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CreateStoreData>({
    name: '',
    description: '',
    niche_ids: [],
    primary_niche_id: undefined,
    logo: undefined,
    banner: undefined,
    whatsapp: '',
    instagram: '',
    facebook: '',
    website: '',
    email: '',
    phone: '',
    cnpj: '',
    cpf: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    neighborhood: '',
    number: '',
    complement: '',
    delivery_fee: '',
    free_delivery_min: '',
    delivery_time: '',
    payment_methods: [],
    business_hours: {}
  })

  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState('BR') // Brasil como padrão
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Estados de erros por step
  const [step1Errors, setStep1Errors] = useState<{ [key: string]: string }>({})
  const [step2Errors, setStep2Errors] = useState<{ [key: string]: string }>({})
  const [step3Errors, setStep3Errors] = useState<{ [key: string]: string }>({})
  const [step4Errors, setStep4Errors] = useState<{ [key: string]: string }>({})

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

  // Verificar se o step atual é válido (sempre chamado antes de qualquer return)
  const isStepValid = useMemo(() => {
    const hasErrors = (() => {
      switch (currentStep) {
        case 1:
          return Object.keys(step1Errors).length > 0
        case 2:
          return Object.keys(step2Errors).length > 0
        case 3:
          return Object.keys(step3Errors).length > 0
        case 4:
          return Object.keys(step4Errors).length > 0
        default:
          return false
      }
    })()

    if (hasErrors) return false

    try {
      switch (currentStep) {
        case 1:
          createStoreStep1Schema.validateSync(formData, { abortEarly: false })
          return true
        case 2:
          createStoreStep2Schema.validateSync(formData, { abortEarly: false })
          return true
        case 3:
          createStoreStep3Schema.validateSync(formData, { abortEarly: false })
          return true
        case 4:
          createStoreStep4Schema.validateSync(formData, { abortEarly: false })
          return true
        default:
          return false
      }
    } catch {
      return false
    }
  }, [currentStep, formData, step1Errors, step2Errors, step3Errors, step4Errors])

  // Verificações de loading e autenticação
  if (authLoading) {
    return { 
      loading: true, 
      hasStore: false,
      user,
      router,
      // Campos opcionais para evitar erros de tipo
      currentStep: 1,
      formData,
      setFormData,
      logoPreview,
      setLogoPreview,
      bannerPreview,
      setBannerPreview,
      selectedCountry,
      setSelectedCountry,
      showCountryDropdown,
      setShowCountryDropdown,
      dropdownRef,
      nichesData,
      nichesLoading,
      countriesData,
      countriesLoading,
      isCreating,
      STEPS,
      PAYMENT_METHODS,
      handleInputChange: () => {},
      handleFileChange: () => {},
      handleNicheToggle: () => {},
      handlePaymentMethodToggle: () => {},
      getSelectedCountry: () => null,
      getCountryCallingCode: () => '55',
      handleCountrySelect: () => {},
      nextStep: () => {},
      prevStep: () => {},
      handleSubmit: () => {},
      isStepValid: false,
      step1Errors: {},
      step2Errors: {},
      step3Errors: {},
      step4Errors: {},
      renderStep1: () => null,
      renderStep2: () => null,
      renderStep3: () => null,
      renderStep4: () => null,
      renderCurrentStep: () => null
    }
  }

  if (user?.profile !== 'Vendedor') {
    router.push('/login')
    return { 
      loading: true, 
      hasStore: false,
      user,
      router,
      // Campos opcionais para evitar erros de tipo
      currentStep: 1,
      formData,
      setFormData,
      logoPreview,
      setLogoPreview,
      bannerPreview,
      setBannerPreview,
      selectedCountry,
      setSelectedCountry,
      showCountryDropdown,
      setShowCountryDropdown,
      dropdownRef,
      nichesData,
      nichesLoading,
      countriesData,
      countriesLoading,
      isCreating,
      STEPS,
      PAYMENT_METHODS,
      handleInputChange: () => {},
      handleFileChange: () => {},
      handleNicheToggle: () => {},
      handlePaymentMethodToggle: () => {},
      getSelectedCountry: () => null,
      getCountryCallingCode: () => '55',
      handleCountrySelect: () => {},
      nextStep: () => {},
      prevStep: () => {},
      handleSubmit: () => {},
      isStepValid: false,
      step1Errors: {},
      step2Errors: {},
      step3Errors: {},
      step4Errors: {},
      renderStep1: () => null,
      renderStep2: () => null,
      renderStep3: () => null,
      renderStep4: () => null,
      renderCurrentStep: () => null
    }
  }

  // Se o usuário já possui uma loja, mostrar mensagem
  if (store) {
    return {
      loading: false,
      hasStore: true,
      user,
      router,
      store,
      // Campos opcionais para evitar erros de tipo
      currentStep: 1,
      formData,
      setFormData,
      logoPreview,
      setLogoPreview,
      bannerPreview,
      setBannerPreview,
      selectedCountry,
      setSelectedCountry,
      showCountryDropdown,
      setShowCountryDropdown,
      dropdownRef,
      nichesData,
      nichesLoading,
      countriesData,
      countriesLoading,
      isCreating,
      STEPS,
      PAYMENT_METHODS,
      handleInputChange: () => {},
      handleFileChange: () => {},
      handleNicheToggle: () => {},
      handlePaymentMethodToggle: () => {},
      getSelectedCountry: () => null,
      getCountryCallingCode: () => '55',
      handleCountrySelect: () => {},
      nextStep: () => {},
      prevStep: () => {},
      handleSubmit: () => {},
      isStepValid: false,
      step1Errors: {},
      step2Errors: {},
      step3Errors: {},
      step4Errors: {},
      renderStep1: () => null,
      renderStep2: () => null,
      renderStep3: () => null,
      renderStep4: () => null,
      renderCurrentStep: () => null
    }
  }

  const handleInputChange = async (field: keyof CreateStoreData, value: any) => {
    setFormData(prev => {
      const updatedData = { ...prev, [field]: value }
      
      // Validar em tempo real baseado no step atual
      const validateField = async () => {
        try {
          let schema: yup.AnyObjectSchema
          let errorSetter: (errors: { [key: string]: string }) => void
          
          if (currentStep === 1) {
            schema = createStoreStep1Schema
            errorSetter = setStep1Errors
          } else if (currentStep === 2) {
            schema = createStoreStep2Schema
            errorSetter = setStep2Errors
          } else if (currentStep === 3) {
            schema = createStoreStep3Schema
            errorSetter = setStep3Errors
          } else if (currentStep === 4) {
            schema = createStoreStep4Schema
            errorSetter = setStep4Errors
          } else {
            return
          }
          
          await schema.validateAt(field, updatedData, { abortEarly: false })
          if (currentStep === 1) {
            setStep1Errors((prevErrors: { [key: string]: string }) => {
              const newErrors = { ...prevErrors }
              delete newErrors[field as string]
              return newErrors
            })
          } else if (currentStep === 2) {
            setStep2Errors((prevErrors: { [key: string]: string }) => {
              const newErrors = { ...prevErrors }
              delete newErrors[field as string]
              return newErrors
            })
          } else if (currentStep === 3) {
            setStep3Errors((prevErrors: { [key: string]: string }) => {
              const newErrors = { ...prevErrors }
              delete newErrors[field as string]
              return newErrors
            })
          } else if (currentStep === 4) {
            setStep4Errors((prevErrors: { [key: string]: string }) => {
              const newErrors = { ...prevErrors }
              delete newErrors[field as string]
              return newErrors
            })
          }
        } catch (error) {
          if (error instanceof yup.ValidationError) {
            const fieldError = error.inner.find(err => err.path === field)
            const errorMessage = fieldError?.message || error.message
            
            if (currentStep === 1) {
              setStep1Errors((prevErrors: { [key: string]: string }) => ({
                ...prevErrors,
                [field as string]: errorMessage
              }))
            } else if (currentStep === 2) {
              setStep2Errors((prevErrors: { [key: string]: string }) => ({
                ...prevErrors,
                [field as string]: errorMessage
              }))
            } else if (currentStep === 3) {
              setStep3Errors((prevErrors: { [key: string]: string }) => ({
                ...prevErrors,
                [field as string]: errorMessage
              }))
            } else if (currentStep === 4) {
              setStep4Errors((prevErrors: { [key: string]: string }) => ({
                ...prevErrors,
                [field as string]: errorMessage
              }))
            }
          }
        }
      }
      
      validateField()
      
      return updatedData
    })
  }

  const handleFileChange = (field: 'logo' | 'banner', file: File | null) => {
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }))
      
      const reader = new FileReader()
      reader.onload = (e) => {
        if (field === 'logo') {
          setLogoPreview(e.target?.result as string)
        } else {
          setBannerPreview(e.target?.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNicheToggle = (nicheId: string) => {
    setFormData(prev => {
      const updatedIds = prev.niche_ids.includes(nicheId)
        ? prev.niche_ids.filter(id => id !== nicheId)
        : [...prev.niche_ids, nicheId]
      
      const updatedData = {
        ...prev,
        niche_ids: updatedIds
      }
      
      // Validar nichos em tempo real
      createStoreStep1Schema.validateAt('niche_ids', updatedData, { abortEarly: false })
        .then(() => {
          setStep1Errors((prevErrors: { [key: string]: string }) => {
            const newErrors = { ...prevErrors }
            delete newErrors.niche_ids
            return newErrors
          })
        })
        .catch((error) => {
          if (error instanceof yup.ValidationError) {
            const fieldError = error.inner.find(err => err.path === 'niche_ids')
            const errorMessage = fieldError?.message || error.message
            setStep1Errors((prevErrors: { [key: string]: string }) => ({
              ...prevErrors,
              niche_ids: errorMessage
            }))
          }
        })
      
      return updatedData
    })
  }

  const handlePaymentMethodToggle = (method: string) => {
    setFormData(prev => ({
      ...prev,
      payment_methods: prev.payment_methods?.includes(method)
        ? prev.payment_methods.filter(m => m !== method)
        : [...(prev.payment_methods || []), method]
    }))
  }

  const getSelectedCountry = () => {
    return countriesData?.find(country => country.cca2 === selectedCountry)
  }

  const getCountryCallingCode = () => {
    const country = getSelectedCountry()
    return country?.callingCodes?.[0] || '55'
  }

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode)
    setShowCountryDropdown(false)
  }

  const nextStep = async () => {
    if (currentStep < STEPS.length) {
      // Validar o step atual antes de avançar
      let schema: yup.AnyObjectSchema
      let errorSetter: (errors: { [key: string]: string }) => void
      
      if (currentStep === 1) {
        schema = createStoreStep1Schema
        errorSetter = setStep1Errors
      } else if (currentStep === 2) {
        schema = createStoreStep2Schema
        errorSetter = setStep2Errors
      } else if (currentStep === 3) {
        schema = createStoreStep3Schema
        errorSetter = setStep3Errors
      } else if (currentStep === 4) {
        schema = createStoreStep4Schema
        errorSetter = setStep4Errors
      } else {
        return
      }
      
      try {
        await schema.validate(formData, { abortEarly: false })
        errorSetter({})
        setCurrentStep(currentStep + 1)
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          const validationErrors: { [key: string]: string } = {}
          error.inner.forEach((err) => {
            if (err.path) {
              validationErrors[err.path] = err.message
            }
          })
          errorSetter(validationErrors)
        }
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      // Validar todos os dados antes de enviar
      await createStoreSchema.validate(formData, { abortEarly: false })
      
      // Limpar todos os erros
      setStep1Errors({})
      setStep2Errors({})
      setStep3Errors({})
      setStep4Errors({})
      
      const callingCode = getCountryCallingCode()
      const dataToSend = {
        ...formData,
        whatsapp: formData.whatsapp ? `${callingCode}${formData.whatsapp}` : formData.whatsapp,
        phone: formData.phone ? `${callingCode}${formData.phone}` : formData.phone
      }
      await createStore(dataToSend)
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // Mapear erros para os steps corretos
        const step1Fields = ['name', 'description', 'niche_ids']
        const step2Fields = ['whatsapp', 'email', 'instagram', 'facebook', 'phone', 'website', 'cnpj', 'cpf']
        const step3Fields = ['address', 'city', 'state', 'zipcode', 'neighborhood', 'number', 'complement', 'delivery_fee', 'free_delivery_min', 'delivery_time']
        const step4Fields = ['payment_methods', 'business_hours']
        
        const step1Errs: { [key: string]: string } = {}
        const step2Errs: { [key: string]: string } = {}
        const step3Errs: { [key: string]: string } = {}
        const step4Errs: { [key: string]: string } = {}
        
        error.inner.forEach((err) => {
          if (err.path) {
            if (step1Fields.includes(err.path)) {
              step1Errs[err.path] = err.message
            } else if (step2Fields.includes(err.path)) {
              step2Errs[err.path] = err.message
            } else if (step3Fields.includes(err.path)) {
              step3Errs[err.path] = err.message
            } else if (step4Fields.includes(err.path)) {
              step4Errs[err.path] = err.message
            }
          }
        })
        
        setStep1Errors(step1Errs)
        setStep2Errors(step2Errs)
        setStep3Errors(step3Errs)
        setStep4Errors(step4Errs)
        
        // Ir para o primeiro step com erro
        if (Object.keys(step1Errs).length > 0) {
          setCurrentStep(1)
        } else if (Object.keys(step2Errs).length > 0) {
          setCurrentStep(2)
        } else if (Object.keys(step3Errs).length > 0) {
          setCurrentStep(3)
        } else if (Object.keys(step4Errs).length > 0) {
          setCurrentStep(4)
        }
      } else {
        console.error('Erro ao criar loja:', error)
      }
    }
  }

  // Retornar dados para tela com loja
  return {
    loading: false,
    hasStore: false,
    user,
    router,
    currentStep,
    formData,
    setFormData,
    logoPreview,
    setLogoPreview,
    bannerPreview,
    setBannerPreview,
    selectedCountry,
    setSelectedCountry,
    showCountryDropdown,
    setShowCountryDropdown,
    dropdownRef,
    nichesData,
    nichesLoading,
    countriesData,
    countriesLoading,
    isCreating,
    STEPS,
    PAYMENT_METHODS,
    step1Errors,
    step2Errors,
    step3Errors,
    step4Errors,
    handleInputChange,
    handleFileChange,
    handleNicheToggle,
    handlePaymentMethodToggle,
    getSelectedCountry,
    getCountryCallingCode,
    handleCountrySelect,
    nextStep,
    prevStep,
    handleSubmit,
    isStepValid
  }
}
