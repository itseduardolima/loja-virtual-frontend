import Link from 'next/link'
import s from '../landing.module.css'

export const FinalCTA = () => (
  <div className={s.ctaBand}>
    <svg
      className={s.ctaThreads}
      viewBox="0 0 1440 340"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M-100,120 C 260,40 480,220 760,140 S 1300,40 1560,150"
        stroke="#fff"
        strokeWidth="1.4"
        fill="none"
      />
      <path
        d="M-100,220 C 220,280 520,120 820,230 S 1280,280 1560,200"
        stroke="#fff"
        strokeWidth="1.4"
        fill="none"
      />
    </svg>
    <div className={s.wrap}>
      <h2 className={s.ctaH2}>
        Sua loja no ar hoje.
        <br />
        Do celular mesmo.
      </h2>
      <p className={s.ctaSub}>
        Em 10 minutos você monta sua loja e já começa a vender, do celular mesmo. Pergunte sobre
        período de teste no chat.
      </p>
      <div className={s.ctaBtnWrap}>
        <Link href="/assinatura" className={`${s.btn} ${s.btnLg} ${s.ctaBtn}`}>
          Criar minha loja agora
        </Link>
      </div>
    </div>
  </div>
)
