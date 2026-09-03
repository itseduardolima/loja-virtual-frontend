import s from '../landing.module.css'

const SPECS = [
  {
    label: 'Catálogo organizado',
    desc: 'Suas peças por categoria, com foto, preço e variações, fácil do cliente achar e escolher.',
  },
  {
    label: 'Gestão dos pedidos',
    desc: 'Tudo num painel: o que entrou, o que falta enviar e o que já foi entregue. Sem planilha.',
  },
  {
    label: 'Sua loja, sua marca',
    desc: 'Um link só seu pra mandar no WhatsApp e no Instagram. O cliente é seu, não da plataforma.',
  },
]

export const Posicionamento = () => (
  <section className={s.sec}>
    <div className={s.seam} />
    <div className={s.wrap}>
      <div className={s.posLayout}>
        <div>
          <h2 className={s.h2}>A loja é sua. Os clientes também.</h2>
          <p className={s.lead}>
            O Nexo organiza seu catálogo e cuida da gestão dos pedidos: não é um marketplace
            gigante, é a sua loja, com os seus clientes do bairro, da cidade e das suas redes.
          </p>
        </div>
        <div className={s.posSpecs}>
          {SPECS.map((spec) => (
            <div key={spec.label} className={s.posSpec}>
              <div className={s.posSpecLabel}>{spec.label}</div>
              <p className={s.posSpecDesc}>{spec.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)
