import { Check } from 'lucide-react'
import s from '../landing.module.css'

export const ComparisonTable = () => (
  <section className={`${s.sec} ${s.bgWht}`}>
    <div className={s.wrap}>
      <div className={s.secHead}>
        <div className={s.eyebrow}>Comparativo</div>
        <h2 className={s.h2}>Mais barato e com mais incluso</h2>
      </div>
      <div className={s.cmp}>
        <div className={s.cmpScroll}>
          <table>
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th className={s.colNexo}>Nexo Básico</th>
                <th className={s.colNexo}>Nexo Pro</th>
                <th>Nuvemshop Start</th>
                <th>Shopify Basic</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={s.rowLabel}>Preço por mês</td>
                <td className={s.colNexo}>R$ 29,90</td>
                <td className={s.colNexo}>R$ 79,90</td>
                <td>R$ 69,00</td>
                <td>~R$ 160,00</td>
              </tr>
              <tr>
                <td className={s.rowLabel}>Taxa por venda</td>
                <td className={s.colNexo}>0%</td>
                <td className={s.colNexo}>0%</td>
                <td>1%</td>
                <td>2%</td>
              </tr>
              <tr>
                <td className={s.rowLabel}>Suporte em português</td>
                <td className={s.colNexo}><Check size={19} color="var(--ind)" /></td>
                <td className={s.colNexo}><Check size={19} color="var(--ind)" /></td>
                <td>Limitado</td>
                <td>Bot/inglês</td>
              </tr>
              <tr>
                <td className={s.rowLabel}>Admin no celular</td>
                <td className={s.colNexo}><Check size={19} color="var(--ind)" /></td>
                <td className={s.colNexo}><Check size={19} color="var(--ind)" /></td>
                <td>Parcial</td>
                <td>Parcial</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={s.cmpNote}>
          <Check size={20} color="var(--emr)" />
          Sem taxa de transação em nenhum plano.
        </div>
      </div>
    </div>
  </section>
)
