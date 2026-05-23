import type { ReactNode } from 'react'
import Link from 'next/link'

interface NexoLeftPanelProps {
  children: ReactNode
  footer?: ReactNode
}

export function NexoLeftPanel({ children, footer }: NexoLeftPanelProps) {
  return (
    <div className="nexo-left-panel hidden md:flex flex-col flex-shrink-0 h-screen w-[38%]">
      {/* Wordmark */}
      <div className="px-8 pt-8 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2.5 w-fit">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[13%]">
            <span className="text-xs font-bold text-white">N</span>
          </div>
          <span className="text-sm font-semibold text-white tracking-wide">nexo</span>
        </Link>
        <div className="mt-6 h-px bg-white/[9%]" />
      </div>

      {/* Middle — content slot */}
      <div className="flex-1 flex flex-col justify-center px-8">
        {children}
      </div>

      {/* Footer slot */}
      {footer && (
        <div className="px-8 pb-8 flex-shrink-0">
          {footer}
        </div>
      )}
    </div>
  )
}
