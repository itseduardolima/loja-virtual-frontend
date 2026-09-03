/**
 * Avatar de vendedor/cliente sem depender de fotos de banco de imagens (Unsplash etc).
 * Renderiza as iniciais do nome sobre um círculo de cor sólida, escolhida de forma
 * determinística a partir do nome — mesma pessoa sempre cai na mesma cor.
 */

const PALETTE = [
  '#2a2d7c', // índigo (marca)
  '#e8642c', // laranja (marca)
  '#3f8a66', // verde (marca)
  '#5b5eae', // índigo-lavanda
  '#c2703f', // terracota
  '#c7861a', // âmbar
]

function hashName(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  const first = words[0][0] ?? ''
  const last = words[words.length - 1][0] ?? ''
  return (words.length > 1 ? first + last : first).toUpperCase()
}

interface SellerAvatarProps {
  name: string
  size?: number
}

export const SellerAvatar = ({ name, size = 46 }: SellerAvatarProps) => {
  const color = PALETTE[hashName(name) % PALETTE.length]
  const initials = getInitials(name)

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={name}
      style={{ flexShrink: 0, borderRadius: '999px' }}
    >
      <circle cx="50" cy="50" r="50" fill={color} />
      <text
        x="50"
        y="52"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#fff"
        fontFamily="Nunito, system-ui, sans-serif"
        fontWeight={800}
        fontSize="38"
      >
        {initials}
      </text>
    </svg>
  )
}
