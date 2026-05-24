interface IconGridProps {
  className?: string
  size?: number
  active?: boolean
}

export function IconGrid({ className, size = 14, active = false }: IconGridProps) {
  const c = active ? '#111' : '#9CA3AF'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      className={className}
    >
      <rect x="1" y="1" width="5" height="5" rx="1" fill={c} />
      <rect x="8" y="1" width="5" height="5" rx="1" fill={c} />
      <rect x="1" y="8" width="5" height="5" rx="1" fill={c} />
      <rect x="8" y="8" width="5" height="5" rx="1" fill={c} />
    </svg>
  )
}
