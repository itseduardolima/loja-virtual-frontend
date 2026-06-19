import s from '../landing.module.css'
import { HOW_IT_WORKS_STEPS } from './data'

export function HowItWorks() {
  return (
    <section id="como" className={`${s.section} ${s.bgGradSoft}`}>
      <div className={s.container}>
        <div className={s.stepsHeading} data-rev>
          <span className={s.eyebrow}><span className={s.dot} />3 passos</span>
          <h2 className={`${s.hSection} ${s.sectionTitle}`}>
            Da ideia ao primeiro pedido em menos de 10 minutos
          </h2>
        </div>

        <div className={s.steps}>
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div key={step.number} className={s.step} data-rev>
              <div className={s.stepTop}>
                <span className={s.stepNum}>{step.number}</span>
                <span className={s.stepDuration}>{step.duration}</span>
              </div>
              <div className={s.stepEmoji}>{step.emoji}</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
