import { LayoutGrid, ClipboardList, Store } from 'lucide-react'
import s from '../landing.module.css'

const CARDS = [
  { icon: <LayoutGrid size={20} color="var(--ind)" />, title: 'Catálogo organizado', desc: 'Suas peças por categoria, com foto, preço e variações, fácil do cliente achar e escolher.' },
  { icon: <ClipboardList size={20} color="var(--ind)" />, title: 'Gestão dos pedidos', desc: 'Tudo num painel: o que entrou, o que falta enviar e o que já foi entregue. Sem planilha.' },
  { icon: <Store size={20} color="var(--ind)" />, title: 'Sua loja, sua marca', desc: 'Um link só seu pra mandar no WhatsApp e no Instagram. O cliente é seu, não da plataforma.' },
]

export const Posicionamento = () => (
  <section className={s.sec} style={{padding:'64px 0px'}}>
    <div className={s.wrap}>
      <div style={{maxWidth:'760px',margin:'0 auto',textAlign:'center'}}>
        <div className={s.eyebrow}>Pra quem é o Nexo</div>
        <h2 className={s.h2} style={{marginTop:'10px'}}>Feito pra quem vende pro cliente local.</h2>
        <p className={s.lead} style={{marginTop:'12px'}}>O Nexo organiza e mostra o seu catálogo do jeito certo e cuida da gestão dos seus pedidos. Não é um marketplace gigante como Shein ou Shopee — é a <b style={{color:'var(--t1)'}}>sua loja</b>, com os <b style={{color:'var(--t1)'}}>seus clientes</b> do bairro, da cidade e das suas redes.</p>
      </div>
      <div className={s.posGrid}>
        {CARDS.map((c) => (
          <div key={c.title} className={s.posCard}>
            <span className={s.posIcon}>{c.icon}</span>
            <div className={s.posTitle}>{c.title}</div>
            <p className={s.posDesc}>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)
