import type { ReactNode } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { AuthLeftPanel } from './AuthLeftPanel'
import type { AuthCtx } from './authContent'

interface AuthShellProps {
  ctx: AuthCtx
  /** Link contextual do topo direito (ex.: "Ainda não tem conta? Criar conta →") */
  topRight?: ReactNode
  /** Coluna central mais larga para forms com grid de 2 colunas (cadastro) */
  wide?: boolean
  children: ReactNode
}

export function AuthShell({ ctx, topRight, wide = false, children }: AuthShellProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AuthLeftPanel ctx={ctx} />

      {/* coluna direita — form */}
      <div className="relative flex flex-1 flex-col overflow-hidden bg-white">
        {/* brand mobile + link top-right */}
        <div className="flex shrink-0 items-center justify-between px-6 pt-7 sm:px-10">
          <Link href="/" className="flex items-center gap-2 lg:invisible">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-nxp text-[13px] font-extrabold text-white">
              N
            </span>
            <span className="font-integral text-[15px] tracking-[0.04em] text-nxi1">NEXO</span>
          </Link>
          {topRight}
        </div>

        {/* conteúdo central — my-auto centraliza e ainda permite scroll quando o form excede a altura */}
        <div className="flex flex-1 flex-col overflow-y-auto px-6 sm:px-10 lg:px-16 xl:px-24">
          <div
            className={cn('mx-auto my-auto w-full py-8', wide ? 'max-w-[460px]' : 'max-w-[380px]')}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export function AuthTopLink({
  prefix,
  label,
  href,
}: {
  prefix: string
  label: string
  href: string
}) {
  return (
    <span className="text-[13px] text-nxi3">
      {prefix}{' '}
      <Link href={href} className="font-bold text-nxp transition-colors hover:text-nxp/80">
        {label} →
      </Link>
    </span>
  )
}
