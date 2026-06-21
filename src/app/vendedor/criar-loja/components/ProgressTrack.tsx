import { cn } from '@/lib/utils'

export function ProgressTrack({ step }: { step: number }) {
  return (
    <div className="flex w-full gap-[2px]">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={cn('h-0.5 flex-1 transition-colors duration-500', s <= step ? 'bg-nxp' : 'bg-nxborder')}
        />
      ))}
    </div>
  )
}
