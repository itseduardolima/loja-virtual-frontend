import Image from 'next/image'
import { Star } from 'lucide-react'
import s from '../landing.module.css'
import { PROOF_SELLERS } from './data'

export function ProofBar() {
  return (
    <div className={s.proofBar}>
      <div className={s.container}>
        <div className={s.proofBarInner}>
          <div className={s.proofFaces}>
            {PROOF_SELLERS.map((seller, i) => (
              <Image
                key={i}
                src={seller.img}
                alt={seller.name}
                width={34}
                height={34}
                className={s.proofFaceImg}
              />
            ))}
          </div>
          <span className={s.proofLabel}>
            <strong>+500 vendedores</strong> já usam o Nexo
          </span>

          <span className={s.proofDivider} />

          <div className={s.proofStars}>
            {[1,2,3,4,5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
            <span className={s.proofStarsLabel}>4.9 / 5</span>
          </div>

          <span className={s.proofDivider} />

          <div className={s.proofStat}>
            <div className={s.proofStatVal}>0%</div>
            <div className={s.proofStatLabel}>taxa de transação</div>
          </div>

          <span className={s.proofDivider} />

          <div className={s.proofStat}>
            <div className={s.proofStatVal}>5 min</div>
            <div className={s.proofStatLabel}>do cadastro à loja no ar</div>
          </div>
        </div>
      </div>
    </div>
  )
}
