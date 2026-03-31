'use client'

import { useInformacoesBasicas } from './useInformacoesBasicas'
import { Card, CardContent, Input, Label, Button, LoadingSpinner, Textarea, Checkbox } from '@/components'
import LoadingPage from '@/components/Layout/LoadingPage'
import Image from 'next/image'
import { Upload } from 'lucide-react'

export default function InformacoesBasicasPage() {
  const {
    isLoading,
    isUpdating,
    formData,
    errors,
    isFormValid,
    logoPreview,
    bannerPreview,
    nichesData,
    nichesLoading,
    handleInputChange,
    handleFileChange,
    handleNicheToggle,
    handleSave
  } = useInformacoesBasicas()

  if (isLoading) {
    return <LoadingPage />
  }
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Informações Básicas</h1>
        <p className="text-gray-600">
          Configure o nome, descrição, imagens e nichos da sua loja
        </p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Nome da Loja */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nome da Loja *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Digite o nome da loja"
                className={`mt-2 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Descrição */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Descrição da Loja
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descreva sua loja..."
                className={`mt-2 min-h-[100px] ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                maxLength={170}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">
                  {formData.description.length}/170 caracteres
                </p>
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>

            {/* Logo e Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Logo */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Logo da Loja
                </Label>
                <div className="mt-2 space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('logo', e.target.files?.[0] || null)}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Clique para fazer upload</span>
                  </label>
                  {logoPreview && (
                    <div className="w-52 h-52 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={logoPreview.startsWith('data:') || logoPreview.startsWith('http') ? logoPreview : `${API_URL}${logoPreview}`}
                        alt="Logo preview"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Banner */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Banner da Loja
                </Label>
                <div className="mt-2 space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('banner', e.target.files?.[0] || null)}
                    className="hidden"
                    id="banner-upload"
                  />
                  <label
                    htmlFor="banner-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Clique para fazer upload</span>
                  </label>
                  {bannerPreview && (
                    <div className="w-full h-52 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={bannerPreview.startsWith('data:') || bannerPreview.startsWith('http') ? bannerPreview : `${API_URL}${bannerPreview}`}
                        alt="Banner preview"
                        width={400}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Nichos */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-4 block">
                Nichos da Loja *
              </Label>
              <p className="text-sm text-gray-600 mb-4">
                Selecione os nichos que melhor descrevem sua loja
              </p>
              {nichesLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="sm" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {nichesData?.data?.map((niche: any) => (
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
                            <span className="font-medium text-gray-900">
                              {niche.name}
                            </span>
                            {niche.description && (
                              <p className="text-xs text-gray-500 mt-1">
                                {niche.description}
                              </p>
                            )}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.niche_ids && (
                    <p className="mt-2 text-sm text-red-600">{errors.niche_ids}</p>
                  )}
                </>
              )}
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
