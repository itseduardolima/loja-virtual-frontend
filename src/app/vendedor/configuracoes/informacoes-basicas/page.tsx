'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { useAllNiches } from '@/hooks/useNiches'
import { Card, CardContent, Input, Label, Button, LoadingSpinner, Textarea, Checkbox } from '@/components'
import LoadingPage from '@/components/Layout/LoadingPage'
import Image from 'next/image'
import { Store, Upload } from 'lucide-react'

export default function InformacoesBasicasPage() {
  const { data: store, isLoading } = useStore()
  const { updateStore, isUpdating } = useUpdateStore()
  const { data: nichesData, isLoading: nichesLoading } = useAllNiches()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    niche_ids: [] as string[]
  })

  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  useEffect(() => {
    if (store) {
      // Extrair nichos de store_niches
      const storeNiches = (store as any)?.store_niches || []
      const nicheIds = storeNiches.map((sn: any) => sn.niche_id.toString())

      setFormData({
        name: (store as any)?.name || '',
        description: (store as any)?.description || '',
        niche_ids: nicheIds
      })
      
      // Carregar previews das imagens existentes
      if ((store as any)?.logo) {
        setLogoPreview((store as any).logo)
      }
      if ((store as any)?.banner) {
        setBannerPreview((store as any).banner)
      }
    }
  }, [store])

  if (isLoading) {
    return <LoadingPage />
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (type: 'logo' | 'banner', file: File | null) => {
    if (file) {
      if (type === 'logo') {
        setLogoFile(file)
        const reader = new FileReader()
        reader.onload = (e) => setLogoPreview(e.target?.result as string)
        reader.readAsDataURL(file)
      } else {
        setBannerFile(file)
        const reader = new FileReader()
        reader.onload = (e) => setBannerPreview(e.target?.result as string)
        reader.readAsDataURL(file)
      }
    }
  }

  const handleNicheToggle = (nicheId: string) => {
    setFormData(prev => {
      const currentIds = prev.niche_ids || []
      const isSelected = currentIds.includes(nicheId)
      
      if (isSelected) {
        return { ...prev, niche_ids: currentIds.filter(id => id !== nicheId) }
      } else {
        return { ...prev, niche_ids: [...currentIds, nicheId] }
      }
    })
  }

  const handleSave = async () => {
    if (!store?.id) return
    
    try {
      const updateData: any = {
        name: formData.name,
        description: formData.description,
        niche_ids: formData.niche_ids
      }

      if (logoFile) {
        updateData.logo = logoFile
      }
      if (bannerFile) {
        updateData.banner = bannerFile
      }

      await updateStore({
        storeId: store.id,
        data: updateData
      })
    } catch (error) {
      console.error('Erro ao atualizar informações básicas:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
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
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nome que aparecerá na sua loja
              </p>
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
                className="mt-2 min-h-[100px]"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/500 caracteres
              </p>
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
                    <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={logoPreview}
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
                    <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={bannerPreview}
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
              )}
            </div>

            {/* Botão Salvar */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button
                onClick={handleSave}
                disabled={isUpdating || !formData.name || formData.niche_ids.length === 0}
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

