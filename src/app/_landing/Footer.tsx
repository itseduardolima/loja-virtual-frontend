import Link from 'next/link'
import { Instagram, Youtube, Linkedin } from 'lucide-react'
import s from '../landing.module.css'
import { FOOTER_COLUMNS } from './data'

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.container}>
        <div className={s.footerGrid}>
          <div className={s.footerBrand}>
            <Link href="/" className={s.logo}>
              <span className={s.logoMark}>N</span>
              nexo
            </Link>
            <p className={s.footerTagline}>
              Sua loja virtual, sem complicação. Da criação ao primeiro pedido em menos de 10 minutos.
            </p>
            <div className={s.social}>
              <a href="#" aria-label="Instagram" className={s.socialLink}><Instagram size={16} /></a>
              <a href="#" aria-label="YouTube" className={s.socialLink}><Youtube size={16} /></a>
              <a href="#" aria-label="LinkedIn" className={s.socialLink}><Linkedin size={16} /></a>
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className={s.footerCol}>
              <h4>{col.heading}</h4>
              <ul className={s.footerLinks}>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={s.footerBottom}>
          <span>© 2026 Nexo Comércio Digital · CNPJ 00.000.000/0001-00</span>
          <span className={s.mono}>feito no Brasil 🇧🇷</span>
        </div>
      </div>
    </footer>
  )
}
