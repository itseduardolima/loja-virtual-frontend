interface IconListProps {
  className?: string
  size?: number
  active?: boolean
}

export function IconList({ className, size = 14, active = false }: IconListProps) {
  const c = active ? '#111' : '#9CA3AF'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      className={className}
    >
      <line x1="1" y1="3.5" x2="13" y2="3.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1" y1="7" x2="13" y2="7" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="1" y1="10.5" x2="13" y2="10.5" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
