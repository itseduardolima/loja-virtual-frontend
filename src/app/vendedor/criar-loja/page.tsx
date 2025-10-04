'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCreateStore, CreateStoreData } from '@/hooks/useCreateStore'
import { useNiches } from '@/hooks/useNiches'
import { useCountries } from '@/hooks/useCountries'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Textarea,  Checkbox, LoadingSpinner } from '@/components'
import { 
  Store, 
  ArrowLeft, 
  ArrowRight, 
  Check,
  Phone,
  Instagram,
  Facebook,
  Globe,
  Mail,
  MapPin,
  Clock,
  CreditCard,
  AlertCircle,
  ChevronDown
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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

export default function CriarLojaPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { createStore, isCreating } = useCreateStore()
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

  if (authLoading) {
    return <LoadingPage />
  }

  if (user?.profile !== 'Vendedor') {
    router.push('/login')
    return null
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

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-base font-semibold">
          Nome da Loja *
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Ex: Minha Loja de Roupas"
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-base font-semibold">
          Descrição da Loja
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Descreva sua loja e o que você vende..."
          className="mt-2"
          rows={3}
        />
      </div>

      <div>
        <Label className="text-base font-semibold">
          Nichos da Loja *
        </Label>
        <p className="text-sm text-gray-600 mt-1 mb-4">
          Selecione os nichos que melhor descrevem sua loja
        </p>
        {nichesLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="sm" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {nichesData?.data.map((niche: any) => (
              <div
                key={niche.id}
                onClick={() => handleNicheToggle(niche.id.toString())}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Checkbox
                  id={niche.id.toString()}
                  checked={formData.niche_ids.includes(niche.id.toString())}
                  onCheckedChange={() => handleNicheToggle(niche.id.toString())}
                />
                <div className="flex-1">
                  <label
                    htmlFor={niche.id.toString()}
                    className="block cursor-pointer"
                  >
                    <span className="font-medium text-gray-900">{niche.name}</span>
                    {niche.description && (
                      <p className="text-xs text-gray-500 mt-1">{niche.description}</p>
                    )}
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <Label className="text-base font-semibold">
          Logo da Loja
        </Label>
        <p className="text-sm text-gray-600 mt-1 mb-4">
          Adicione o logo da sua loja (opcional)
        </p>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange('logo', e.target.files?.[0] || null)}
            className="hidden"
            id="logo-upload"
          />
          <label
            htmlFor="logo-upload"
            className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
          >
            Escolher Logo
          </label>
          {logoPreview && (
            <div className="w-16 h-16 rounded-lg overflow-hidden border">
              <Image
                src={logoPreview}
                alt="Logo preview"
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="whatsapp" className="text-base font-semibold flex items-center gap-2">
            <Phone className="h-4 w-4" />
            WhatsApp
          </Label>
          <div className="flex gap-2 mt-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="flex items-center h-12 gap-2 px-3 py-2 border rounded-xl border-gray-300  bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <span className="text-lg hidden">{getSelectedCountry()?.flag || '🇧🇷'}</span>
                <span className="text-sm font-medium">{getCountryCallingCode()}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {showCountryDropdown && (
                <div ref={dropdownRef} className="absolute top-full left-0 z-10 w-64 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg mt-1">
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
                          selectedCountry === country.cca2 ? 'bg-blue-50 text-blue-700' : ''
                        }`}
                      >
                        <img 
                          src={country.flagUrl} 
                          alt={`Bandeira do ${country.name.common}`}
                          className="w-5 h-4 object-cover rounded-sm"
                          onError={(e) => {
                            // Fallback para emoji se a imagem não carregar
                            const target = e.currentTarget as HTMLImageElement
                            const nextElement = target.nextElementSibling as HTMLElement
                            target.style.display = 'none'
                            if (nextElement) nextElement.style.display = 'inline'
                          }}
                        />
                        <span className="text-lg hidden">{country.flag}</span>
                        <span className="flex-1 text-sm">{country.name.common}</span>
                        <span className="text-xs text-gray-500">{country.callingCodes[0]}</span>
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

        <div>
          <Label htmlFor="instagram" className="text-base font-semibold flex items-center gap-2">
            <Instagram className="h-4 w-4" />
            Instagram
          </Label>
          <Input
            id="instagram"
            value={formData.instagram}
            onChange={(e) => handleInputChange('instagram', e.target.value)}
            placeholder="@minhaloja"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="facebook" className="text-base font-semibold flex items-center gap-2">
            <Facebook className="h-4 w-4" />
            Facebook
          </Label>
          <Input
            id="facebook"
            value={formData.facebook}
            onChange={(e) => handleInputChange('facebook', e.target.value)}
            placeholder="minhaloja"
            className="mt-2"
          />
        </div>


        <div>
          <Label htmlFor="email" className="text-base font-semibold flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="contato@minhaloja.com.br"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-base font-semibold flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Telefone
          </Label>
          <div className="flex gap-2 mt-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="flex items-center h-12  gap-2 px-3 py-2 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <span className="text-lg hidden">{getSelectedCountry()?.flag || '🇧🇷'}</span>
                <span className="text-sm font-medium">{getCountryCallingCode()}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="11999999999"
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800">Informações Opcionais</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Você pode preencher essas informações agora ou depois, através da edição da loja.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label htmlFor="address" className="text-base font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Endereço
          </Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Rua das Flores, 123"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="city" className="text-base font-semibold">
            Cidade
          </Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="São Paulo"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="state" className="text-base font-semibold">
            Estado (UF)
          </Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            placeholder="SP"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="zipcode" className="text-base font-semibold">
            CEP
          </Label>
          <Input
            id="zipcode"
            value={formData.zipcode}
            onChange={(e) => handleInputChange('zipcode', e.target.value)}
            placeholder="01234-567"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="neighborhood" className="text-base font-semibold">
            Bairro
          </Label>
          <Input
            id="neighborhood"
            value={formData.neighborhood}
            onChange={(e) => handleInputChange('neighborhood', e.target.value)}
            placeholder="Centro"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="number" className="text-base font-semibold">
            Número
          </Label>
          <Input
            id="number"
            value={formData.number}
            onChange={(e) => handleInputChange('number', e.target.value)}
            placeholder="123"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="complement" className="text-base font-semibold">
            Complemento
          </Label>
          <Input
            id="complement"
            value={formData.complement}
            onChange={(e) => handleInputChange('complement', e.target.value)}
            placeholder="Apto 45"
            className="mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="delivery_fee" className="text-base font-semibold">
            Taxa de Entrega (R$)
          </Label>
          <Input
            id="delivery_fee"
            type="text"
            value={formData.delivery_fee}
            onChange={(e) => handleInputChange('delivery_fee', e.target.value)}
            placeholder="5.50"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="free_delivery_min" className="text-base font-semibold">
            Valor Mínimo para Entrega Grátis (R$)
          </Label>
          <Input
            id="free_delivery_min"
            type="text"
            value={formData.free_delivery_min}
            onChange={(e) => handleInputChange('free_delivery_min', e.target.value)}
            placeholder="50.00"
            className="mt-2"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="delivery_time" className="text-base font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Tempo de Entrega
          </Label>
          <Input
            id="delivery_time"
            value={formData.delivery_time}
            onChange={(e) => handleInputChange('delivery_time', e.target.value)}
            placeholder="2-3 dias úteis"
            className="mt-2"
          />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800">Informações Opcionais</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Você pode preencher essas informações agora ou depois, através da edição da loja.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Métodos de Pagamento
        </Label>
        <p className="text-sm text-gray-600 mt-1 mb-4">
          Selecione os métodos de pagamento que você aceita
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PAYMENT_METHODS.map((method) => (
            <div
              key={method}
              onClick={() => handlePaymentMethodToggle(method)}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Checkbox
                id={method}
                checked={formData.payment_methods?.includes(method) || false}
                onCheckedChange={() => handlePaymentMethodToggle(method)}
              />
              <div className="flex-1">
                <label
                  htmlFor={method}
                  className="block cursor-pointer"
                >
                  <span className="font-medium text-gray-900">{method}</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base font-semibold">
          Banner da Loja
        </Label>
        <p className="text-sm text-gray-600 mt-1 mb-4">
          Adicione um banner para sua loja (opcional)
        </p>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange('banner', e.target.files?.[0] || null)}
            className="hidden"
            id="banner-upload"
          />
          <label
            htmlFor="banner-upload"
            className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
          >
            Escolher Banner
          </label>
          {bannerPreview && (
            <div className="w-32 h-16 rounded-lg overflow-hidden border">
              <Image
                src={bannerPreview}
                alt="Banner preview"
                width={128}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800">Informações Opcionais</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Você pode preencher essas informações agora ou depois, através da edição da loja.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1()
      case 2:
        return renderStep2()
      case 3:
        return renderStep3()
      case 4:
        return renderStep4()
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-20 via-blue-20 to-indigo-20">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
         
          <div>
            <h1 className="text-3xl font-bold">Criar Nova Loja</h1>
            <p className="text-gray-600 mt-1">
              Configure sua loja online em poucos passos
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step.id
                      ? 'border border-blue-400 bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`text-sm font-semibold ${
                      currentStep >= step.id ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              
              {STEPS[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>

          {currentStep < STEPS.length ? (
            <Button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="flex items-center gap-2"
            >
              Próximo
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid() || isCreating}
              className="flex items-center gap-2"
            >
              {isCreating ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {isCreating ? 'Criando Loja...' : 'Criar Loja'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
