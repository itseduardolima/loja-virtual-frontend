'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import s from '../landing.module.css'

const FAQS = [
  {q:'Preciso de computador para usar?',a:'Não. Todo o painel foi pensado para funcionar no celular. Você gerencia pedidos, cadastra produtos e acompanha vendas pelo iPhone ou Android.'},
  {q:'Tem taxa por venda?',a:'Nenhuma. Você paga só a mensalidade do plano, e o dinheiro das suas vendas nunca passa pela Nexo.'},
  {q:'Como funciona o pagamento dos clientes?',a:'Seu cliente escolhe as peças na loja e o pedido chega organizado no seu painel. O pagamento (Pix, cartão ou combinado) é acertado direto com você pelo WhatsApp: o dinheiro vai direto pra sua mão, sem intermediário.'},
  {q:'Consigo migrar de outra plataforma?',a:'Sim. Importamos seu catálogo (CSV ou manualmente) e o time ajuda na migração sem custo.'},
  {q:'Posso cancelar quando quiser?',a:'Sim, a qualquer momento pelo painel, sem multa. Você usa até o fim do período já pago.'},
  {q:'O suporte é em português?',a:'Sim, chat em português de segunda a sexta, das 9h às 19h. No plano Max, o suporte é prioritário.'},
]

export const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section className={s.sec} id="suporte">
      <div className={s.wrap}>
        <div className={s.secHead}>
          <div className={s.eyebrow}>Dúvidas</div>
          <h2 className={s.h2}>Perguntas frequentes</h2>
        </div>
        <div className={s.faq}>
          {FAQS.map((f, i) => (
            <div key={i} className={s.faqItem}>
              <button className={s.faqQ} onClick={() => setOpen(open === i ? null : i)} type="button">
                {f.q}
                <span className={open === i ? `${s.faqChev} ${s.faqChevOpen}` : s.faqChev}>
                  <ChevronDown size={20} color="var(--t3)" />
                </span>
              </button>
              {open === i && <div className={s.faqA}>{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
