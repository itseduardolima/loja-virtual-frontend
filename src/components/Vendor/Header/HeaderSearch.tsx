'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Loader2, Package, Search, ShoppingBag } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { useHeaderSearch } from '@/hooks/useHeaderSearch'
import { buildImageUrl, cn } from '@/lib/utils'
import { formatBRL } from '@/lib/vendor'

const MIN_QUERY = 2

export function HeaderSearch() {
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const debouncedQuery = useDebounce(query.trim(), 300)
  const { data, isFetching } = useHeaderSearch(debouncedQuery)

  const products = data?.products ?? []
  const orders = data?.orders ?? []
  const showDropdown = isOpen && query.trim().length >= MIN_QUERY
  const hasResults = products.length > 0 || orders.length > 0

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setIsOpen(false)
    }
    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false)
        inputRef.current?.blur()
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKeydown)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKeydown)
    }
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setIsOpen(false)
    router.push(`/vendedor/produtos?search=${encodeURIComponent(q)}`)
  }

  function goToProduct(id: number) {
    setIsOpen(false)
    setQuery('')
    router.push(`/vendedor/produtos/editar/${id}`)
  }

  function goToOrder(id: number) {
    setIsOpen(false)
    setQuery('')
    router.push(`/vendedor/pedidos?orderId=${id}`)
  }

  return (
    <div ref={wrapperRef} className="relative mx-auto flex max-w-[420px] flex-1 items-center">
      <form onSubmit={handleSubmit} className="relative flex w-full items-center">
        <Search
          size={15}
          className="pointer-events-none absolute left-[11px] text-nxi3"
          strokeWidth={2}
        />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar produtos, pedidos, clientes…"
          className="h-11 w-full rounded-full border border-nxborder bg-nxbg pl-[34px] pr-20 text-[13px] text-nxi2 outline-none transition-[border-color,box-shadow] focus:border-nxp focus:shadow-[0_0_0_3px_hsl(237_49%_33%/0.1)]"
        />
        <kbd className="pointer-events-none absolute right-5 rounded-[5px] bg-nxborder px-1.5 py-0.5 font-[inherit] text-[11px] text-nxi3">
          ⌘K
        </kbd>
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-[420px] overflow-hidden rounded-xl border border-nxborder bg-white shadow-[0_8px_24px_hsl(0_0%_0%/0.10)]">
          {isFetching && !hasResults ? (
            <div className="flex items-center justify-center gap-2 py-6 text-xs text-nxi3">
              <Loader2 size={14} className="animate-spin" />
              Buscando…
            </div>
          ) : !hasResults ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-nxi3">
              <Search size={20} className="mb-2 opacity-40" />
              <p className="text-sm font-medium">Nenhum resultado</p>
              <p className="mt-0.5 text-xs">Tente outro termo</p>
            </div>
          ) : (
            <div className="max-h-[420px] overflow-y-auto">
              {products.length > 0 && (
                <SectionGroup title="Produtos" icon={Package}>
                  {products.map((p) => (
                    <ResultRow
                      key={`p-${p.id}`}
                      onClick={() => goToProduct(p.id)}
                      thumb={p.image ? buildImageUrl(p.image) : null}
                      thumbFallback={<Package size={14} className="text-nxi3" />}
                      title={p.name}
                      subtitle={formatBRL(Number(p.price))}
                    />
                  ))}
                </SectionGroup>
              )}
              {orders.length > 0 && (
                <SectionGroup title="Pedidos" icon={ShoppingBag}>
                  {orders.map((o) => (
                    <ResultRow
                      key={`o-${o.id}`}
                      onClick={() => goToOrder(o.id)}
                      thumb={o.image ? buildImageUrl(o.image) : null}
                      thumbFallback={<ShoppingBag size={14} className="text-nxi3" />}
                      title={`#${o.order_code} · ${o.customer_name}`}
                      subtitle={formatBRL(Number(o.total))}
                    />
                  ))}
                </SectionGroup>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
            className="flex w-full items-center justify-between border-t border-nxborder px-3 py-2.5 text-xs font-medium text-nxi2 hover:bg-nxbg/50"
          >
            <span>
              Buscar “<span className="font-semibold text-nxi1">{query.trim()}</span>” em produtos
            </span>
            
          </button>
        </div>
      )}
    </div>
  )
}

interface SectionGroupProps {
  title: string
  icon: React.ElementType
  children: React.ReactNode
}

function SectionGroup({ title, icon: Icon, children }: SectionGroupProps) {
  return (
    <div className="border-b border-nxborder last:border-0">
      <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-nxi3">
        <Icon size={11} />
        {title}
      </div>
      <div>{children}</div>
    </div>
  )
}

interface ResultRowProps {
  onClick: () => void
  thumb: string | null
  thumbFallback: React.ReactNode
  title: string
  subtitle: string
}

function ResultRow({ onClick, thumb, thumbFallback, title, subtitle }: ResultRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-nxbg/50',
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-nxbg">
        {thumb ? (
          <Image src={thumb} alt={title} width={32} height={32} className="h-full w-full object-cover" />
        ) : (
          thumbFallback
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium text-nxi1">{title}</div>
        <div className="text-[11px] text-nxi3">{subtitle}</div>
      </div>
    </button>
  )
}
