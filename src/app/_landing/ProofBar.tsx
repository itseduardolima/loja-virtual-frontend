import Image from 'next/image'
import s from '../landing.module.css'

const SELLERS = [
  { name: 'Moda Sol', city: 'Fortaleza · CE', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120&q=80&fit=crop' },
  { name: 'Passo Certo Calçados', city: 'Novo Hamburgo · RS', img: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=120&q=80&fit=crop' },
  { name: 'Brechó da Lia', city: 'Belo Horizonte · MG', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=120&q=80&fit=crop' },
  { name: 'Use Aurora', city: 'São Paulo · SP', img: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=120&q=80&fit=crop' },
]

export const ProofBar = () => (
  <div className={s.proofbar}>
    <div className={`${s.wrap} ${s.proofbarIn}`} data-rev>
      <div className={s.proofLabel}>Lojas de moda e calçados em todo o Brasil</div>
      <div className={s.proofSellers}>
        {SELLERS.map((seller) => (
          <div key={seller.name} className={s.seller}>
            <Image src={seller.img} alt={seller.name} width={40} height={40} className={s.sellerImg} />
            <div>
              <div className={s.sellerName}>{seller.name}</div>
              <div className={s.sellerCity}>{seller.city}</div>
            </div>
          </div>
        ))}
      </div>
      <div className={s.rating}>
        <span className={s.stars}>★★★★★</span>
        4,9/5 · 380 avaliações
      </div>
    </div>
  </div>
)
