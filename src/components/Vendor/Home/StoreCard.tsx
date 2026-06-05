'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Camera, Copy, ExternalLink } from 'lucide-react'
import { useStore } from '@/hooks/useStore'
import { useUpdateStore } from '@/hooks/useUpdateStore'
import { buildImageUrl, cn } from '@/lib/utils'
import { getInitials, getStoreChannels } from '@/lib/vendor'

export function StoreCard() {
  const { data: store } = useStore()
  const { updateStore } = useUpdateStore()
  const logoRef = useRef<HTMLInputElement>(null)
  const [copied, setCopied] = useState(false)
  const [heroHover, setHeroHover] = useState(false)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !store?.id) return
    await updateStore({ storeId: store.id, data: { logo: file } })
  }

  const copySlug = () => {
    if (!store?.slug) return
    navigator.clipboard.writeText(`loja.com/${store.slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const storeName = store?.name ?? 'Minha Loja'
  const initials = getInitials(storeName)
  const channels = getStoreChannels(store)

  return (
    <div className="flex flex-col items-stretch rounded-2xl bg-white p-3 pb-0 shadow-[0_0_0_1px_hsl(0_0%_0%/0.06),0_2px_8px_hsl(0_0%_0%/0.06)]">
      {/* Hero banner */}
      <div
        title="Clique para trocar o logo"
        onClick={() => logoRef.current?.click()}
        onMouseEnter={() => setHeroHover(true)}
        onMouseLeave={() => setHeroHover(false)}
        className={cn(
          'relative flex h-[300px] cursor-pointer items-center justify-center overflow-hidden rounded-[10px]',
          !store?.logo && 'bg-[linear-gradient(135deg,#F5DDD0_0%,#EDD5C5_100%)]',
        )}
      >
        {store?.logo ? (
          <Image src={buildImageUrl(store.logo)} alt={storeName} fill className="object-cover" />
        ) : (
          <span className="select-none text-[40px] font-extrabold leading-none tracking-[-0.04em] text-[#C4673D]">
            {initials}
          </span>
        )}

        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 text-[13px] font-semibold text-white transition-opacity duration-200',
            heroHover ? 'opacity-100' : 'opacity-0',
          )}
        >
          <Camera size={16} />
          Trocar logo
        </div>

        <input
          ref={logoRef}
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="hidden"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col items-center gap-4 px-4 pt-4 pb-5">
        <div className="w-full">
          <h3 className="m-0 text-[15px] font-bold tracking-[-0.01em] text-nxi1">{storeName}</h3>
          {store?.slug && (
            <button
              onClick={copySlug}
              className={cn(
                'mt-0.5 inline-flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-xs transition-colors',
                copied ? 'text-nxs' : 'text-nxi3',
              )}
            >
              loja.com/{store.slug}
              <Copy size={11} />
            </button>
          )}
        </div>

        {store?.slug && (
          <a
            href={`/loja/${store.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-[10px] bg-nxa py-2.5 text-[13px] font-semibold text-white no-underline transition-opacity hover:opacity-[0.88]"
          >
            <ExternalLink size={13} strokeWidth={2} />
            Visitar loja pública
          </a>
        )}

        {channels.length > 0 && (
          <div className="w-full">
            <p className="m-0 mb-2 text-[10.5px] font-bold uppercase tracking-[0.08em] text-nxi3">
              Canais conectados
            </p>
            <div className="flex flex-wrap gap-1.5">
              {channels.map((ch) => (
                <span
                  key={ch.label}
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
                  style={{ background: `${ch.color}18`, color: ch.color }}
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: ch.color }}
                  />
                  {ch.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
