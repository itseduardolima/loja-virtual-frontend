'use client'

interface ProductDescriptionSectionProps {
  description?: string
  category?: string
  dynamicFields?: Array<{ field_name: string; value: string }>
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function ProductDescriptionSection({
  description,
  category,
  dynamicFields,
}: ProductDescriptionSectionProps) {
  const chips: Array<[string, string]> = [
    ...(dynamicFields ?? [])
      .filter((f) => f.value && f.value.trim() !== '')
      .map((f) => [capitalize(f.field_name), f.value] as [string, string]),
    ...(category ? ([['Categoria', category]] as Array<[string, string]>) : []),
  ]

  return (
    <section id="descricao" className="border-t border-nxborder py-12 md:py-14">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-nxi3">
        Sobre o produto
      </span>
      <h2 className="mt-2 text-[22px] font-extrabold tracking-[-0.02em] text-nxi1 sm:text-[26px]">
        Descrição
      </h2>
      {description ? (
        <p className="mt-4 max-w-[68ch] break-words text-[14.5px] leading-relaxed text-nxi2">
          {description}
        </p>
      ) : (
        <p className="mt-4 text-[13.5px] text-nxi3">Este produto ainda não tem descrição.</p>
      )}
      {chips.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {chips.map(([key, value]) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 rounded-full border border-nxborder bg-nxbg px-3 py-1.5 text-[12px] font-semibold text-nxi2"
            >
              <span className="text-nxi3">{key}:</span> {value}
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
