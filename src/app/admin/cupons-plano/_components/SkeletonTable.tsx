import { cn } from '@/lib/utils'
import { GRID } from '../useAdminPlanCouponsPage'

function Sk({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-[#ECEDF2]', className)} />
}

function SkRow({ borderTop = true }: { borderTop?: boolean }) {
  return (
    <div className={cn(GRID, 'px-[18px] py-[13px]', borderTop && 'border-t border-[#F0F1F5]')}>
      <Sk className="h-6 w-[90px] rounded-lg" />
      <div className="flex flex-col gap-1.5">
        <Sk className="h-5 w-[68px] rounded-full" />
        <Sk className="h-3 w-[50px]" />
      </div>
      <Sk className="h-3 w-[70%]" />
      <Sk className="h-3 w-[70%]" />
      <Sk className="h-3 w-[80%]" />
      <div className="flex flex-col gap-1.5">
        <Sk className="h-3 w-[80%]" />
        <Sk className="h-3 w-[50%]" />
      </div>
      <Sk className="h-3 w-[80%]" />
      <Sk className="h-5 w-[68px] rounded-full" />
      <div className="flex justify-center">
        <Sk className="h-7 w-7 rounded-lg" />
      </div>
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-nxborder bg-white shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]">
      <div className="overflow-x-auto">
        <div className="min-w-[860px]">
          <div
            className={cn(
              GRID,
              'bg-[#FBFBFD] px-[18px] py-3 text-[10.5px] font-extrabold uppercase tracking-[.05em] text-nxi3',
            )}
          >
            <div>Código</div>
            <div>Desconto</div>
            <div>Ciclo</div>
            <div>Duração</div>
            <div>Usos</div>
            <div>Expira</div>
            <div>Planos</div>
            <div>Status</div>
            <div />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkRow key={i} borderTop={i > 0} />
          ))}
        </div>
      </div>
    </div>
  )
}
