'use client'

import { useRouter } from 'next/navigation'
import { ShieldOff } from 'lucide-react'

interface AccessDeniedProps {
  title?: string
  message?: string
  showBackButton?: boolean
  redirectTo?: string
  redirectLabel?: string
}

export default function AccessDenied({
  title = 'Acesso não autorizado',
  message = 'Você não tem permissão para acessar esta área. Entre com uma conta com o perfil correto.',
  showBackButton = true,
  redirectTo = '/',
  redirectLabel = 'Ir para minha área',
}: AccessDeniedProps) {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-nxbg px-4 text-center">
      <span className="flex h-[80px] w-[80px] items-center justify-center rounded-[22px] border border-nxborder bg-white">
        <ShieldOff className="h-9 w-9 text-nxa" />
      </span>
      <div className="mt-[22px] text-[24px] font-extrabold tracking-[-0.02em] text-nxi1">{title}</div>
      <div className="mt-[8px] max-w-[380px] text-[14px] font-semibold leading-[1.55] text-nxi2">{message}</div>
      <div className="mt-[24px] flex items-center gap-[10px]">
        <button
          onClick={() => router.push(redirectTo)}
          className="inline-flex h-[46px] items-center justify-center rounded-[12px] bg-nxp px-[22px] text-[14px] font-extrabold text-white"
        >
          {redirectLabel}
        </button>
        <button
          onClick={() => router.push('/login')}
          className="h-[46px] px-[16px] text-[14px] font-extrabold text-nxi2"
        >
          Sair
        </button>
      </div>
    </div>
  )
}
