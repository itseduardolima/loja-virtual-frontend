'use client'

import { useState, useRef, useMemo } from 'react'
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
  createStoreSchema,
} from '@/schemas'

const STEPS = [
  { id: 1, title: 'Informações Básicas', description: 'Nome e identidade visual' },
  { id: 2, title: 'Nicho', description: 'Categoria da sua loja' },
  { id: 3, title: 'Contato', description: 'WhatsApp e e-mail' },
]

const schemaByStep = [createStoreStep1Schema, createStoreStep2Schema, createStoreStep3Schema]

const emptyForm: CreateStoreData = {
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
  business_hours: {},
}

export function useCreateStorePage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { createStore, isCreating, isSuccess: justCreated } = useCreateStore()
  const { data: store, isLoading: storeLoading } = useStore()
  const { data: nichesData, isLoading: nichesLoading } = useAllNiches()
  const { data: countriesData, isLoading: countriesLoading } = useCountries()

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CreateStoreData>(emptyForm)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState('BR')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [stepErrors, setStepErrors] = useState<[
    Record<string, string>,
    Record<string, string>,
    Record<string, string>,
  ]>([{}, {}, {}])

  const loading = authLoading || storeLoading

  const currentErrors = stepErrors[currentStep - 1]

  const isStepValid = useMemo(() => {
    if (Object.keys(currentErrors).length > 0) return false
    try {
      schemaByStep[currentStep - 1].validateSync(formData, { abortEarly: false })
      return true
    } catch {
      return false
    }
  }, [currentStep, formData, currentErrors])

  const earlyReturn = (loading: boolean, hasStore: boolean, store?: any) => ({
    loading,
    hasStore,
    store,
    user,
    router,
    currentStep: 1 as const,
    formData,
    logoPreview,
    bannerPreview,
    selectedCountry,
    setSelectedCountry,
    dropdownRef,
    nichesData,
    nichesLoading,
    countriesData,
    countriesLoading,
    isCreating,
    STEPS,
    stepErrors,
    handleInputChange: () => {},
    handleFileChange: () => {},
    handleNicheToggle: () => {},
    nextStep: () => {},
    prevStep: () => {},
    handleSubmit: () => {},
    isStepValid: false,
  })

  // Enquanto a criação acabou de acontecer, mantém loading state.
  // Evita flash de "Você já possui uma loja" entre a invalidação do cache e o router.push.
  if (loading || (justCreated && isCreating === false)) return earlyReturn(true, false)

  if (user?.profile !== 'Vendedor') {
    router.push('/login')
    return earlyReturn(true, false)
  }

  // Se já tem loja MAS não foi criada agora (vindo de outra sessão), mostra a tela "já tem loja"
  if (store && !justCreated) return earlyReturn(false, true, store)

  const setErrors = (step: number, errors: Record<string, string>) => {
    setStepErrors(prev => {
      const next = [...prev] as typeof prev
      next[step - 1] = errors
      return next
    })
  }

  const clearFieldError = (step: number, field: string) => {
    setStepErrors(prev => {
      const next = [...prev] as typeof prev
      const updated = { ...next[step - 1] }
      delete updated[field]
      next[step - 1] = updated
      return next
    })
  }

  const handleInputChange = (field: keyof CreateStoreData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      const schema = schemaByStep[currentStep - 1]
      schema.validateAt(field as string, updated, { abortEarly: false })
        .then(() => clearFieldError(currentStep, field as string))
        .catch((err: yup.ValidationError) => {
          const msg = err.inner.find(e => e.path === field)?.message || err.message
          setStepErrors(prev => {
            const next = [...prev] as typeof prev
            next[currentStep - 1] = { ...next[currentStep - 1], [field as string]: msg }
            return next
          })
        })
      return updated
    })
  }

  const handleFileChange = (field: 'logo' | 'banner', file: File | null) => {
    if (!file) return
    setFormData(prev => ({ ...prev, [field]: file }))
    const reader = new FileReader()
    reader.onload = (e) => {
      if (field === 'logo') setLogoPreview(e.target?.result as string)
      else setBannerPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleNicheToggle = (nicheId: string) => {
    setFormData(prev => {
      const updated = prev.niche_ids.includes(nicheId)
        ? prev.niche_ids.filter(id => id !== nicheId)
        : [...prev.niche_ids, nicheId]
      const updatedData = { ...prev, niche_ids: updated }
      createStoreStep2Schema.validateAt('niche_ids', updatedData)
        .then(() => clearFieldError(2, 'niche_ids'))
        .catch((err: yup.ValidationError) => {
          const msg = err.inner.find(e => e.path === 'niche_ids')?.message || err.message
          setStepErrors(prev => {
            const next = [...prev] as typeof prev
            next[1] = { ...next[1], niche_ids: msg }
            return next
          })
        })
      return updatedData
    })
  }

  const getCountryCallingCode = () => {
    const country = countriesData?.find((c: any) => c.cca2 === selectedCountry)
    return country?.callingCodes?.[0] || '55'
  }

  const nextStep = async () => {
    const schema = schemaByStep[currentStep - 1]
    try {
      await schema.validate(formData, { abortEarly: false })
      setErrors(currentStep, {})
      setCurrentStep(s => s + 1)
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const errs: Record<string, string> = {}
        error.inner.forEach(e => { if (e.path) errs[e.path] = e.message })
        setErrors(currentStep, errs)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1)
  }

  const handleSubmit = async () => {
    try {
      await createStoreSchema.validate(formData, { abortEarly: false })
      setStepErrors([{}, {}, {}])
      const callingCode = getCountryCallingCode()
      await createStore({
        ...formData,
        whatsapp: formData.whatsapp ? `${callingCode}${formData.whatsapp}` : formData.whatsapp,
      })
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const byStep: [Record<string, string>, Record<string, string>, Record<string, string>] = [{}, {}, {}]
        const fieldToStep: Record<string, number> = {
          name: 0, description: 0,
          niche_ids: 1,
          whatsapp: 2, email: 2, instagram: 2, facebook: 2,
        }
        error.inner.forEach(e => {
          if (!e.path) return
          const idx = fieldToStep[e.path] ?? 2
          byStep[idx][e.path] = e.message
        })
        setStepErrors(byStep)
        const firstWithError = byStep.findIndex(s => Object.keys(s).length > 0)
        if (firstWithError >= 0) setCurrentStep(firstWithError + 1)
      }
    }
  }

  return {
    loading: false,
    hasStore: false,
    store: undefined as any,
    user,
    router,
    currentStep,
    formData,
    logoPreview,
    bannerPreview,
    selectedCountry,
    setSelectedCountry,
    dropdownRef,
    nichesData,
    nichesLoading,
    countriesData,
    countriesLoading,
    isCreating,
    STEPS,
    stepErrors,
    handleInputChange,
    handleFileChange,
    handleNicheToggle,
    nextStep,
    prevStep,
    handleSubmit,
    isStepValid,
  }
}
