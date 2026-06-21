import { cn } from '@/lib/utils'
import { STEP_LABELS } from '../constants'

export function MobileStepper({ step }: { step: number }) {
  return (
    <div className="border-b border-nxborder px-6 pb-4 pt-5 md:hidden">
      <div className="flex items-center">
        {[1, 2, 3].map((s, i) => (
          <div key={s} className={cn('flex items-center', i < 2 ? 'flex-1' : '')}>
            <div
              className={cn('h-2 w-2 shrink-0 rounded-full', s <= step ? 'bg-nxp' : 'bg-nxborder')}
            />
            {i < 2 && (
              <div className={cn('mx-1 h-px flex-1', s < step ? 'bg-nxp' : 'bg-nxborder')} />
            )}
          </div>
        ))}
      </div>
      <p className="mt-2.5 text-[12px] font-semibold text-nxp">{STEP_LABELS[step - 1]}</p>
    </div>
  )
}
