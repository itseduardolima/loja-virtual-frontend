'use client'

import { useContatos } from './useContatos'
import { Card, CardContent, Input, Label, Button, LoadingSpinner } from '@/components'
import LoadingPage from '@/components/Layout/LoadingPage'
import { Instagram, Facebook, Mail, ChevronDown } from 'lucide-react'
import { WhatsappIcon } from '@/assets/icons/WhatsappIcon'

export default function ContatosPage() {
  const {
    isLoading,
    isUpdating,
    formData,
    errors,
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
    handleSave
  } = useContatos()

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="max-w-7xl mx-auto">
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
                    className={`flex-1 ${errors.whatsapp ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                </div>
                {errors.whatsapp && (
                  <p className="mt-1 text-sm text-red-600">{errors.whatsapp}</p>
                )}
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
                  className={`mt-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Instagram */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Instagram className="h-5 w-5 text-pink-600" />
                  <Label htmlFor="instagram" className="text-sm font-medium text-gray-700">
                    Link do Instagram
                  </Label>
                </div>
                <Input
                  id="instagram"
                  type="url"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/minhaloja"
                  className={`mt-2 ${errors.instagram ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.instagram && (
                  <p className="mt-1 text-sm text-red-600">{errors.instagram}</p>
                )}
              </div>

              {/* Facebook */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <Label htmlFor="facebook" className="text-sm font-medium text-gray-700">
                    Link do Facebook
                  </Label>
                </div>
                <Input
                  id="facebook"
                  type="url"
                  value={formData.facebook}
                  onChange={(e) => handleInputChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/minhaloja"
                  className={`mt-2 ${errors.facebook ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.facebook && (
                  <p className="mt-1 text-sm text-red-600">{errors.facebook}</p>
                )}
              </div>
            </div>

            {/* Botão Salvar */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button
                onClick={handleSave}
                disabled={isUpdating || !isFormValid}
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
