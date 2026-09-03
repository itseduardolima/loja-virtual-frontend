/**
 * Etiqueta de roupa desenhada à mão — motivo recorrente da marca Nexo,
 * reforçando o nicho de moda sem recorrer a ícone genérico de "tag" giratório em 3D.
 * Baseada no traço do protótipo (Main.dc.html, .tagArt).
 */

interface TagIllustrationProps {
  className?: string
  size?: number
}

export const TagIllustration = ({ className, size = 140 }: TagIllustrationProps) => (
  <svg
    className={className}
    width={size}
    height={size * (160 / 140)}
    viewBox="0 0 140 160"
    fill="none"
    aria-hidden="true"
  >
    {/* corpo da etiqueta */}
    <path
      d="M78 8 C64 8 61 11 53 20 L14 62 C8 68 8 76 14 82 L58 126 C64 132 72 132 78 126 L120 84 C126 78 129 70 129 61 L129 20 C129 13 124 8 117 8 Z"
      stroke="#2a2d7c"
      strokeWidth={1.6}
      opacity={0.8}
    />
    {/* furo */}
    <circle cx="103" cy="34" r="7" stroke="#2a2d7c" strokeWidth={1.6} opacity={0.8} />
    {/* laço / barbante */}
    <path
      d="M100 4 C104 -6 112 -6 116 4"
      stroke="#e8642c"
      strokeWidth={1.6}
      strokeLinecap="round"
      opacity={0.85}
    />
    {/* linhas de texto sugeridas */}
    <path
      d="M40 70 L92 70 M36 84 L88 84 M44 98 L84 98"
      stroke="#2a2d7c"
      strokeWidth={1.4}
      strokeLinecap="round"
      opacity={0.4}
    />
  </svg>
)
