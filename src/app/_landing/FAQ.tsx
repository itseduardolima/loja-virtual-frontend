'use client'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { animate } from 'animejs'
import { ChevronDown } from 'lucide-react'
import s from '../landing.module.css'
import { fadeUp, staggerContainer, viewportOnce } from './motion'

const FAQS = [
  {q:'Preciso de computador para usar?',a:'Não. Todo o painel foi pensado para funcionar no celular. Você gerencia pedidos, cadastra produtos e acompanha vendas pelo iPhone ou Android.'},
  {q:'Tem taxa por venda?',a:'Nenhuma. Você paga só a mensalidade do plano, e o dinheiro das suas vendas nunca passa pela Nexo.'},
  {q:'Como funciona o pagamento dos clientes?',a:'O cliente finaliza o pedido na sua loja e o pagamento (Pix, cartão ou combinado) você acerta direto com ele pelo WhatsApp: sem intermediário, sem taxa da Nexo.'},
  {q:'Consigo migrar de outra plataforma?',a:'Sim. Importamos seu catálogo (CSV ou manualmente) e o time ajuda na migração sem custo.'},
  {q:'Posso cancelar quando quiser?',a:'Sim, a qualquer momento pelo painel, sem multa. Você usa até o fim do período já pago.'},
  {q:'O suporte é em português?',a:'Sim, chat em português de segunda a sexta, das 9h às 19h. No plano Max, o suporte é prioritário.'},
]

export const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null)
  const answerRefs = useRef<Array<HTMLDivElement | null>>([])

  const closeItem = (i: number) => {
    const el = answerRefs.current[i]
    if (!el) return
    const from = el.getBoundingClientRect().height
    animate(el, { height: [from, 0], opacity: [1, 0], duration: 260, ease: 'inOutQuad' })
  }

  const openItem = (i: number) => {
    const el = answerRefs.current[i]
    if (!el) return
    el.style.height = 'auto'
    const target = el.getBoundingClientRect().height
    el.style.height = '0px'
    animate(el, {
      height: [0, target],
      opacity: [0, 1],
      duration: 320,
      ease: 'outQuart',
      onComplete: () => {
        el.style.height = 'auto'
      },
    })
  }

  const toggle = (i: number) => {
    if (open === i) {
      closeItem(i)
      setOpen(null)
      return
    }
    if (open !== null) closeItem(open)
    openItem(i)
    setOpen(i)
  }

  return (
    <section className={s.sec} id="suporte">
      <div className={s.wrap}>
        <motion.div
          className={s.secHead}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <span className={s.eyebrow}>
            <span className={s.dot} />
            Dúvidas
          </span>
          <h2 className={s.display}>O que você ainda precisa saber.</h2>
        </motion.div>
        <motion.div
          className={s.faq}
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {FAQS.map((f, i) => (
            <motion.div key={i} className={s.faqItem} variants={fadeUp}>
              <button className={s.faqQ} onClick={() => toggle(i)} type="button">
                {f.q}
                <span className={open === i ? `${s.faqChev} ${s.faqChevOpen}` : s.faqChev}>
                  <ChevronDown size={18} color="#000" />
                </span>
              </button>
              <div
                ref={(el) => {
                  answerRefs.current[i] = el
                }}
                className={s.faqA}
                style={{ height: 0, opacity: 0, overflow: 'hidden' }}
              >
                {f.a}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
