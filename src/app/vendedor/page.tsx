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
import ImageBg from '@/assets/images/image-home.svg'

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
      <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
        {/* Header Minimalista */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1 sm:mb-2">
            Olá, {hookData.user?.name}
          </h1>
          <p className="text-sm sm:text-lg font-medium text-gray-600">
            Gerencie sua loja e acompanhe suas vendas.
          </p>
        </div>

        {/* Imagem home */}
        <div className="mb-6 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden relative">

          <div className="relative w-auto h-[300px] lg:h-[700px]">
            <Image
              src={ImageBg}
              alt="Imagem home"
              fill
              className="object-contain"
            />
          </div>

        </div>

        {/* Informações da Loja */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          {/* Card Principal da Loja */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  {/* Logo da Loja */}
                  <div className="flex-shrink-0 relative group w-full sm:w-auto">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm mx-auto sm:mx-0">
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
                        <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>
                    </div>

                    {/* Botão de atualização do logo */}
                    <Button
                      variant="outline"
                      onClick={() => hookData.logoInputRef.current?.click()}
                      disabled={hookData.isUploadingLogo || hookData.isUpdating}
                      size="sm"
                      className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
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
                  <div className="flex-1 min-w-0 w-full sm:w-auto text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                      {hookData.store?.name}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                      {hookData.store?.description || 'Sem descrição'}
                    </p>

                    {/* Contatos */}
                    <div className="space-y-3 sm:space-y-4 hidden lg:flex">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900">Meios de Contato</h3>

                      {/* Lista de contatos */}
                      <div className="flex-wrap justify-center sm:justify-start gap-2 sm:gap-4">
                        {hookData.store?.whatsapp && (
                          <div
                            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs sm:text-sm"
                          >
                            <WhatsappIcon />
                            <span className="font-medium truncate max-w-[120px] sm:max-w-none">{hookData.store.whatsapp}</span>
                          </div >
                        )}
                        {hookData.store?.instagram && (
                          <div
                            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors text-xs sm:text-sm"
                          >
                            <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="font-medium truncate max-w-[120px] sm:max-w-none">{hookData.store.instagram}</span>
                          </div>
                        )}
                        {(hookData.store as any)?.facebook && (
                          <div
                            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm"
                          >
                            <Facebook className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="font-medium truncate max-w-[120px] sm:max-w-none">{(hookData.store as any).facebook}</span>
                          </div>
                        )}

                        {(hookData.store as any)?.email && (
                          <div
                            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-xs sm:text-sm"
                          >
                            <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="font-medium truncate max-w-[120px] sm:max-w-none">{(hookData.store as any).email}</span>
                          </div>
                        )}

                      </div>
                    </div>
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