'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import s from '../landing.module.css'

const LINKS = [
  { href: '#recursos', label: 'Recursos', id: 'recursos' },
  { href: '#precos', label: 'Preços', id: 'precos' },
  { href: '#suporte', label: 'Suporte', id: 'suporte' },
]

export const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const ids = LINKS.map((l) => l.id)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <nav className={s.nav}>
      <div className={`${s.wrap} ${s.navIn}`}>
        <Link href="/" className={s.logo}>
          <span className={s.logoMark}>N</span>nexo
        </Link>
        <div className={s.navLinks}>
          {LINKS.map((link) => (
            <a key={link.id} href={link.href} className={active === link.id ? s.navLinkActive : ''}>
              {link.label}
            </a>
          ))}
        </div>
        <div className={s.navCta}>
          <Link href="/login" className={`${s.btn} ${s.btnGhost}`}>
            Entrar
          </Link>
          <Link href="#precos" className={`${s.btn} ${s.btnPri}`} style={{ height: '44px' }}>
            Ver planos
          </Link>
        </div>
        <button
          className={s.burger}
          onClick={() => setOpen((o) => !o)}
          type="button"
          aria-label="Menu"
        >
          {open ? <X size={22} color="#0F172A" /> : <Menu size={22} color="#0F172A" />}
        </button>
      </div>
      {open && (
        <div className={s.mobileMenu}>
          {LINKS.map((link) => (
            <a key={link.id} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <div className={s.mmCta}>
            <Link
              href="#precos"
              className={`${s.btn} ${s.btnPri}`}
              onClick={() => setOpen(false)}
              style={{ color: 'var(--wht)' }}
            >
              Ver planos
            </Link>
            <Link href="/login" className={`${s.btn} ${s.btnOutline}`} style={{ height: '48px' }}>
              Entrar
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
