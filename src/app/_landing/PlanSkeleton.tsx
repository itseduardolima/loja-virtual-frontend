import s from '../landing.module.css'

const SHIMMER_BG = '#F1F5F9'
const SHIMMER_BG_DARK = '#E5E7EB'

interface PlanSkeletonProps {
  featured?: boolean
}

export const PlanSkeleton = ({ featured = false }: PlanSkeletonProps) => (
  <div
    className={`${s.plan} ${featured ? s.planFeatured : ''}`}
    style={{ pointerEvents: 'none' }}
  >
    <div>
      <div style={{ width: 80, height: 12, background: SHIMMER_BG_DARK, borderRadius: 4 }} />
      <div style={{ width: 140, height: 48, background: SHIMMER_BG_DARK, borderRadius: 8, marginTop: 14 }} />
      <div style={{ width: 110, height: 12, background: SHIMMER_BG, borderRadius: 4, marginTop: 8 }} />
    </div>
    <div style={{ width: '100%', height: 36, background: SHIMMER_BG, borderRadius: 8 }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[80, 60, 75, 70, 65].map((width, i) => (
        <div key={i} style={{ height: 14, width: `${width}%`, background: SHIMMER_BG, borderRadius: 4 }} />
      ))}
    </div>
    <div style={{ width: '100%', height: 52, background: SHIMMER_BG_DARK, borderRadius: 14, marginTop: 'auto' }} />
  </div>
)

export const PlansSkeletonGrid = () => (
  <div className={s.plans}>
    {[0, 1, 2].map((i) => (
      <PlanSkeleton key={i} featured={i === 1} />
    ))}
  </div>
)
