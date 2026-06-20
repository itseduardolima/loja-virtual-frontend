import s from '../landing.module.css'

export const HowItWorks = () => (
  <section className={s.sec} id="como-funciona">
    <div className={s.wrap}>
      <div className={s.secHead} data-rev>
        <div className={s.eyebrow}>Como funciona</div>
        <h2 className={s.h2}>Sua loja no ar em 3 passos</h2>
      </div>
      <div className={s.steps}>
        <div className={s.step} data-rev>
          <div className={s.stepTop}>
            <span className={s.stepNum}>1</span>
            <span className={s.stepLabel}>~2 min</span>
          </div>
          <h3>Crie sua conta e escolha o plano</h3>
          <p>Cadastro simples: escolhe Básico, Pro ou Max e paga com Pix na hora. Aí seu painel de vendedor libera.</p>
        </div>
        <div className={s.step} data-rev>
          <div className={s.stepTop}>
            <span className={s.stepNum}>2</span>
            <span className={s.stepLabel}>~8 min</span>
          </div>
          <h3>Monte sua loja do celular</h3>
          <p>Adicione produtos com fotos, defina preços e variações de tamanho e cor, configure a entrega. Sem computador.</p>
        </div>
        <div className={s.step} data-rev>
          <div className={s.stepTop}>
            <span className={s.stepNum}>3</span>
            <span className={s.stepLabelEmr}>venda 24h</span>
          </div>
          <h3>Compartilhe e venda</h3>
          <p>Envie o link da loja pelo WhatsApp e Instagram. Os pedidos chegam no painel e o Pix cai direto na sua conta.</p>
        </div>
      </div>
    </div>
  </section>
)
