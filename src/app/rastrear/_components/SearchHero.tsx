'use client'

import { Search, PackageSearch } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchHeroProps {
  code: string
  setCode: (v: string) => void
  onSearch: (e: React.FormEvent) => void
  loading: boolean
  hasResult: boolean
}

export function SearchHero({ code, setCode, onSearch, loading, hasResult }: SearchHeroProps) {
  return (
    <div className={cn('relative overflow-hidden border-b border-nxborder bg-[#070815]', hasResult ? 'py-8' : 'py-16 md:py-24')}>
      {/* glow overlay */}
      <div aria-hidden className="hero-glow pointer-events-none absolute -top-24 left-1/2 h-72 w-[760px] -translate-x-1/2 rounded-full opacity-[0.22] blur-3xl" />
      {/* dots */}
      <div aria-hidden className="hero-dots pointer-events-none absolute inset-0 opacity-[0.04]" />

      <div className="relative mx-auto max-w-[640px] px-5 text-center">
        {!hasResult && (
          <div className="rt-rise mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.08] text-white ring-1 ring-inset ring-white/15">
            <PackageSearch size={26} />
          </div>
        )}

        <h1
          className={cn(
            'rt-rise font-extrabold tracking-[-0.03em] text-white',
            hasResult ? 'text-[20px]' : 'text-[30px] md:text-[38px]',
          )}
          style={{ animationDelay: '.05s' }}
        >
          {hasResult ? 'Rastrear outro pedido' : 'Acompanhe seu pedido'}
        </h1>

        {!hasResult && (
          <p className="rt-rise mx-auto mt-2.5 max-w-[42ch] text-[14px] leading-relaxed text-white/55" style={{ animationDelay: '.1s' }}>
            Digite o código do pedido para ver o status da entrega em tempo real. Você encontra o código no e-mail de confirmação ou no WhatsApp da loja.
          </p>
        )}

        <form onSubmit={onSearch} className="rt-rise mx-auto mt-6 flex max-w-[480px] items-center gap-2" style={{ animationDelay: '.15s' }}>
          <div className="relative flex-1">
            <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ex.: PED-20240001"
              className="h-12 w-full rounded-full border border-white/15 bg-white/[0.06] pl-11 pr-4 text-[14px] font-medium text-white placeholder:text-white/35 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/10"
            />
          </div>
          <button
            type="submit"
            disabled={!code.trim() || loading}
            className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 text-[13.5px] font-bold text-[#070815] transition-transform active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#070815]/30 border-t-[#070815]" />
            ) : (
              <Search size={16} />
            )}
            Rastrear
          </button>
        </form>
      </div>
    </div>
  )
}
