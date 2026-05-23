import { LoadingSpinner } from '@/components'
import { NAVY } from '../constants'

interface StepNicheProps {
  selectedIds: string[]
  nichesData: any
  nichesLoading: boolean
  errors: Record<string, string>
  onToggle: (id: string) => void
}

export function StepNiche({ selectedIds, nichesData, nichesLoading, errors, onToggle }: StepNicheProps) {
  const count = selectedIds.length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-gray-900 leading-tight text-2xl sm:text-3xl">
          O que você vai vender?
        </h2>
        <p className="text-sm text-gray-500 mt-1.5">
          Selecione todos que se aplicam — pode ser mais de um.
        </p>
      </div>

      {nichesLoading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner size="sm" />
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {nichesData?.data.map((niche: any) => {
            const selected = selectedIds.includes(niche.id.toString())
            return (
              <button
                key={niche.id}
                type="button"
                onClick={() => onToggle(niche.id.toString())}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm border transition-all"
                style={
                  selected
                    ? { background: NAVY, borderColor: NAVY, color: '#fff', fontWeight: 600 }
                    : { background: '#fff', borderColor: '#E5E7EB', color: '#374151' }
                }
              >
                {niche.name}
              </button>
            )
          })}
        </div>
      )}

      {errors.niche_ids && <p className="text-sm text-red-400">{errors.niche_ids}</p>}

      {!nichesLoading && (
        count === 0 ? (
          <p className="text-[13px] italic text-gray-400">Nenhum selecionado</p>
        ) : (
          <p className="text-[13px] text-green-600">
            {count} nicho{count > 1 ? 's' : ''} selecionado{count > 1 ? 's' : ''} ✓
          </p>
        )
      )}
    </div>
  )
}
