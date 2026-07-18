'use client'

import { useState, useEffect } from 'react'
import { X, User, Package, Heart, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type DrawerTab } from './shared'
import { SectionConta } from './SectionConta'
import { SectionPedidos } from './SectionPedidos'
import { SectionDesejos } from './SectionDesejos'
import { SectionEnderecos } from './SectionEnderecos'

/* ─── Tipos públicos ────────────────────────────────────────────────────── */

export interface CustomerAccountDrawerProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: DrawerTab
  onOpenCart?: () => void
}

/* ─── Configuração das abas ─────────────────────────────────────────────── */

const TABS: {
  id: DrawerTab
  label: string
  title: string
  icon: React.ElementType
}[] = [
  { id: 'conta', label: 'Conta', title: 'Minha conta', icon: User },
  { id: 'pedidos', label: 'Pedidos', title: 'Meus pedidos', icon: Package },
  { id: 'desejos', label: 'Desejos', title: 'Lista de desejos', icon: Heart },
  { id: 'enderecos', label: 'Endereços', title: 'Endereços', icon: MapPin },
]

/* ─── Shell ─────────────────────────────────────────────────────────────── */

export function CustomerAccountDrawer({
  isOpen,
  onClose,
  initialTab = 'conta',
  onOpenCart,
}: CustomerAccountDrawerProps) {
  const [tab, setTab] = useState<DrawerTab>(initialTab)

  /* Reseta aba para initialTab sempre que o drawer abre */
  useEffect(() => {
    if (isOpen) setTab(initialTab)
  }, [isOpen, initialTab])

  /* ESC fecha — listener só ativo quando isOpen */
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const activeTab = TABS.find((t) => t.id === tab) ?? TABS[0]

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-[199] bg-nxi1/45 backdrop-blur-[2px] transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={activeTab.title}
        className={cn(
          'fixed right-0 top-0 z-[200] flex h-full w-[clamp(340px,_46vw,_460px)] flex-col',
          'border-l border-nxborder bg-white shadow-[0_0_60px_rgba(3,7,18,0.22)]',
          'transition-transform duration-[400ms] ease-[cubic-bezier(.22,1,.36,1)]',
          isOpen ? 'translate-x-0' : 'translate-x-[102%]',
        )}
      >
        {/* Header */}
        <div className="flex h-[60px] flex-shrink-0 items-center justify-between border-b border-nxborder px-5">
          <h2 className="text-[17px] font-extrabold tracking-tight text-nxi1">{activeTab.title}</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-nxborder text-nxi3 transition-colors hover:border-nxi3 hover:text-nxi1"
          >
            <X size={16} />
          </button>
        </div>

        {/* Conteúdo — seção da aba ativa */}
        <div className="relative flex flex-1 flex-col overflow-hidden">
          {tab === 'conta' && <SectionConta isOpen={isOpen} onClose={onClose} />}
          {tab === 'pedidos' && <SectionPedidos onClose={onClose} onOpenCart={onOpenCart} />}
          {tab === 'desejos' && <SectionDesejos isOpen={isOpen} onClose={onClose} />}
          {tab === 'enderecos' && <SectionEnderecos isOpen={isOpen} />}
        </div>

        {/* Bottom tab bar */}
        <div className="flex h-[62px] flex-shrink-0 border-t border-nxborder bg-white">
          {TABS.map((t) => {
            const isActive = tab === t.id
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  'relative flex flex-1 flex-col items-center justify-center gap-1',
                  'text-[10px] font-bold uppercase tracking-[0.08em] transition-colors',
                  isActive ? 'text-store' : 'text-nxi3 hover:text-nxi2',
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
                {t.label}
                {/* Indicador no topo da barra */}
                <span
                  className={cn(
                    'absolute left-[22%] right-[22%] top-0 h-[2px] rounded-full bg-store transition-transform duration-300',
                    isActive ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
