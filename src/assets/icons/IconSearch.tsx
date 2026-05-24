interface IconSearchProps {
  className?: string
  size?: number
}

export function IconSearch({ className, size = 16 }: IconSearchProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      className={className}
    >
      <circle cx="6.5" cy="6.5" r="4.5" stroke="#C4C0BB" strokeWidth="1.5" />
      <path d="M10.2 10.2L13.5 13.5" stroke="#C4C0BB" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
