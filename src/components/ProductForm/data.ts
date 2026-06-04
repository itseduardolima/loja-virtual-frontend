// Fonte canônica de cores, ícones de nicho e helpers de moeda
// para o fluxo "Criar/Editar Produto".
// COLOR_FAMILIES / getColorHex / colorLuma copiados de
// /tmp/nexo-design/nexo-criar-produto/project/data.jsx
import {
  Apple,
  Baby,
  BookOpen,
  Car,
  Dumbbell,
  Footprints,
  Gem,
  Glasses,
  Package,
  PawPrint,
  Pill,
  Shirt,
  Smartphone,
  Sofa,
  Sparkles,
  ToyBrick,
  type LucideIcon,
} from 'lucide-react'

// ── Famílias de cor (nome + hex) ────────────────────────────────────────────
export const COLOR_FAMILIES: { family: string; colors: [string, string][] }[] = [
  {
    family: 'Neutros',
    colors: [
      ['Preto', '#000000'],
      ['Cinza', '#6B7280'],
      ['Prata', '#9CA3AF'],
      ['Platina', '#E5E4E2'],
      ['Branco', '#FFFFFF'],
      ['Off White', '#FAFAFA'],
      ['Creme', '#FFFDD0'],
      ['Bege', '#F5F5DC'],
      ['Nude', '#E3BC9A'],
      ['Camel', '#C19A6B'],
    ],
  },
  {
    family: 'Marrons & terrosos',
    colors: [
      ['Marrom Escuro', '#78350F'],
      ['Marrom', '#92400E'],
      ['Café', '#6F4518'],
      ['Chocolate', '#5C4033'],
      ['Marrom Claro', '#A16207'],
      ['Cobre', '#B45309'],
      ['Caramelo', '#D97706'],
      ['Terracota', '#C2410C'],
      ['Bronze', '#CD7F32'],
    ],
  },
  {
    family: 'Azuis',
    colors: [
      ['Azul Escuro', '#1E3A8A'],
      ['Azul Marinho', '#1E40AF'],
      ['Índigo', '#4F46E5'],
      ['Azul Royal', '#2563EB'],
      ['Azul', '#3B82F6'],
      ['Azul Céu', '#0EA5E9'],
      ['Azul Turquesa', '#06B6D4'],
      ['Ciano', '#06B6D4'],
      ['Turquesa', '#14B8A6'],
      ['Azul Claro', '#93C5FD'],
    ],
  },
  {
    family: 'Vermelhos',
    colors: [
      ['Vinho', '#7F1D1D'],
      ['Bordeaux', '#991B1B'],
      ['Vermelho Escuro', '#DC2626'],
      ['Vermelho', '#EF4444'],
      ['Vermelho Claro', '#F87171'],
      ['Coral', '#FF7F50'],
      ['Salmão', '#FA8072'],
    ],
  },
  {
    family: 'Verdes',
    colors: [
      ['Verde Escuro', '#059669'],
      ['Verde Esmeralda', '#059669'],
      ['Verde Oliva', '#65A30D'],
      ['Verde', '#10B981'],
      ['Verde Lima', '#84CC16'],
      ['Verde Claro', '#6EE7B7'],
      ['Verde Menta', '#A7F3D0'],
    ],
  },
  {
    family: 'Amarelos & laranjas',
    colors: [
      ['Amarelo Ouro', '#F59E0B'],
      ['Dourado', '#F59E0B'],
      ['Amarelo', '#FBBF24'],
      ['Amarelo Claro', '#FDE047'],
      ['Laranja Queimado', '#EA580C'],
      ['Laranja', '#F97316'],
      ['Abricó', '#FFB347'],
      ['Pêssego', '#FFE5B4'],
    ],
  },
  {
    family: 'Rosas & roxos',
    colors: [
      ['Roxo Escuro', '#6D28D9'],
      ['Púrpura', '#9333EA'],
      ['Violeta', '#7C3AED'],
      ['Roxo', '#8B5CF6'],
      ['Magenta', '#D946EF'],
      ['Rosa Choque', '#DB2777'],
      ['Rosa', '#EC4899'],
      ['Lilás', '#D8B4FE'],
      ['Lavanda', '#C4B5FD'],
      ['Rosa Claro', '#F9A8D4'],
      ['Rosa Bebê', '#FBCFE8'],
    ],
  },
]

const COLOR_HEX: Record<string, string> = {}
COLOR_FAMILIES.forEach((f) =>
  f.colors.forEach(([name, hex]) => {
    COLOR_HEX[name] = hex
  }),
)

export function getColorHex(name: string): string {
  return COLOR_HEX[name] || '#6B7280'
}

// luminância — decide ring/contraste em swatches claros
export function colorLuma(hex: string): number {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

// ── Ícone por nicho (slug → Lucide) ─────────────────────────────────────────
const NICHE_ICONS: Record<string, LucideIcon> = {
  roupas: Shirt,
  'sapatos-calcados': Footprints,
  acessorios: Glasses,
  'cosmeticos-beleza': Sparkles,
  eletronicos: Smartphone,
  'casa-decoracao': Sofa,
  'esportes-fitness': Dumbbell,
  'livros-papelaria': BookOpen,
  'brinquedos-infantil': ToyBrick,
  alimentacao: Apple,
  'pet-shop': PawPrint,
  'saude-suplementos': Pill,
  'joias-semijoias': Gem,
  'bebes-maternidade': Baby,
  automotivo: Car,
}

export function getNicheIcon(slug: string): LucideIcon {
  return NICHE_ICONS[slug] || Package
}

// ── Helpers de moeda BRL (lógica do topo de sections.jsx) ────────────────────
// Aceitam o formato brasileiro "1.234,56". formatPrice/formatCurrency de
// src/lib/utils.ts assumem ponto decimal e não cobrem esses casos, por isso
// estes helpers vivem aqui (fonte canônica do fluxo de produto).
const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatBRL(v: string | number | null | undefined): string {
  const n = typeof v === 'string' ? parseFloat(v.replace(/\./g, '').replace(',', '.')) : v
  if (!n && n !== 0) return '—'
  return BRL.format(n || 0)
}

export function parseBRL(s: string | number | null | undefined): number {
  if (s == null) return 0
  const n = parseFloat(String(s).replace(/\./g, '').replace(',', '.'))
  return isNaN(n) ? 0 : n
}

// ── Slug a partir de texto (nome do produto / loja) ──────────────────────────
// Usado para montar a URL de preview da vitrine.
export function slugify(s: string | null | undefined): string {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
