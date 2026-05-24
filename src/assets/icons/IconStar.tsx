interface IconStarProps {
  className?: string
  size?: number
  filled?: boolean
}

export function IconStar({ className, size = 16, filled = false }: IconStarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill={filled ? '#FBBF24' : '#E5E7EB'}
      className={className}
    >
      <path d="M6 .5l1.5 3.1H11L8.1 6.4l1 3.1L6 7.6 2.9 9.5l1-3.1L1 3.6h3.5z" />
    </svg>
  )
}
