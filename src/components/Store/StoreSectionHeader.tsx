interface StoreSectionHeaderProps {
  eyebrow: string
  title: string
  /** Tamanho do h2 — 'md' (22/26px, rows) ou 'lg' (24/30px, coleção). Default: 'md'. */
  size?: 'md' | 'lg'
}

export function StoreSectionHeader({ eyebrow, title, size = 'md' }: StoreSectionHeaderProps) {
  return (
    <div>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-nxi3">
        {eyebrow}
      </span>
      <h2
        className={
          size === 'lg'
            ? 'mt-1.5 text-[24px] font-extrabold tracking-[-0.02em] text-nxi1 sm:text-[30px]'
            : 'mt-1.5 text-[22px] font-extrabold tracking-[-0.02em] text-nxi1 sm:text-[26px]'
        }
      >
        {title}
      </h2>
    </div>
  )
}
