'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useCreateStore, CreateStoreData } from '@/hooks/useCreateStore'
import { useStore } from '@/hooks/useStore'
import { useNiches } from '@/hooks/useNiches'
import { useCountries } from '@/hooks/useCountries'
import LoadingPage from '@/components/LoadingPage'

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
  const { data: nichesData, isLoading: nichesLoading } = useNiches()
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
      isStepValid: () => false,
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
      isStepValid: () => false,
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
      isStepValid: () => false,
      renderStep1: () => null,
      renderStep2: () => null,
      renderStep3: () => null,
      renderStep4: () => null,
      renderCurrentStep: () => null
    }
  }

  const handleInputChange = (field: keyof CreateStoreData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
    setFormData(prev => ({
      ...prev,
      niche_ids: prev.niche_ids.includes(nicheId)
        ? prev.niche_ids.filter(id => id !== nicheId)
        : [...prev.niche_ids, nicheId]
    }))
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

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      const callingCode = getCountryCallingCode()
      const dataToSend = {
        ...formData,
        whatsapp: formData.whatsapp ? `${callingCode}${formData.whatsapp}` : formData.whatsapp,
        phone: formData.phone ? `${callingCode}${formData.phone}` : formData.phone
      }
      await createStore(dataToSend)
    } catch (error) {
      console.error('Erro ao criar loja:', error)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.niche_ids.length > 0
      case 2:
        return true // Contato é opcional
      case 3:
        return true // Endereço é opcional
      case 4:
        return true // Configurações são opcionais
      default:
        return false
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
