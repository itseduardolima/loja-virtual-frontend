import type { CSSProperties, ReactNode } from 'react'

export interface IconProps {
  size?: number
  style?: CSSProperties
  className?: string
}

const Ic = ({ children, size = 20, ...rest }: IconProps & { children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {children}
  </svg>
)

export const IcCheck = (p: IconProps) => <Ic {...p}><path d="M20 6L9 17l-5-5" /></Ic>
export const IcArrow = (p: IconProps) => <Ic {...p}><path d="M5 12h14M13 5l7 7-7 7" /></Ic>
export const IcPlay = (p: IconProps) => <Ic {...p}><path d="M6 4l14 8-14 8V4z" fill="currentColor" stroke="none" /></Ic>
export const IcPlus = (p: IconProps) => <Ic {...p}><path d="M12 5v14M5 12h14" /></Ic>
export const IcKanban = (p: IconProps) => <Ic {...p}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 7v10M14 7v6"/></Ic>
export const IcChart = (p: IconProps) => <Ic {...p}><path d="M3 21V3M3 21h18" /><path d="M7 17V11M12 17V7M17 17v-4"/></Ic>
export const IcTag = (p: IconProps) => <Ic {...p}><path d="M20.6 12.6L12.6 20.6a2 2 0 01-2.8 0L2 12.8V3h9.8l8.8 8.8a2 2 0 010 2.8z" fill="currentColor" fillOpacity="0.1"/><circle cx="7" cy="8" r="1.5"/></Ic>
export const IcCart = (p: IconProps) => <Ic {...p}><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M3 3h2l3 12h11l2-8H6"/></Ic>
export const IcReceipt = (p: IconProps) => <Ic {...p}><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2V3z" fill="currentColor" fillOpacity="0.08"/><path d="M9 8h6M9 12h6M9 16h4"/></Ic>
export const IcDownload = (p: IconProps) => <Ic {...p}><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></Ic>
export const IcCard = (p: IconProps) => <Ic {...p}><rect x="2" y="5" width="20" height="14" rx="3" fill="currentColor" fillOpacity="0.08"/><path d="M2 10h20"/></Ic>
export const IcQ = (p: IconProps) => <Ic {...p}><circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.08"/><path d="M9.5 9.5a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5M12 17h.01"/></Ic>
export const IcInsta = (p: IconProps) => <Ic {...p}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></Ic>
export const IcYT = (p: IconProps) => <Ic {...p}><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l5 3-5 3V9z" fill="currentColor"/></Ic>
export const IcLI = (p: IconProps) => <Ic {...p}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 014 0v4M12 17v-7"/></Ic>
export const IcWA = (p: IconProps) => <Ic {...p}><path d="M21 12a9 9 0 01-13.5 7.8L3 21l1.3-4.5A9 9 0 1121 12z"/><path d="M9 9c0 4 3 7 7 7l1.5-2-2-1-1 1c-1.5-.5-2.5-1.5-3-3l1-1-1-2L9 9z" fill="currentColor"/></Ic>
