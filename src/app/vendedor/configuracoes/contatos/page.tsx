'use client'

import { useState, useEffect, useRef } from 'react'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { useCountries } from '@/hooks/useCountries'
import { Card, CardContent, Input, Label, Button, LoadingSpinner } from '@/components'
import LoadingPage from '@/components/Layout/LoadingPage'
import { Instagram, Facebook, Mail, MessageCircle, ChevronDown } from 'lucide-react'
import { WhatsappIcon } from '@/assets/icons/WhatsappIcon'

export default function ContatosPage() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  const { data: countriesData, isLoading: countriesLoading } = useCountries()
  
  const [formData, setFormData] = useState({
    whatsapp: '',
    instagram: '',
    facebook: '',
    email: ''
  })

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

  useEffect(() => {
    if (store) {
      const whatsapp = (store as any)?.whatsapp || ''
      
      // Extrair código do país do WhatsApp se existir
      let whatsappNumber = whatsapp
      let countryCode = 'BR'
      
      if (whatsapp.startsWith('+')) {
        // Tentar encontrar o país pelo código
        const foundCountry = countriesData?.find(country => {
          const callingCode = country.callingCodes[0]
          return whatsapp.startsWith(`+${callingCode}`)
        })
        
        if (foundCountry) {
          countryCode = foundCountry.cca2
          whatsappNumber = whatsapp.replace(`+${foundCountry.callingCodes[0]}`, '')
        } else if (whatsapp.startsWith('+55')) {
          // Brasil por padrão
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

  if (isLoading) {
    return <LoadingPage />
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getSelectedCountry = () => {
    return countriesData?.find(country => country.cca2 === selectedCountry)
  }

  const getCountryCallingCode = () => {
    const country = getSelectedCountry()
    const code = country?.callingCodes?.[0] || '55'
    // Garantir que retorna apenas o número, sem "+"
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
      
      // Remove qualquer "+" e código do país existente no número
      let cleanWhatsapp = (formData.whatsapp || '').trim()
      
      // Remove todos os "+" do número
      cleanWhatsapp = cleanWhatsapp.replace(/\+/g, '')
      
      // Remove o código do país se já estiver no início do número
      if (cleanWhatsapp.startsWith(callingCode)) {
        cleanWhatsapp = cleanWhatsapp.substring(callingCode.length)
      }
      
      // Remove qualquer caractere não numérico
      cleanWhatsapp = cleanWhatsapp.replace(/\D/g, '')
      
      // Só adiciona o código se houver número
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contatos e Redes Sociais</h1>
        <p className="text-gray-600">
          Configure os canais de contato e redes sociais da sua loja
        </p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-8">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* WhatsApp */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <WhatsappIcon />
                  <Label htmlFor="whatsapp" className="text-sm font-medium text-gray-700">
                    WhatsApp
                  </Label>
                </div>
                <div className="flex gap-2 mt-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center h-12 gap-2 px-3 py-2 border rounded-xl border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {getSelectedCountry()?.flagUrl ? (
                        <img
                          src={getSelectedCountry()?.flagUrl}
                          alt={`Bandeira do ${getSelectedCountry()?.name.common}`}
                          className="w-5 h-4 object-cover rounded-sm"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement
                            const nextElement = target.nextElementSibling as HTMLElement
                            target.style.display = 'none'
                            if (nextElement) nextElement.style.display = 'inline'
                          }}
                        />
                      ) : null}
                      <span className="text-lg hidden">
                        {getSelectedCountry()?.flag || '🇧🇷'}
                      </span>
                      <span className="text-sm font-medium">
                        {getCountryCallingCode()}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {showCountryDropdown && (
                      <div
                        ref={dropdownRef}
                        className="absolute top-full left-0 z-10 w-64 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg mt-1"
                      >
                        {countriesLoading ? (
                          <div className="p-4 text-center">
                            <LoadingSpinner size="sm" />
                          </div>
                        ) : (
                          countriesData?.map((country) => (
                            <button
                              key={country.cca2}
                              type="button"
                              onClick={() => handleCountrySelect(country.cca2)}
                              className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 ${
                                selectedCountry === country.cca2
                                  ? 'bg-primary/10 text-primary'
                                  : ''
                              }`}
                            >
                              <img
                                src={country.flagUrl}
                                alt={`Bandeira do ${country.name.common}`}
                                className="w-5 h-4 object-cover rounded-sm"
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement
                                  const nextElement = target.nextElementSibling as HTMLElement
                                  target.style.display = 'none'
                                  if (nextElement) nextElement.style.display = 'inline'
                                }}
                              />
                              <span className="text-lg hidden">{country.flag}</span>
                              <span className="flex-1 text-sm">
                                {country.name.common}
                              </span>
                              <span className="text-xs text-gray-500">
                                {country.callingCodes[0]}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    placeholder="11999999999"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </Label>
                </div>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="contato@minhaloja.com.br"
                  className="mt-2"
                />
              </div>

              {/* Instagram */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Instagram className="h-5 w-5 text-pink-600" />
                  <Label htmlFor="instagram" className="text-sm font-medium text-gray-700">
                    Instagram
                  </Label>
                </div>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                  placeholder="minhaloja"
                  className="mt-2"
                />
              </div>

              {/* Facebook */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <Label htmlFor="facebook" className="text-sm font-medium text-gray-700">
                    Facebook
                  </Label>
                </div>
                <Input
                  id="facebook"
                  value={formData.facebook}
                  onChange={(e) => handleInputChange('facebook', e.target.value)}
                  placeholder="minhaloja"
                  className="mt-2"
                />
              </div>
            </div>

            {/* Botão Salvar */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button
                onClick={handleSave}
                disabled={isUpdating}
                className="flex items-center gap-2"
              >
                {isUpdating ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  ""
                )}
                {isUpdating ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

