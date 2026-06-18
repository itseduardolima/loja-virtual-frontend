'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import sunImg from '@/assets/icons/icons8-sun-48.png'
import moonImg from '@/assets/icons/icons8-night-40.png'
import type { GreetingPeriod } from '@/lib/vendor'

interface HomeGreetingProps {
  greetingText: string
  period: GreetingPeriod
  todayLabel: string
  pendingOrders: number
  pendingQuestions: number
  isLoading?: boolean
}

function GreetingIcon({ period }: { period: GreetingPeriod }) {
  const isEvening = period === 'evening'
  return (
    <Image
      src={isEvening ? moonImg : sunImg}
      alt={isEvening ? 'Lua' : 'Sol'}
      width={32}
      height={32}
      className="h-8 w-8 select-none"
      priority
    />
  )
}

export function HomeGreeting({
  greetingText,
  period,
  todayLabel,
  pendingOrders,
  pendingQuestions,
  isLoading,
}: HomeGreetingProps) {
  const router = useRouter()
  const hasPending = !isLoading && (pendingOrders > 0 || pendingQuestions > 0)

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
      <div>
        <h1 className="m-0 flex items-center gap-2 text-[22px] font-extrabold leading-[1.15] tracking-[-0.03em] text-nxi1 sm:text-[26px]">
          {greetingText}
          <GreetingIcon period={period} />
        </h1>
        <p className="mt-1.5 text-[13.5px] leading-[1.5] text-nxi2">
          {hasPending ? (
            <>
              Você tem{' '}
              {pendingOrders > 0 && (
                <button
                  onClick={() => router.push('/vendedor/pedidos')}
                  className="cursor-pointer border-none bg-transparent p-0 text-inherit font-semibold text-nxp"
                >
                  {pendingOrders} pedido{pendingOrders > 1 ? 's' : ''} pendente
                  {pendingOrders > 1 ? 's' : ''}
                </button>
              )}
              {pendingOrders > 0 && pendingQuestions > 0 && ' e '}
              {pendingQuestions > 0 && (
                <button
                  onClick={() => router.push('/vendedor/perguntas')}
                  className="cursor-pointer border-none bg-transparent p-0 text-inherit font-semibold text-nxp"
                >
                  {pendingQuestions} pergunta{pendingQuestions > 1 ? 's' : ''} sem resposta
                </button>
              )}
              .
            </>
          ) : (
            'Gerencie sua loja e acompanhe suas vendas.'
          )}
        </p>
      </div>
      <span className="whitespace-nowrap text-[11px] font-bold tracking-[0.06em] text-nxi3 sm:pt-1.5">
        {todayLabel}
      </span>
    </div>
  )
}
