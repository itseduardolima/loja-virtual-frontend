'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Heart, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import s from '../landing.module.css'
import { fadeUp, staggerContainer, viewportOnce } from './motion'

/**
 * Cards de produto da vitrine seguem a mesma estrutura visual do ProductCard real
 * (src/components/Product/ProductCard.tsx): Card + CardContent do shadcn, badge
 * "Em destaque", estrelas + contagem de avaliações, preço via formatPrice. A imagem
 * usa next/image direto (não buildImageUrl) porque são ilustrações estáticas do
 * catálogo de demonstração, não fotos vindas da API de produtos.
 */
interface DemoProduct {
  id: string
  name: string
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  featured?: boolean
  gradient: [string, string]
  image: string
}

const PRODUCTS: DemoProduct[] = [
  {
    id: 'tv-retro-vintage',
    name: 'TV retrô vintage',
    price: 279,
    rating: 5,
    reviews: 27,
    gradient: ['#F3D9EC', '#E3A9D6'],
    image: '/landing/retro-tv.png',
  },
  {
    id: 'computador-desktop-retro',
    name: 'Computador desktop retrô',
    price: 899,
    rating: 5,
    reviews: 19,
    gradient: ['#DCEAFB', '#AFC8ED'],
    image: '/landing/personal-computer.png',
  },
  {
    id: 'fone-gamer-premium',
    name: 'Fone gamer premium',
    price: 249,
    rating: 5,
    reviews: 43,
    gradient: ['#EDE3FB', '#C9AEF0'],
    image: '/landing/headphone.png',
  },
  {
    id: 'controle-sem-fio',
    name: 'Controle sem fio',
    price: 199,
    oldPrice: 249,
    rating: 4,
    reviews: 31,
    gradient: ['#DCEBFB', '#A9CDF2'],
    image: '/landing/joystick.png',
  },
]

function ProductTile({ product }: { product: DemoProduct }) {
  const [from, to] = product.gradient
  const discountPct = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : null

  return (
    <motion.div variants={fadeUp}>
      <Card className="group relative overflow-hidden shadow-none bg-transparent border-0 rounded-b-none flex flex-col">
        <CardContent className="p-0 flex rounded-b-none flex-col gap-2 h-full shadow-none bg-transparent">
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-2xl flex items-center justify-center"
            style={{ background: `linear-gradient(160deg, ${from}, ${to})` }}
          >
            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
              {product.featured && <Badge>Em destaque</Badge>}
            </div>
            <div className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm">
              <Heart className="h-4 w-4 text-gray-400" />
            </div>
            <Image
              src={product.image}
              alt={product.name}
              width={700}
              height={700}
              style={{ width: '74%', height: '74%', objectFit: 'contain' }}
            />
          </div>

          <div className="px-3 pb-3 space-y-1">
            <h3 className="font-bold text-sm sm:text-base text-gray-900 line-clamp-2 leading-tight">
              {product.name}
            </h3>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${star <= product.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.reviews})</span>
            </div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <>
                  <span className="text-xs text-gray-400 line-through font-medium">
                    {formatPrice(product.oldPrice)}
                  </span>
                  <Badge className="bg-[#FF3333]/10 text-[#FF3333] px-1.5 py-0.5 text-[10px] font-medium">
                    -{discountPct}%
                  </Badge>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export const Vitrine = () => (
  <section className={s.sec}>
    <div className={s.wrap}>
      <motion.div
        className={`${s.splitHead} ${s.splitHeadImgRight}`}
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <motion.div className={s.splitHeadText} variants={fadeUp}>
          <span className={s.eyebrow}>
            <span className={s.dot} />
            Vitrine
          </span>
          <h2 className={s.display}>Sua vitrine tem cara de loja de verdade.</h2>
          <p className={s.lead}>
            Cada produto com foto, preço e avaliação — igual o cliente já espera ver numa loja de
            verdade, não numa lista de figurinha no WhatsApp.
          </p>
        </motion.div>
        <motion.div className={s.illusFrame} variants={fadeUp}>
          <Image
            src="/landing/man-doing-online-home-shopping.svg"
            alt="Cliente navegando pela vitrine de casa, no computador, cercado de plantas"
            width={987}
            height={818}
          />
        </motion.div>
      </motion.div>
      <motion.div
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        {PRODUCTS.map((product) => (
          <ProductTile key={product.id} product={product} />
        ))}
      </motion.div>
    </div>
  </section>
)
