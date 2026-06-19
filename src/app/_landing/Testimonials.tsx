import Image from 'next/image'
import { Star } from 'lucide-react'
import s from '../landing.module.css'
import { TESTIMONIALS } from './data'

export function Testimonials() {
  return (
    <section className={s.section}>
      <div className={s.container}>
        <div className={s.tcHeading} data-rev>
          <span className={s.eyebrow}><span className={s.dot} />Depoimentos</span>
          <h2 className={`${s.hSection} ${s.sectionTitle}`}>
            Quem já usa o Nexo fala por si
          </h2>
        </div>

        <div className={s.tcards}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={s.tcard} data-rev>
              <div className={s.tcardStars}>
                {Array.from({length: t.rating}).map((_, j) => (
                  <Star key={j} size={14} fill="currentColor" />
                ))}
              </div>
              <p className={s.tcardQuote}>{t.quote}</p>
              <div className={s.tcardAuthor}>
                <Image
                  src={t.img}
                  alt={t.name}
                  width={42}
                  height={42}
                  className={s.tcardImg}
                />
                <div>
                  <div className={s.tcardName}>{t.name}</div>
                  <div className={s.tcardRole}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
