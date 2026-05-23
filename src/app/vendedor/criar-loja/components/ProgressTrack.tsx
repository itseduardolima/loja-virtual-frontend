import { NAVY } from '../constants'

export function ProgressTrack({ step }: { step: number }) {
  return (
    <div className="flex gap-[2px] w-full">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className="flex-1 transition-all duration-500"
          style={{ height: 2, background: s <= step ? NAVY : '#F1F3F5' }}
        />
      ))}
    </div>
  )
}
