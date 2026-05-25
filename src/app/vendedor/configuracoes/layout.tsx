'use client'

import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
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
  Plug,
  type LucideIcon,
} from 'lucide-react'

interface SectionDef {
  id: string
  href: string
  icon: LucideIcon
  title: string
  desc: string
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
  { id: 'equipe', href: '/vendedor/configuracoes/equipe', icon: Users, title: 'Equipe', desc: 'Usuários e permissões' },
  { id: 'integracao-bling', href: '/vendedor/configuracoes/integracao-bling', icon: Plug, title: 'Integração Bling', desc: 'ERP' },
]

export default function ConfiguracoesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="flex flex-col gap-5">
      {/* Page header — mesma escala/cor da home/dashboard */}
      <div>
        <h1 className="m-0 text-[26px] font-extrabold leading-[1.15] tracking-[-0.03em] text-nxi1">
          Configurações
        </h1>
        <p className="mt-1 text-[13.5px] leading-[1.5] text-nxi2">
          Personalize informações, integrações e preferências da loja.
        </p>
      </div>

      {/* Settings layout (nav + pane) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[280px_1fr]">
        {/* Internal nav — segue padrão SidebarVendedor (rounded-2xl bg-white border-nxborder) */}
        <nav
          aria-label="Seções de configurações"
          className="rounded-2xl border border-nxborder bg-white p-2 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)] lg:sticky lg:top-4 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto"
        >
          {SECTIONS.map((section) => {
            const Icon = section.icon
            const active = pathname === section.href || pathname?.startsWith(section.href + '/')

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => router.push(section.href)}
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
        </nav>

        {/* Active form */}
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}
