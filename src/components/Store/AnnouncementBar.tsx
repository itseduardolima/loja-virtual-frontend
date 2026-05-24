'use client'

interface AnnouncementBarProps {
  onDismiss: () => void
}

export function AnnouncementBar({ onDismiss }: AnnouncementBarProps) {
  return (
    <div className="bg-primary h-9 flex items-center justify-center relative flex-shrink-0">
      <p className="text-[11px] tracking-[.06em] text-white text-center px-10">
        Frete grátis acima de R$199
      </p>
      <button
        onClick={onDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-white/40 hover:text-white/80 text-lg leading-none cursor-pointer p-1 transition-colors"
        aria-label="Fechar"
      >
        ×
      </button>
    </div>
  )
}
