import { useState, useEffect, useRef } from 'react'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { useCountries } from '@/hooks/useCountries'

export function useContatos() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  const { data: countriesData, isLoading: countriesLoading } = useCountries()
  
  const [formData, setFormData] = useState({
    whatsapp: '',
    instagram: '',
    facebook: '',
    email: ''
  })

  const [selectedCountry, setSelectedCountry] = useState('BR')
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
      const whatsapp = (store as any)?.whatsapp || ''
      
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

      setSelectedCountry(countryCode)
      setFormData({
        whatsapp: whatsappNumber,
        instagram: (store as any)?.instagram || '',
        facebook: (store as any)?.facebook || '',
        email: (store as any)?.email || ''
      })
    }
  }, [store, countriesData])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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

  const handleSave = async () => {
    if (!store?.id) return
    
    try {
      const callingCode = getCountryCallingCode()
      
      let cleanWhatsapp = (formData.whatsapp || '').trim()
      cleanWhatsapp = cleanWhatsapp.replace(/\+/g, '')
      
      if (cleanWhatsapp.startsWith(callingCode)) {
        cleanWhatsapp = cleanWhatsapp.substring(callingCode.length)
      }
      
      cleanWhatsapp = cleanWhatsapp.replace(/\D/g, '')
      const whatsappWithCode = cleanWhatsapp ? `+${callingCode}${cleanWhatsapp}` : ''
      
      await updateStore({
        storeId: store.id,
        data: {
          whatsapp: whatsappWithCode,
          instagram: formData.instagram,
          facebook: formData.facebook,
          email: formData.email
        }
      })
    } catch (error) {
      console.error('Erro ao atualizar contatos:', error)
    }
  }

  return {
    store,
    isLoading,
    isUpdating,
    formData,
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
    handleSave
  }
}

