'use client'

import { useContatos } from './useContatos'
import { Card, CardContent, Input, Label, Button, LoadingSpinner } from '@/components'
import LoadingPage from '@/components/Layout/LoadingPage'
import { Instagram, Facebook, Mail } from 'lucide-react'
import { WhatsappIcon } from '@/assets/icons/WhatsappIcon'
import { PhoneCountryInput } from '@/components/Form/PhoneCountryInput'

export default function ContatosPage() {
  const {
    isLoading,
    isUpdating,
    formData,
    errors,
    isFormValid,
    selectedCountry,
    countriesData,
    countriesLoading,
    handleInputChange,
    handleCountrySelect,
    handleSave
  } = useContatos()

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      {/* Header */}
      <div className="mb-3 sm:mb-4 md:mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1 sm:mb-2">Contatos e Redes Sociais</h1>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
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
                  <PhoneCountryInput
                    id="whatsapp"
                    value={formData.whatsapp}
                    onValueChange={(val) => handleInputChange('whatsapp', val)}
                    placeholder="11999999999"
                    selectedCountry={selectedCountry}
                    onSelectedCountryChange={handleCountrySelect}
                    countriesData={countriesData}
                    countriesLoading={countriesLoading}
                    inputClassName={`flex-1 ${errors.whatsapp ? 'border-red-500 focus:ring-red-500' : ''}`}
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
