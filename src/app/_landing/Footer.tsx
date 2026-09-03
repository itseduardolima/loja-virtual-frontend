import Link from 'next/link'
import { Instagram, Facebook, Youtube } from 'lucide-react'
import s from '../landing.module.css'

export const Footer = () => (
  <footer className={s.footer}>
    <div className={s.wrap}>
      <div className={s.footerRow}>
        <Link href="/" className={s.logo}>
          <span className={s.logoMark}>N</span>nexo
        </Link>
        <nav className={s.footerInlineLinks}>
          <a href="#recursos">Recursos</a>
          <a href="#precos">Preços</a>
          <a href="#suporte">Suporte</a>
          <Link href="/termos">Termos de uso</Link>
          <Link href="/privacidade">Privacidade</Link>
        </nav>
        <div className={s.soc}>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
            <Instagram size={18} color="var(--t3)" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
            <Facebook size={18} color="var(--t3)" />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="Youtube">
            <Youtube size={18} color="var(--t3)" />
          </a>
        </div>
      </div>
      <div className={s.footerBottom}>
        <p className={s.footerTagline}>
          A loja virtual que você gerencia do celular. Feita para lojistas de moda e calçados do
          Brasil.
        </p>
        <span>© 2026 Nexo · Feito no Brasil 🇧🇷</span>
      </div>
    </div>
  </footer>
)
