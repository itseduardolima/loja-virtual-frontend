'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { buildImageUrl } from '@/lib/utils'
import { Instagram, Facebook} from 'lucide-react'
import { WhatsappIcon } from '@/assets/icons/WhatsappIcon'

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  pix: 'PIX',
  credit_card: 'Cartão de Crédito',
  debit_card: 'Cartão de Débito',
  boleto: 'Boleto',
  cash: 'Dinheiro',
  transfer: 'Transferência',
}

function StoreFooterContent({ slug }: { slug: string }) {
  const { storeInfo, loading } = useStoreInfo(slug)

  if (loading || !storeInfo) {
    return (
      <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-20 bg-gray-100 rounded animate-pulse" />
        </div>
      </footer>
    )
  }

  const hasSocial =
    storeInfo.instagram || storeInfo.facebook || storeInfo.whatsapp
  const paymentMethods = storeInfo.payment_methods ?? []
  const hasPayment = paymentMethods.length > 0
  const hasAddress =
    storeInfo.address ||
    storeInfo.city ||
    storeInfo.state ||
    storeInfo.zipcode ||
    storeInfo.neighborhood ||
    storeInfo.number

  return (
    <footer className="bg-gray-50 mt-auto">
      <div className="mx-auto px-4 sm:px-6 lg:px-20 py-10 lg:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            {storeInfo.logo ? (
              <Link href={`/loja/${slug}`} className="flex-shrink-0">
                <Image
                  src={buildImageUrl(storeInfo.logo)}
                  alt={storeInfo.name}
                  width={56}
                  height={56}
                  className="rounded-lg object-cover border border-gray-200"
                />
              </Link>
            ) : null}
            <div>
              <Link
                href={`/loja/${slug}`}
                className="text-xl md:text-2xl font-bold text-gray-900 hover:text-gray-700"
              >
                {storeInfo.name}
              </Link>
              {storeInfo.description ? (
                <p className="text-sm text-gray-600 mt-0.5  max-w-md">
                  {storeInfo.description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hasAddress ? (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Endereço
                </p>
                <div className="text-sm text-gray-600 space-y-0.5">
                  {storeInfo.address || storeInfo.number || storeInfo.neighborhood ? (
                    <p>
                      {storeInfo.address}
                      {storeInfo.number ? `, ${storeInfo.number}` : ''}
                      {storeInfo.neighborhood ? ` - ${storeInfo.neighborhood}` : ''}
                    </p>
                  ) : null}
                  {(storeInfo.city || storeInfo.state || storeInfo.zipcode) && (
                    <p>
                      {storeInfo.city}
                      {storeInfo.state ? ` - ${storeInfo.state}` : ''}
                      {storeInfo.zipcode ? ` · CEP ${storeInfo.zipcode}` : ''}
                    </p>
                  )}
                </div>
              </div>
            ) : null}

            {hasSocial ? (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Redes sociais
                </p>
                <div className="flex items-center gap-3">
                  {storeInfo.instagram ? (
                    <a
                      href={
                        storeInfo.instagram
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  ) : null}
                  {storeInfo.facebook ? (
                    <a
                      href={
                        storeInfo.facebook
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  ) : null}
                  {storeInfo.whatsapp ? (
                    <a
                      href={`https://wa.me/${storeInfo.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900"
                      aria-label="WhatsApp"
                    >
                      <WhatsappIcon />
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}

            {hasPayment ? (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  
                  Formas de pagamento
                </p>
                <div className="flex flex-wrap gap-2">
                  {paymentMethods.map((id) => (
                    <span
                      key={id}
                      className="inline-flex items-center px-2.5 py-1 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-700"
                    >
                      {PAYMENT_METHOD_LABELS[id] ?? id}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  )
}

function DefaultFooter() {
  return (
    <footer className=" bg-gray-50 mt-auto">
      <div className="mx-auto px-4 sm:px-6 lg:px-20 py-10 lg:py-12">
        <p className="text-center text-sm text-gray-600">
          Loja Virtual · Sistema de lojas online
        </p>
      </div>
    </footer>
  )
}

export function AppFooter() {
  const pathname = usePathname()
  const storeMatch = pathname?.match(/^\/loja\/([^/]+)/)
  const slug = storeMatch?.[1]

  if (slug) {
    return <StoreFooterContent slug={slug} />
  }

  return <DefaultFooter />
}
