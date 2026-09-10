import Link from 'next/link'
import s from '../landing.module.css'

export const Footer = () => (
  <footer className={s.footer}>
    <div className={s.wrap}>
      <div className={s.footerTop}>
        <div className={s.footerBrand}>
          <Link href="/" className={s.logo}>
            <span className={s.logoMark}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15l8-9 8 9" />
              </svg>
            </span>
            nexo
          </Link>
          <p className={s.footerTag}>
            A loja virtual que você gerencia do celular — contato@nexo.com.br
          </p>
        </div>
        <div className={s.footerCols}>
          <div className={s.footerCol}>
            <div className={s.footerColLabel}>Produto</div>
            <a href="#recursos">Recursos</a>
            <a href="#precos">Preços</a>
            <a href="#suporte">Suporte</a>
          </div>
          <div className={s.footerCol}>
            <div className={s.footerColLabel}>Empresa</div>
            <Link href="/sobre">Sobre</Link>
            <a href="#precos">Criar loja</a>
          </div>
          <div className={s.footerCol}>
            <div className={s.footerColLabel}>Legal</div>
            <Link href="/termos">Termos de uso</Link>
            <Link href="/privacidade">Privacidade</Link>
          </div>
        </div>
      </div>
      <div className={s.footerBottomRow}>
        <div className={s.footerLegal}>
          <span>© 2026 Nexo · Feito no Brasil 🇧🇷</span>
          <span>Todos os direitos reservados</span>
        </div>
      </div>
    </div>
  </footer>
)
