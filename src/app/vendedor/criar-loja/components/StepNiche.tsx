import { LoadingSpinner } from '@/components'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'
import { getNicheIcon } from '@/components/ProductForm/data'

interface StepNicheProps {
  selectedIds: string[]
  nichesData: any
  nichesLoading: boolean
  errors: Record<string, string>
  onToggle: (id: string) => void
}

export function StepNiche({ selectedIds, nichesData, nichesLoading, errors, onToggle }: StepNicheProps) {
  const primaryId = selectedIds[0]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold leading-tight text-gray-900 sm:text-3xl">
          O que você vai vender?
        </h2>
        <p className="mt-1.5 text-sm text-gray-500">
          Selecione todos que se aplicam — pode ser mais de um.
        </p>
      </div>

      {nichesLoading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner size="sm" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {nichesData?.data.map((niche: any) => {
            const id = niche.id.toString()
            const isSelected = selectedIds.includes(id)
            const isPrimary = isSelected && id === primaryId
            const NicheIcon = getNicheIcon(niche.slug)

            return (
              <button
                key={niche.id}
                type="button"
                onClick={() => onToggle(id)}
                className={cn(
                  'group relative flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all',
                  isSelected
                    ? 'border-nxp bg-nxp/[0.06] shadow-[0_1px_2px_hsl(237_49%_33%/0.12)]'
                    : 'border-nxborder bg-white hover:border-nxp/40 hover:bg-nxbg',
                )}
              >
                {isPrimary && (
                  <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-nxp px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.06em] text-white">
                    <Star className="h-2 w-2" fill="currentColor" strokeWidth={0} />
                    Primário
                  </span>
                )}

                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                    isSelected ? 'bg-nxp text-white' : 'bg-nxi3/10 text-nxi2 group-hover:text-nxp',
                  )}
                >
                  <NicheIcon size={18} />
                </span>

                <span
                  className={cn(
                    'text-[12.5px] font-semibold leading-tight',
                    isSelected ? 'text-nxp' : 'text-nxi1',
                  )}
                >
                  {niche.name}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {errors.niche_ids && (
        <p className="text-[12.5px] text-nxd">{errors.niche_ids}</p>
      )}
    </div>
  )
}
