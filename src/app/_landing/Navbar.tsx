'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogOut, Menu, X, ArrowRight } from 'lucide-react'
import s from '../landing.module.css'
import { useAuth } from '@/contexts/AuthContext'
import { PROFILE_ROUTES } from '@/types/auth'

const LINKS = [
  { href: '#recursos', label: 'Recursos', id: 'recursos' },
  { href: '#precos', label: 'Preços', id: 'precos' },
  { href: '#suporte', label: 'Suporte', id: 'suporte' },
]

export const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const { user, isAuthenticated, isLoading: isLoadingAuth, logout } = useAuth()
  const dashboardHref = user ? PROFILE_ROUTES[user.profile] : '/'
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
      setOpen(false)
    }
  }

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
    <div className={s.navbar}>
      <nav className={`${s.navPill} ${s.wrap}`}>
        <Link href="/" className={s.logo}>
          <span className={s.logoMark}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15l8-9 8 9" />
            </svg>
          </span>
          nexo
        </Link>
        <div className={s.navLinks}>
          {LINKS.map((link) => (
            <a key={link.id} href={link.href} className={active === link.id ? s.navLinkActive : ''}>
              {link.label}
            </a>
          ))}
        </div>
        <div className={s.navActions}>
          {!isLoadingAuth && isAuthenticated ? (
            <>
              <Link href={dashboardHref} className={`${s.btn} ${s.btnDark} ${s.navCta}`}>
                Minha conta
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`${s.btn} ${s.btnEnter}`}
                aria-label="Sair"
              >
                <LogOut size={16} />
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={`${s.btn} ${s.btnEnter}`}>
                Entrar
              </Link>
              <Link href="#precos" className={`${s.btn} ${s.btnDark} ${s.navCta}`}>
                Criar loja
                <ArrowRight size={14} />
              </Link>
            </>
          )}
          <button className={s.burger} onClick={() => setOpen((o) => !o)} type="button" aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className={s.mobileMenu}>
          {LINKS.map((link) => (
            <a key={link.id} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <div className={s.mmCta}>
            {!isLoadingAuth && isAuthenticated ? (
              <>
                <Link href={dashboardHref} className={`${s.btn} ${s.btnDark}`} onClick={() => setOpen(false)}>
                  Minha conta
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`${s.btn} ${s.btnGhost}`}
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="#precos" className={`${s.btn} ${s.btnDark}`} onClick={() => setOpen(false)}>
                  Criar loja
                </Link>
                <Link href="/login" className={`${s.btn} ${s.btnGhost}`}>
                  Entrar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
