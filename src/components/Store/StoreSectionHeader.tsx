interface StoreSectionHeaderProps {
  eyebrow: string
  title: string
  /** Tamanho do h2 — 'md' (rows) ou 'lg' (coleção). Default: 'md'. */
  size?: 'md' | 'lg'
}

/**
 * Gramática editorial da vitrine: eyebrow mono-uppercase (voz do lojista)
 * sobre título display em Integral CF. Reusado em coleção, rows e banners.
 */
export function StoreSectionHeader({ eyebrow, title, size = 'md' }: StoreSectionHeaderProps) {
  return (
    <div>
      <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-store-ink sm:text-[12px]">
        {eyebrow}
      </span>
      <h2
        className={
          size === 'lg'
            ? 'mt-3 font-integral text-[28px] leading-[1] tracking-[-0.03em] text-nxi1 sm:text-[38px]'
            : 'mt-3 font-integral text-[24px] leading-[1] tracking-[-0.03em] text-nxi1 sm:text-[34px]'
        }
      >
        {title}
      </h2>
    </div>
  )
}
