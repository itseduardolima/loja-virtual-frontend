import { Heart, Star } from 'lucide-react'
import v from './vitrine.module.css'

interface DemoProduct {
  id: string
  name: string
  price: string
  oldPrice?: string
  discount?: string
  rating: number
  reviews: number
  featured?: boolean
  fill: [string, string]
  silhouette: 'dress' | 'shirt' | 'shoe' | 'blazer'
}

const PRODUCTS: DemoProduct[] = [
  {
    id: 'vestido-midi-linho',
    name: 'Vestido midi linho',
    price: 'R$ 189,90',
    oldPrice: 'R$ 229',
    discount: '-17%',
    rating: 5,
    reviews: 23,
    featured: true,
    fill: ['#fceae1', '#e8642c'],
    silhouette: 'dress',
  },
  {
    id: 'tenis-branco-classic',
    name: 'Tênis branco classic',
    price: 'R$ 229,00',
    rating: 5,
    reviews: 11,
    fill: ['#eef0fb', '#2a2d7c'],
    silhouette: 'shoe',
  },
  {
    id: 'camisa-social-slim',
    name: 'Camisa social slim',
    price: 'R$ 139,00',
    rating: 5,
    reviews: 6,
    fill: ['#e9f3ee', '#3f8a66'],
    silhouette: 'shirt',
  },
  {
    id: 'blazer-alfaiataria',
    name: 'Blazer alfaiataria',
    price: 'R$ 259,00',
    oldPrice: 'R$ 319',
    discount: '-19%',
    rating: 5,
    reviews: 18,
    fill: ['#f6e2e9', '#c7861a'],
    silhouette: 'blazer',
  },
]

const SILHOUETTES: Record<DemoProduct['silhouette'], JSX.Element> = {
  dress: (
    <path
      d="M44 18 L34 34 L40 40 L44 34 L44 76 Q44 82 50 82 Q56 82 56 76 L56 34 L60 40 L66 34 L56 18 Z"
      fill="#fff"
      opacity={0.85}
    />
  ),
  shoe: (
    <path
      d="M24 58 Q24 48 34 46 L58 42 Q66 40 70 46 L76 56 Q78 60 74 62 L28 64 Q22 64 24 58 Z"
      fill="#fff"
      opacity={0.85}
    />
  ),
  shirt: (
    <path
      d="M40 22 L28 30 L32 40 L38 36 L38 78 Q38 82 42 82 L58 82 Q62 82 62 78 L62 36 L68 40 L72 30 L60 22 Q56 28 50 28 Q44 28 40 22 Z"
      fill="#fff"
      opacity={0.85}
    />
  ),
  blazer: (
    <path
      d="M38 20 L26 30 L31 42 L38 37 L38 80 Q38 84 42 84 L58 84 Q62 84 62 80 L62 37 L69 42 L74 30 L62 20 L50 34 Z"
      fill="#fff"
      opacity={0.85}
    />
  ),
}

function ProductTile({ product }: { product: DemoProduct }) {
  const [from, to] = product.fill
  return (
    <div className={v.card}>
      <div
        className={v.imgWrap}
        style={{ background: `linear-gradient(140deg, ${from}, ${to})` }}
      >
        {product.featured && <span className={v.badge}>Em destaque</span>}
        <span className={v.heart}>
          <Heart size={13} color="#535a6e" />
        </span>
        <svg width="72" height="72" viewBox="0 0 100 100" aria-hidden="true">
          {SILHOUETTES[product.silhouette]}
        </svg>
      </div>
      <div className={v.body}>
        <div className={v.stars}>
          <span className={v.starRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={10}
                fill={i < product.rating ? '#e8a93b' : 'none'}
                color={i < product.rating ? '#e8a93b' : '#d8d8d8'}
              />
            ))}
          </span>
          <span className={v.reviewCount}>
            {product.rating.toFixed(1)} ({product.reviews})
          </span>
        </div>
        <div className={v.name}>{product.name}</div>
        <div className={v.priceRow}>
          <span className={v.price}>{product.price}</span>
          {product.oldPrice && <span className={v.oldPrice}>{product.oldPrice}</span>}
          {product.discount && <span className={v.off}>{product.discount}</span>}
        </div>
      </div>
    </div>
  )
}

export const Vitrine = () => (
  <section className={v.sec}>
    <div className={v.wrap}>
      <div className={v.layout}>
        <div className={v.text}>
          <h2 className={v.heading}>Sua vitrine tem cara de loja de verdade.</h2>
          <p className={v.lead}>
            Fotos, variação de cor e tamanho, avaliação: o mesmo padrão de loja grande,
            na sua marca.
          </p>
          <a href="#precos" className={v.cta}>
            Ver planos →
          </a>
        </div>
        <div className={v.grid}>
          {PRODUCTS.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  </section>
)
