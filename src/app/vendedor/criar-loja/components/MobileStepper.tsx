import { cn } from '@/lib/utils'
import { NAVY, STEP_LABELS } from '../constants'

export function MobileStepper({ step }: { step: number }) {
  return (
    <div className="md:hidden px-6 pt-5 pb-4 border-b border-gray-100">
      <div className="flex items-center">
        {[1, 2, 3].map((s, i) => (
          <div key={s} className={cn('flex items-center', i < 2 ? 'flex-1' : '')}>
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: s <= step ? NAVY : '#E5E7EB' }}
            />
            {i < 2 && (
              <div
                className="flex-1 h-px mx-1"
                style={{ background: s < step ? NAVY : '#E5E7EB' }}
              />
            )}
          </div>
        ))}
      </div>
      <p className="text-xs font-semibold mt-2.5" style={{ color: NAVY }}>
        {STEP_LABELS[step - 1]}
      </p>
    </div>
  )
}
