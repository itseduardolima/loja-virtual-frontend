'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import { StoreHeader, CartSidebar, LoadingPage } from '@/components'
import { StoreNewFooter, WhatsAppChatWidget } from '@/components/Store'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useStorePage } from '@/hooks/useStorePages'
import { sanitizeHtml } from '@/lib/sanitize'
import { useState } from 'react'

const SLUG_TO_TYPE: Record<string, string> = {
  trocas: 'returns',
  envio: 'shipping',
  faq: 'faq',
  sobre: 'about',
  politica: 'privacy',
}

export default function StorePagePublic() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const typeSlug = params.type as string
  const type = SLUG_TO_TYPE[typeSlug] ?? typeSlug

  const { storeInfo, loading: storeLoading } = useStoreInfo(slug)
  const { data: page, isLoading: pageLoading, isError } = useStorePage(slug, type)

  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    if (isError) {
      router.replace(`/loja/${slug}`)
    }
  }, [isError, router, slug, type])

  if (storeLoading && !storeInfo) {
    return <LoadingPage />
  }

  return (
    <div className="min-h-screen bg-white">
      <StoreHeader
        storeInfo={storeInfo ?? undefined}
        slug={slug}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main className="mx-auto max-w-[800px] px-4 py-10 md:px-6 md:py-14">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-[12.5px] text-nxi3">
          <Link href={`/loja/${slug}`} className="hover:text-nxi1">
            Início
          </Link>
          <ChevronRight size={13} className="text-nxi3/60" />
          <span className="text-nxi2">{page?.title ?? '...'}</span>
        </nav>

        {pageLoading ? (
          <div className="flex flex-col gap-4">
            <div className="h-9 w-2/3 animate-pulse rounded-xl bg-nxbg" />
            <div className="h-4 w-full animate-pulse rounded-lg bg-nxbg" />
            <div className="h-4 w-5/6 animate-pulse rounded-lg bg-nxbg" />
            <div className="h-4 w-4/6 animate-pulse rounded-lg bg-nxbg" />
          </div>
        ) : page ? (
          <>
            <h1 className="mb-6 text-[28px] font-extrabold leading-tight tracking-[-0.025em] text-nxi1 md:text-[34px]">
              {page.title}
            </h1>
            <div
              className="prose prose-sm max-w-none text-nxi2 prose-headings:font-bold prose-headings:text-nxi1 prose-a:text-nxp prose-a:no-underline hover:prose-a:underline prose-strong:text-nxi1 prose-li:my-1"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.content) }}
            />
          </>
        ) : null}
      </main>

      {storeInfo && <StoreNewFooter storeInfo={storeInfo} slug={slug} />}

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        storeId={storeInfo?.id}
        storeSlug={slug}
        currentPath={`/loja/${slug}/pagina/${typeSlug}`}
      />

      <WhatsAppChatWidget whatsapp={storeInfo?.whatsapp} storeName={storeInfo?.name} />
    </div>
  )
}
