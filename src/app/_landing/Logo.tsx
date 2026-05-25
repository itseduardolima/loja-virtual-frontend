import s from '../landing.module.css'
import { handleAnchor } from './scroll'

interface NexoLogoProps {
  size?: number
  color?: string
  color2?: string
}

export const NexoLogo = ({ size = 28, color = '#4F46E5', color2 = '#10B981' }: NexoLogoProps) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <defs>
      <linearGradient id="nexoStroke" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={color} />
        <stop offset="1" stopColor={color2} />
      </linearGradient>
    </defs>
    <path d="M5 19 C 9 7, 19 21, 23 9" stroke="url(#nexoStroke)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    <circle cx="5" cy="19" r="3" fill={color} />
    <circle cx="23" cy="9" r="3" fill={color2} />
  </svg>
)

export const NexoWordmark = () => (
  <a href="#top" className={s.logo} onClick={(e) => handleAnchor(e, '#top')}>
    <span className={s.logoMark}><NexoLogo /></span>
    <span>Nexo</span>
  </a>
)
