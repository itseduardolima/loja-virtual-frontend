'use client'

import { CreditCard, PackageX, AlertTriangle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SubscriptionBlockedProps {
  title?: string
  message?: string
  showManageButton?: boolean
  variant?: 'payment_pending' | 'cancelled'
}

export default function SubscriptionBlocked({
  title,
  message,
  showManageButton = true,
  variant = 'cancelled',
}: SubscriptionBlockedProps) {
  const router = useRouter()

  if (variant === 'payment_pending') {
    const resolvedTitle = title ?? 'Pagamento pendente'
    const resolvedMessage = message ?? 'Sua assinatura está aguardando confirmação do pagamento.'

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-nxbg px-4 text-center">
        <span className="inline-flex h-[80px] w-[80px] items-center justify-center rounded-[22px] border border-nxborder bg-white">
          <CreditCard className="h-9 w-9 text-nxw" />
        </span>
        <div className="mt-[20px] text-[24px] font-extrabold tracking-[-0.02em] text-nxi1">{resolvedTitle}</div>
        <div className="mt-[8px] max-w-[400px] text-[14px] font-semibold leading-[1.55] text-nxi2">{resolvedMessage}</div>
        <span className="inline-flex items-center gap-[7px] mt-[16px] rounded-[10px] border border-[#F0D070] bg-[#FDF6E3] px-[13px] py-[7px] text-[12.5px] font-extrabold text-[#9A6F0A]">
          <AlertTriangle className="h-[14px] w-[14px] text-[#9A6F0A]" />
          Acesso restrito até regularização
        </span>
        <div className="flex flex-col gap-[9px] max-w-[300px] mx-auto mt-[20px] text-left">
          <div className="flex items-center gap-[9px] text-[13px] font-bold text-nxi2">
            <X className="h-[15px] w-[15px] text-nxa shrink-0" />
            Loja fora do ar
          </div>
          <div className="flex items-center gap-[9px] text-[13px] font-bold text-nxi2">
            <X className="h-[15px] w-[15px] text-nxa shrink-0" />
            Novos pedidos bloqueados
          </div>
          <div className="flex items-center gap-[9px] text-[13px] font-bold text-nxi2">
            <X className="h-[15px] w-[15px] text-nxa shrink-0" />
            Produtos ocultos
          </div>
        </div>
        {showManageButton && (
          <div className="mt-[24px]">
            <button
              onClick={() => router.push('/vendedor/plano')}
              className="inline-flex h-[46px] items-center justify-center rounded-[12px] bg-nxp px-[22px] text-[14px] font-extrabold text-white"
            >
              Regularizar pagamento
            </button>
          </div>
        )}
      </div>
    )
  }

  // variant === 'cancelled'
  const resolvedTitle = title ?? 'Assinatura encerrada'
  const resolvedMessage = message ?? 'Sua assinatura foi cancelada. Para continuar usando a plataforma, é necessário renovar sua assinatura.'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-nxbg px-4 text-center">
      <span className="inline-flex h-[80px] w-[80px] items-center justify-center rounded-[22px] border border-nxborder bg-white">
        <PackageX className="h-9 w-9 text-nxi3" />
      </span>
      <div className="mt-[20px] text-[24px] font-extrabold tracking-[-0.02em] text-nxi1">{resolvedTitle}</div>
      <div className="mt-[8px] max-w-[400px] text-[14px] font-semibold leading-[1.55] text-nxi2">{resolvedMessage}</div>
      {showManageButton && (
        <div className="mt-[24px] flex flex-col items-center gap-[8px]">
          <button
            onClick={() => router.push('/vendedor/plano')}
            className="flex h-[46px] w-full max-w-[260px] items-center justify-center rounded-[12px] bg-nxp text-[14px] font-extrabold text-white"
          >
            Reativar assinatura
          </button>
          <button
            onClick={() => router.push('/vendedor/plano')}
            className="h-[42px] px-[16px] text-[14px] font-extrabold text-nxi2"
          >
            Falar com suporte
          </button>
        </div>
      )}
    </div>
  )
}
