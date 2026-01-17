'use client'

import { useVendedorPage } from '@/app/vendedor/useVendedorPage'
import { Button, Card, CardContent } from '@/components'
import { 
  Phone, 
  Instagram,
  Image as ImageIcon,
  Camera,
  Upload,
  Facebook,
  Mail
} from 'lucide-react'
import Image from 'next/image'
import { buildImageUrl } from '@/lib/utils'
import LoadingPage from '@/components/Layout/LoadingPage'
import { WhatsappIcon } from '@/assets/icons/WhatsappIcon'

export default function VendedorPage() {
  const hookData = useVendedorPage()

  // Se está carregando, retornar componente de loading
  if (hookData.loading) {
    return <LoadingPage />
  }

  // Se não tem loja, mostrar loading (o redirecionamento será feito pelo useEffect)
  if (!hookData.hasStore) {
    return <LoadingPage />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Minimalista */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Olá, {hookData.user?.name}
          </h1>
          <p className="text-gray-600">
            Gerencie sua loja e acompanhe suas vendas
          </p>
        </div>

        {/* Banner da Loja */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg relative group">
          {hookData.store?.banner ? (
            <div className="relative min-h-[420px]">
              <Image
                src={buildImageUrl(hookData.store.banner)}
                alt="Banner da loja"
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
              {/* Overlay com botão de atualização */}
              <div className="absolute inset-0 bg-primary  transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-50">
                <Button
                  onClick={() => hookData.bannerInputRef.current?.click()}
                  disabled={hookData.isUploadingBanner || hookData.isUpdating}
                  className="bg-white text-primary hover:bg-gray-100"
                  size="sm"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  {hookData.isUploadingBanner ? 'Atualizando...' : 'Atualizar Banner'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="min-h-[420px] bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Nenhum banner definido</p>
                <Button
                  onClick={() => hookData.bannerInputRef.current?.click()}
                  disabled={hookData.isUploadingBanner || hookData.isUpdating}
                  variant="outline"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {hookData.isUploadingBanner ? 'Enviando...' : 'Adicionar Banner'}
                </Button>
              </div>
            </div>
          )}
          
          {/* Input oculto para upload do banner */}
          <input
            ref={hookData.bannerInputRef}
            type="file"
            accept="image/*"
            onChange={hookData.handleBannerUpload}
            className="hidden"
          />
        </div>

        {/* Informações da Loja */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Card Principal da Loja */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  {/* Logo da Loja */}
                  <div className="flex-shrink-0 relative group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm">
                      {hookData.store?.logo ? (
                        <Image
                          src={buildImageUrl(hookData.store.logo)}
                          alt={`Logo da ${hookData.store.name}`}
                          width={80}
                          height={80}
                          className="object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const nextElement = target.nextElementSibling as HTMLElement
                            if (nextElement) nextElement.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center ${hookData.store?.logo ? 'hidden' : 'flex'}`}>
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                    
                    {/* Botão de atualização do logo */}
                    <Button
                      variant="outline"
                      onClick={() => hookData.logoInputRef.current?.click()}
                      disabled={hookData.isUploadingLogo || hookData.isUpdating}
                      size="sm"
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                    
                    {/* Input oculto para upload do logo */}
                    <input
                      ref={hookData.logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={hookData.handleLogoUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Informações da Loja */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                      {hookData.store?.name}
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {hookData.store?.description || 'Sem descrição'}
                    </p>

                    {/* Contatos */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Meios de Contato</h3>

                      {/* Lista de contatos */}
                      <div className="flex flex-wrap gap-4">
                        {hookData.store?.whatsapp && (
                          <a
                            href={`https://wa.me/${hookData.store.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <WhatsappIcon />
                            
                            <span className="text-sm font-medium">{hookData.store.whatsapp}</span>
                          </a>
                        )}
                        {hookData.store?.instagram && (
                          <a
                            href={`https://instagram.com/${hookData.store.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors"
                          >
                            <Instagram className="w-4 h-4" />
                            <span className="text-sm font-medium">@{hookData.store.instagram}</span>
                          </a>
                        )}
                        {(hookData.store as any)?.facebook && (
                          <a
                            href={`https://facebook.com/${(hookData.store as any).facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Facebook className="w-4 h-4" />
                            <span className="text-sm font-medium">{(hookData.store as any).facebook}</span>
                          </a>
                        )}
                        
                        {(hookData.store as any)?.email && (
                          <a
                            href={`mailto:${(hookData.store as any).email}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                            <span className="text-sm font-medium">{(hookData.store as any).email}</span>
                          </a>
                        )}
                        {(hookData.store as any)?.phone && (
                          <a
                            href={`tel:${(hookData.store as any).phone}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                            <span className="text-sm font-medium">{(hookData.store as any).phone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card de Status */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status da Loja</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Ativa
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Produtos</span>
                    <span className="text-sm font-semibold text-gray-900">{hookData.store?._count?.products || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Pedidos</span>
                    <span className="text-sm font-semibold text-gray-900">{hookData.store?._count?.orders || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Categorias</span>
                    <span className="text-sm font-semibold text-gray-900">{hookData.store?.categories?.length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>


      </div>
    </div>
  )
}