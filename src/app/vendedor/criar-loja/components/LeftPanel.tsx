import { cn } from '@/lib/utils'
import { NexoLeftPanel } from '@/components/Layout/NexoLeftPanel'
import { STEP_LABELS, STEP_MESSAGES } from '../constants'

export function LeftPanel({ step }: { step: number }) {
  return (
    <NexoLeftPanel
      footer={
        <span className="text-xs text-white/[32%]">
          Precisa de ajuda?
        </span>
      }
    >
      <div>
        <div>
          {STEP_LABELS.map((label, i) => {
            const done = step > i + 1
            const active = step === i + 1
            const last = i === STEP_LABELS.length - 1
            return (
              <div key={i}>
                <div className="flex items-center gap-3 py-0.5">
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300',
                      done && 'bg-[#4ADE80]',
                      active && 'bg-white',
                      !done && !active && 'bg-transparent border border-white/25',
                    )}
                  />
                  <span
                    className={cn(
                      'text-sm',
                      done && 'text-white/50 line-through',
                      active && 'text-white font-semibold',
                      !done && !active && 'text-white/[33%]',
                    )}
                  >
                    {label}
                    {active && (
                      <span className="ml-2 text-white/40 font-normal">→</span>
                    )}
                  </span>
                </div>
                {!last && (
                  <div className="ml-[3px] h-7 border-l border-dashed border-white/[13%]" />
                )}
              </div>
            )
          })}
        </div>

        <p className="text-sm leading-relaxed mt-9 text-white/55 max-w-[220px]">
          {STEP_MESSAGES[step - 1]}
        </p>
      </div>
    </NexoLeftPanel>
  )
}
