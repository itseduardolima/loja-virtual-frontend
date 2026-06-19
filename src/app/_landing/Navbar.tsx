'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ArrowRight } from 'lucide-react'
import s from '../landing.module.css'

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className={s.nav}>
        <div className={s.container}>
          <div className={s.navInner}>
            <Link href="/" className={s.logo}>
              <span className={s.logoMark}>N</span>
              nexo
            </Link>

            <div className={s.navLinks}>
              <a href="#recursos">Recursos</a>
              <a href="#como">Como funciona</a>
              <a href="#precos">Planos</a>
              <a href="#faq">FAQ</a>
            </div>

            <div className={s.navActions}>
              <div className={s.navActionsDesktop}>
                <Link href="/login" className={s.navLogin}>Entrar</Link>
                <Link href="/assinatura" className={`${s.btn} ${s.btnPrimary}`}>
                  Criar loja <ArrowRight size={15} />
                </Link>
              </div>
              <button
                className={s.burger}
                aria-label="Menu"
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className={`${s.mobileMenu} ${open ? s.mobileMenuOpen : ''}`}>
        <a href="#recursos" onClick={() => setOpen(false)}>Recursos</a>
        <a href="#como" onClick={() => setOpen(false)}>Como funciona</a>
        <a href="#precos" onClick={() => setOpen(false)}>Planos</a>
        <a href="#faq" onClick={() => setOpen(false)}>FAQ</a>
        <Link href="/login" onClick={() => setOpen(false)}>Entrar</Link>
        <Link href="/assinatura" onClick={() => setOpen(false)} className={`${s.btn} ${s.btnPrimary}`}>
          Criar loja grátis
        </Link>
      </div>
    </>
  )
}
