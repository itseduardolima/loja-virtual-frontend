'use client'

interface ProductFactsCardProps {
  /** dynamic_fields do produto que não são eixos de variação (cor/tamanho) */
  fields: Array<{ field_name: string; value: string }>
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** Ficha do produto: os campos por nicho como pares rótulo/valor num card único
 *  — é o único lugar da página onde os dynamic_fields aparecem. */
export function ProductFactsCard({ fields }: ProductFactsCardProps) {
  const facts = fields.filter((f) => f.value && f.value.trim() !== '')
  if (facts.length === 0) return null

  return (
    <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3.5 rounded-xl border border-nxborder bg-nxsurf px-4 py-3.5">
      {facts.map((f) => (
        <div key={f.field_name} className="min-w-0">
          <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-nxi3">
            {capitalize(f.field_name)}
          </dt>
          <dd className="mt-0.5 break-words text-[12.5px] font-bold text-nxi1">{f.value}</dd>
        </div>
      ))}
    </dl>
  )
}
