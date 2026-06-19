import { Check, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import s from '../landing.module.css'

const ROWS = [
  { feature: 'Mensalidade', nexo: 'A partir de R$29,90', nuvem: 'A partir de R$49,00', shopify: 'A partir de R$109,00', isPrice: true },
  { feature: 'Taxa de transação', nexo: '0%', nuvem: '0–2%', shopify: '0.5–2%' },
  { feature: 'Suporte em português', nexo: true, nuvem: true, shopify: false },
  { feature: 'Pagamento Pix nativo', nexo: true, nuvem: true, shopify: false },
  { feature: 'Design mobile-first', nexo: true, nuvem: true, shopify: true },
  { feature: 'Perguntas no produto', nexo: true, nuvem: false, shopify: false },
  { feature: 'Exportar pedidos (XLS)', nexo: true, nuvem: false, shopify: true },
  { feature: 'Integração Bling ERP', nexo: true, nuvem: true, shopify: false },
  { feature: 'Domínio próprio', nexo: 'Plano Max', nuvem: 'Plano pago', shopify: 'Plano pago' },
]

function Cell({ val, isPrice }: { val: string | boolean, isPrice?: boolean }) {
  if (typeof val === 'boolean') {
    return val
      ? <Check size={16} className={s.compCheck} />
      : <X size={16} className={s.compX} />
  }
  if (isPrice) return <span>{val}</span>
  return <span>{val}</span>
}

export function ComparisonTable() {
  return (
    <section className={`${s.section} ${s.bgGradSoft}`}>
      <div className={s.container}>
        <div className={s.compHeading} data-rev>
          <span className={s.eyebrow}><span className={s.dot} />Comparativo</span>
          <h2 className={`${s.hSection} ${s.sectionTitle}`}>
            Nexo vs as outras plataformas
          </h2>
          <p className={`${s.lede} ${s.sectionSubtitle}`}>
            Mais completo, mais barato e com suporte real em português.
          </p>
        </div>

        <div className={s.compWrap} data-rev>
          <div className={`${s.compRow} ${s.compRowHead}`}>
            <div className={`${s.compCell} ${s.compCellHead}`}>Recurso</div>
            <div className={`${s.compCell} ${s.compCellNexoHead}`}>Nexo</div>
            <div className={`${s.compCell} ${s.compCellHead}`}>Nuvemshop</div>
            <div className={`${s.compCell} ${s.compCellHead}`}>Shopify</div>
          </div>
          {ROWS.map((row, i) => (
            <div key={i} className={s.compRow}>
              <div className={`${s.compCell} ${s.compCellFeature}`}>{row.feature}</div>
              <div className={`${s.compCell} ${s.compCellNexo}`}>
                <Cell val={row.nexo} isPrice={row.isPrice} />
              </div>
              <div className={s.compCell}><Cell val={row.nuvem} isPrice={row.isPrice} /></div>
              <div className={s.compCell}><Cell val={row.shopify} isPrice={row.isPrice} /></div>
            </div>
          ))}
        </div>

        <p className={s.compFootnote}>
          * Preços consultados em junho/2026. Taxas de gateway não incluídas.
        </p>

        <div className={s.compCta}>
          <Link href="/assinatura" className={`${s.btn} ${s.btnPrimary} ${s.btnLg}`}>
            Começar com Nexo <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  )
}
