'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { FEATURE_EQUIPE } from '@/lib/featureFlags'
import {
  Box,
  Layers,
  Home,
  Phone,
  Receipt,
  ShoppingBag,
  Clock,
  Coins,
  Users,
  HelpCircle,
  ChevronDown,
  X,
  type LucideIcon,
} from 'lucide-react'

interface SectionDef {
  id: string
  href: string
  icon: LucideIcon
  title: string
  desc: string
}

const EQUIPE_SECTION: SectionDef = {
  id: 'equipe',
  href: '/vendedor/configuracoes/equipe',
  icon: Users,
  title: 'Equipe',
  desc: 'Usuários e permissões',
}

const SECTIONS: SectionDef[] = [
  { id: 'informacoes-basicas', href: '/vendedor/configuracoes/informacoes-basicas', icon: Box, title: 'Informações básicas', desc: 'Nome, descrição e logo' },
  { id: 'nichos', href: '/vendedor/configuracoes/nichos', icon: Layers, title: 'Nichos', desc: 'Categorias de produtos da loja' },
  { id: 'endereco', href: '/vendedor/configuracoes/endereco', icon: Home, title: 'Endereço', desc: 'Endereço da loja física' },
  { id: 'contatos', href: '/vendedor/configuracoes/contatos', icon: Phone, title: 'Contatos', desc: 'WhatsApp, email e redes sociais' },
  { id: 'documentos', href: '/vendedor/configuracoes/documentos', icon: Receipt, title: 'Documentos', desc: 'CNPJ ou CPF do lojista' },
  { id: 'entrega', href: '/vendedor/configuracoes/entrega', icon: ShoppingBag, title: 'Entrega', desc: 'Retirada e frete grátis' },
  { id: 'horario', href: '/vendedor/configuracoes/horario', icon: Clock, title: 'Horário', desc: 'Funcionamento e atendimento' },
  { id: 'pagamento', href: '/vendedor/configuracoes/pagamento', icon: Coins, title: 'Formas de pagamento', desc: 'Cartão, PIX e boleto' },
  { id: 'ajuda', href: '/vendedor/configuracoes/ajuda', icon: HelpCircle, title: 'Ajuda', desc: 'Páginas informativas da loja' },
  // "Equipe" só entra no menu com a flag FEATURE_EQUIPE ligada — hoje a tela é
  // 100% mock e não há backend de convites/papéis. Ver src/lib/featureFlags.ts.
  ...(FEATURE_EQUIPE ? [EQUIPE_SECTION] : []),
]

function NavItems({
  pathname,
  onNavigate,
}: {
  pathname: string | null
  onNavigate: (href: string) => void
}) {
  return (
    <>
      {SECTIONS.map((section) => {
        const Icon = section.icon
        const active = pathname === section.href || pathname?.startsWith(section.href + '/') || false

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onNavigate(section.href)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'group relative mb-0.5 flex w-full items-start gap-2.5 rounded-[10px] px-2.5 py-2.5 text-left transition-colors',
              active
                ? 'bg-nxp/[0.09] text-nxp'
                : 'text-nxi2 hover:bg-nxi3/[0.08]',
            )}
          >
            {active && (
              <span
                aria-hidden
                className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-nxp"
              />
            )}
            <span
              className={cn(
                'mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors',
                active
                  ? 'bg-nxp/10 text-nxp'
                  : 'bg-nxbg text-nxi3 group-hover:bg-white',
              )}
            >
              <Icon size={14} strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <div
                className={cn(
                  'text-[13.5px] font-semibold leading-tight tracking-[-0.005em]',
                  active ? 'text-nxp' : 'text-nxi1',
                )}
              >
                {section.title}
              </div>
              <div
                className={cn(
                  'mt-0.5 truncate text-[11.5px] leading-tight',
                  active ? 'text-nxp/70' : 'text-nxi3',
                )}
              >
                {section.desc}
              </div>
            </div>
          </button>
        )
      })}
    </>
  )
}

export default function ConfiguracoesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sheetOpen, setSheetOpen] = useState(false)

  const activeSection = SECTIONS.find(
    (s) => pathname === s.href || pathname?.startsWith(s.href + '/'),
  )
  const ActiveIcon = activeSection?.icon

  const handleNavigate = (href: string) => {
    router.push(href)
    setSheetOpen(false)
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div>
        <h1 className="m-0 text-[26px] font-extrabold leading-[1.15] tracking-[-0.03em] text-nxi1">
          Configurações
        </h1>
        <p className="mt-1 text-[13.5px] leading-[1.5] text-nxi2">
          Personalize informações, integrações e preferências da loja.
        </p>
      </div>

      {/* Mobile section picker */}
      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl border border-nxborder bg-white px-4 py-3 text-left shadow-[0_1px_2px_hsl(0_0%_0%/0.04)] transition-colors hover:bg-nxbg lg:hidden"
      >
        {ActiveIcon && (
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-nxp/10 text-nxp">
            <ActiveIcon size={15} strokeWidth={2} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-semibold leading-tight text-nxi1">
            {activeSection?.title ?? 'Selecionar seção'}
          </div>
          {activeSection?.desc && (
            <div className="mt-0.5 truncate text-[12px] text-nxi3">
              {activeSection.desc}
            </div>
          )}
        </div>
        <ChevronDown size={16} className="shrink-0 text-nxi3" />
      </button>

      {/* Bottom sheet overlay */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" aria-modal="true" role="dialog" aria-label="Seções de configurações">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setSheetOpen(false)}
          />

          {/* Sheet panel */}
          <div className="absolute inset-x-0 bottom-0 flex max-h-[80vh] flex-col rounded-t-[20px] bg-white shadow-[0_-4px_24px_hsl(0_0%_0%/0.12)]">
            {/* Handle + header */}
            <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-3">
              <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-nxborder" />
            </div>
            <div className="flex shrink-0 items-center justify-between px-4 pb-3">
              <span className="text-[15px] font-bold tracking-[-0.02em] text-nxi1">
                Configurações
              </span>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-nxbg text-nxi3 transition-colors hover:bg-nxborder"
                aria-label="Fechar"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px shrink-0 bg-nxborder" />

            {/* Nav list */}
            <div className="overflow-y-auto p-2 pb-[env(safe-area-inset-bottom,16px)]">
              <NavItems pathname={pathname} onNavigate={handleNavigate} />
            </div>
          </div>
        </div>
      )}

      {/* Settings layout (nav + pane) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
        {/* Desktop sidebar */}
        <nav
          aria-label="Seções de configurações"
          className="hidden rounded-2xl border border-nxborder bg-white p-2 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)] lg:block lg:sticky lg:top-4 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto"
        >
          <NavItems pathname={pathname} onNavigate={(href) => router.push(href)} />
        </nav>

        {/* Active form */}
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}
