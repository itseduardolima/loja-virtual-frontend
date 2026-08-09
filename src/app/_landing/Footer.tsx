import Link from 'next/link'
import { Instagram, Facebook, Youtube } from 'lucide-react'
import s from '../landing.module.css'

export const Footer = () => (
  <footer className={s.footer}>
    <div className={s.wrap}>
      <div className={s.footerGrid}>
        <div className={s.footerBrand}>
          <Link href="/" className={s.logo}>
            <span className={s.logoMark}>N</span>nexo
          </Link>
          <p className={s.footerTagline}>A loja virtual que você gerencia do celular. Feita para lojistas de moda e calçados do Brasil.</p>
        </div>
        <div className={s.footerLinks}>
          <div className={s.footerCol}>
            <a href="#recursos">Recursos</a>
            <a href="#precos">Preços</a>
            <a href="#suporte">Suporte</a>
          </div>
          <div className={s.footerCol}>
            <Link href="/termos">Termos de uso</Link>
            <Link href="/privacidade">Privacidade</Link>
          </div>
        </div>
      </div>
      <div className={s.footerBottom}>
        <span>© 2026 Nexo · Feito no Brasil 🇧🇷</span>
        <div className={s.soc}>
          <span><Instagram size={18} color="#64748B" /></span>
          <span><Facebook size={18} color="#64748B" /></span>
          <span><Youtube size={18} color="#64748B" /></span>
        </div>
      </div>
    </div>
  </footer>
)
